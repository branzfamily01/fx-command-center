const SESSION_COOKIE = "__limited_session";
const SESSION_TTL = 60 * 60 * 24 * 30;
const encoder = new TextEncoder();

function b64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromB64url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}

async function verify(value, signature, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  return crypto.subtle.verify("HMAC", key, fromB64url(signature), encoder.encode(value));
}

function getCookie(request) {
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp("(?:^|;\\\\s*)" + SESSION_COOKIE + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : null;
}

async function hasSession(request, secret) {
  const token = getCookie(request);
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const issuedAt = Number(parts[0]);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > SESSION_TTL * 1000) return false;
  return verify(parts[0], parts[1], secret);
}

function pageShell(message) {
  const safeMessage = String(message || "").replace(/[&<>"']/g, function (char) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
  });
  return "<!doctype html><html lang=\"ja\"><head><meta charset=\"utf-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
    "<title>Limited Content</title><style>" +
    "body{font-family:system-ui,sans-serif;background:#f4f7fb;color:#172033;display:grid;place-items:center;min-height:100vh;margin:0}" +
    "main{background:white;padding:2rem;max-width:24rem;width:calc(100% - 3rem);border-radius:16px;box-shadow:0 8px 30px #17203322}" +
    "h1{font-size:1.35rem;margin-top:0}label{display:block;margin:.8rem 0 .35rem}input{box-sizing:border-box;width:100%;padding:.75rem;border:1px solid #b8c2d1;border-radius:8px;font-size:1rem}" +
    "button{width:100%;margin-top:1rem;padding:.75rem;border:0;border-radius:8px;background:#2457d6;color:white;font-size:1rem;cursor:pointer}.error{color:#b42318;margin:.75rem 0}" +
    "</style></head><body><main><h1>Limitedコンテンツ</h1>" +
    "<p>閲覧するにはパスワードを入力してください。</p>" +
    (safeMessage ? "<p class=\"error\">" + safeMessage + "</p>" : "") +
    "<form method=\"post\" action=\"/__limited/login\"><label for=\"password\">パスワード</label>" +
    "<input id=\"password\" name=\"password\" type=\"password\" autocomplete=\"current-password\" required>" +
    "<button type=\"submit\">開く</button></form></main></body></html>";
}

function loginResponse(message, status) {
  return new Response(pageShell(message), {
    status: status || 401,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const secret = env.LIMITED_PASSWORD;

    if (url.pathname === "/__limited/login" && request.method === "POST") {
      if (!secret) return loginResponse("認証設定がまだ完了していません。", 503);
      const form = await request.formData();
      const password = String(form.get("password") || "");
      if (!password || password !== secret) return loginResponse("パスワードが違います。", 401);
      const issuedAt = String(Date.now());
      const token = issuedAt + "." + await sign(issuedAt, secret);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": SESSION_COOKIE + "=" + encodeURIComponent(token) + "; Max-Age=" + SESSION_TTL + "; Path=/; HttpOnly; Secure; SameSite=Lax"
        }
      });
    }

    if (url.pathname === "/__limited/logout") {
      return new Response("ログアウトしました。", {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "Set-Cookie": SESSION_COOKIE + "=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax"
        }
      });
    }

    if (!secret) return loginResponse("認証設定がまだ完了していません。", 503);
    if (!(await hasSession(request, secret))) return loginResponse("", 401);

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "private, no-store");
    return new Response(response.body, { status: response.status, headers });
  }
};
