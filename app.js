const demoTrades = [
  {date:'2026.08.31 09:18', ea:'Horizon Grid v3', symbol:'EURUSD', type:'BUY', lots:.30, profit:86.40},
  {date:'2026.08.30 14:42', ea:'London Breakout', symbol:'GBPUSD', type:'SELL', lots:.20, profit:124.80},
  {date:'2026.08.29 08:06', ea:'Momentum X', symbol:'USDJPY', type:'BUY', lots:.40, profit:-48.20},
  {date:'2026.08.28 11:31', ea:'Horizon Grid v3', symbol:'EURUSD', type:'SELL', lots:.30, profit:72.10},
  {date:'2026.08.27 16:10', ea:'Range Hunter', symbol:'AUDUSD', type:'BUY', lots:.25, profit:61.90},
  {date:'2026.08.26 09:55', ea:'London Breakout', symbol:'GBPUSD', type:'BUY', lots:.20, profit:-22.40},
  {date:'2026.08.25 13:03', ea:'Horizon Grid v3', symbol:'EURUSD', type:'BUY', lots:.30, profit:95.30},
  {date:'2026.08.22 07:48', ea:'Momentum X', symbol:'USDJPY', type:'SELL', lots:.40, profit:118.60}
];
const eaData = [
  {id:'horizon', name:'Horizon Grid v3', symbol:'EURUSD', status:'watch', pnl:1842.30, return:12.4, dd:8.42, win:68.2, trades:42, last:'12 min ago', uptime:'99.8%', heartbeat:'12 sec ago', note:'DDが過去30日平均を上回っています。'},
  {id:'london', name:'London Breakout', symbol:'GBPUSD', status:'healthy', pnl:1420.80, return:9.8, dd:5.10, win:61.9, trades:31, last:'48 min ago', uptime:'99.9%', heartbeat:'48 sec ago', note:'ロンドン時間に正常稼働中。'},
  {id:'momentum', name:'Momentum X', symbol:'USDJPY', status:'watch', pnl:980.45, return:6.7, dd:6.30, win:57.4, trades:27, last:'2 hr ago', uptime:'98.2%', heartbeat:'2 min ago', note:'約定遅延がやや増加しています。'},
  {id:'range', name:'Range Hunter', symbol:'AUDUSD', status:'healthy', pnl:845.20, return:5.9, dd:4.20, win:64.8, trades:20, last:'3 hr ago', uptime:'99.7%', heartbeat:'3 min ago', note:'安定稼働中。'},
  {id:'carry', name:'Carry Shield', symbol:'NZDJPY', status:'healthy', pnl:612.10, return:4.2, dd:3.10, win:70.1, trades:18, last:'5 hr ago', uptime:'99.5%', heartbeat:'5 min ago', note:'安定稼働中。'},
  {id:'scalper', name:'Tokyo Scalper', symbol:'USDJPY', status:'offline', pnl:-210.00, return:-1.4, dd:2.80, win:49.2, trades:11, last:'1 day ago', uptime:'92.1%', heartbeat:'offline', note:'市場時間外に停止中。'}
];
const state = {trades:[...demoTrades], promptType:'review'};
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const formatMoney = (n, digits=2) => `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:digits,maximumFractionDigits:digits})}`;
const formatSignedMoney = n => `${n >= 0 ? '+' : '-'}$${Math.abs(n).toLocaleString('en-US',{maximumFractionDigits:0})}`;
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),2800)}
function setView(view){
  $$('.view').forEach(el=>el.classList.toggle('active',el.dataset.viewPanel===view));
  $$('.nav-item[data-view]').forEach(el=>el.classList.toggle('active',el.dataset.view===view));
  const label={overview:'DASHBOARD',analysis:'EA ANALYSIS',health:'EA HEALTH',import:'CSV IMPORT',lab:'LAB / SCENARIO',risk:'RISK CONSOLE',prompt:'AI PROMPT'}[view]||'DASHBOARD';
  $('#breadcrumb').textContent=label; history.replaceState(null,'',`#${view}`); $('#sidebar').classList.remove('open');
}
function drawEquity(){
  const svg=$('#equity-chart'); if(!svg)return;
  const values=[38000,39100,38400,40200,39800,41100,40500,42000,43100,42500,44200,45400,44800,46300,47200,46800,48260];
  const w=720,h=220,pad=8; const min=35000,max=50000;
  const pts=values.map((v,i)=>[pad+i*(w-pad*2)/(values.length-1),h-pad-(v-min)/(max-min)*(h-pad*2)]);
  const line=pts.map(p=>p.join(',')).join(' '); const area=`${pad},${h} ${line} ${w-pad},${h}`;
  svg.innerHTML=`<defs><linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#58d6b0" stop-opacity=".24"/><stop offset="1" stop-color="#58d6b0" stop-opacity="0"/></linearGradient></defs><line x1="0" y1="54" x2="720" y2="54" stroke="#20334a"/><line x1="0" y1="108" x2="720" y2="108" stroke="#20334a"/><line x1="0" y1="162" x2="720" y2="162" stroke="#20334a"/><polygon points="${area}" fill="url(#areaGradient)"/><polyline points="${line}" fill="none" stroke="#58d6b0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${pts.at(-1)[0]}" cy="${pts.at(-1)[1]}" r="4" fill="#58d6b0" stroke="#0e2130" stroke-width="3"/>`;
}
function statusTag(status){const label=status==='healthy'?'Healthy':status==='watch'?'Watch':'Offline';return `<span class="status-tag ${status==='watch'?'watch':''}"><i></i>${label}</span>`}
function renderHealthTable(){
  $('#health-table').innerHTML=eaData.slice(0,4).map(e=>`<tr><td class="ea-name">${e.name}</td><td>${statusTag(e.status)}</td><td class="${e.pnl>=0?'pnl-positive':'pnl-negative'}">${formatSignedMoney(e.pnl)}</td><td class="${e.dd>7?'pnl-negative':''}">-${e.dd.toFixed(2)}%</td><td>${e.last}</td></tr>`).join('');
}
function currentAnalysisData(){
  if(!localStorage.getItem('fxcc-trades')) return eaData;
  const groups={};
  state.trades.forEach(t=>{const key=t.ea||'Imported EA';if(!groups[key])groups[key]={name:key,symbol:t.symbol||'—',pnl:0,trades:0,wins:0,curve:0,peak:0,maxLoss:0};const g=groups[key];g.pnl+=Number(t.profit)||0;g.trades++;if((Number(t.profit)||0)>0)g.wins++;g.curve+=Number(t.profit)||0;g.peak=Math.max(g.peak,g.curve);g.maxLoss=Math.max(g.maxLoss,g.peak-g.curve)});
  return Object.values(groups).map((g,i)=>({id:`imported-${i}`,name:g.name,symbol:g.symbol,status:g.maxLoss>400?'watch':'healthy',pnl:g.pnl,return:g.pnl/100,dd:Math.min(99,g.maxLoss/482.6),win:g.trades?g.wins/g.trades*100:0,trades:g.trades,last:'imported',uptime:'—',heartbeat:'—',note:'CSVから集計されたEAです。'}));
}
function renderAnalysis(filter='all'){
  const list=currentAnalysisData().filter(e=>filter==='all'||(filter==='active'&&e.status!=='offline')||(filter==='watch'&&e.status==='watch'));
  $('#analysis-cards').innerHTML=list.map(e=>`<article class="ea-card"><div class="ea-card-head"><div><h3>${e.name}</h3><div class="symbol">${e.symbol} · ${e.trades} trades</div></div><span class="health-tag ${e.status==='watch'?'watch':''}">${e.status==='watch'?'WATCH':'HEALTHY'}</span></div><div class="ea-card-value ${e.pnl>=0?'positive':'negative'}">${formatSignedMoney(e.pnl)}</div><div class="ea-card-grid"><div><span>RETURN</span><strong class="positive">+${e.return}%</strong></div><div><span>MAX DD</span><strong class="${e.dd>7?'negative':''}">-${e.dd}%</strong></div><div><span>WIN RATE</span><strong>${e.win}%</strong></div></div></article>`).join('');
}
function renderTrades(){
  const rows=state.trades.slice(0,8); $('#trade-count').textContent=`${state.trades.length} trades`;
  $('#trade-table').innerHTML=rows.map(t=>`<tr><td>${t.date}</td><td class="ea-name">${t.ea}</td><td>${t.symbol}</td><td>${t.type}</td><td>${Number(t.lots).toFixed(2)}</td><td class="${t.profit>=0?'pnl-positive':'pnl-negative'}">${formatSignedMoney(Number(t.profit))}</td></tr>`).join('');
}
function renderHealthList(){
  $('#health-list').innerHTML=eaData.map(e=>`<article class="health-row"><div><h3>${e.name}</h3><p>${e.symbol} · ${e.note}</p></div><div class="health-metric"><span>STATUS</span>${statusTag(e.status)}</div><div class="health-metric"><span>UPTIME</span><strong>${e.uptime}</strong></div><div class="health-metric"><span>HEARTBEAT</span><strong class="${e.status==='offline'?'negative':''}">${e.heartbeat}</strong></div><div class="health-metric last-trade"><span>LAST P/L</span><strong class="${e.pnl>=0?'positive':'negative'}">${formatSignedMoney(e.pnl)}</strong></div><button class="action-button" data-health-ea="${e.id}">詳細</button></article>`).join('');
}
function updateDataset(){
  const custom=localStorage.getItem('fxcc-trades'); const from=custom?JSON.parse(custom):null;
  $('#dataset-status').innerHTML=from?`<strong>custom-import.csv</strong> · ${from.length} trades · ${new Date(Number(localStorage.getItem('fxcc-imported-at'))||Date.now()).toLocaleString('ja-JP')}<br><span class="muted">読み込み済み。分析・プロンプトの入力に使用されています。</span>`:`<strong>デモデータ</strong> · ${state.trades.length} trades · 2026.08.01 – 2026.08.31<br><span class="muted">サンプルデータで各機能を試せます。CSVを読み込むと置き換わります。</span>`;
}
function parseCsv(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i],next=text[i+1];if(c==='"'&&quoted&&next==='"'){cell+='"';i++;continue}if(c==='"'){quoted=!quoted;continue}if(c===','&&!quoted){row.push(cell.trim());cell='';continue}if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&next==='\n')i++;row.push(cell.trim());cell='';if(row.some(Boolean))rows.push(row);row=[];continue}cell+=c}if(cell||row.length){row.push(cell.trim());rows.push(row)}
  if(rows.length<2) return [];
  const headers=rows[0].map(h=>h.toLowerCase().replace(/[\s_]/g,''));
  const find=(patterns)=>headers.findIndex(h=>patterns.some(p=>h.includes(p)));
  const dateI=find(['time','date']), eaI=find(['ea','expert','magic']), symI=find(['symbol','item']), typeI=find(['type','side']), lotI=find(['lots','volume']), profitI=find(['profit','p/l','pl']);
  return rows.slice(1).map((r,i)=>({date:r[dateI>=0?dateI:0]||`Imported ${i+1}`,ea:r[eaI>=0?eaI:1]||'Imported EA',symbol:r[symI>=0?symI:2]||'EURUSD',type:(r[typeI>=0?typeI:3]||'BUY').toUpperCase(),lots:parseFloat(String(r[lotI>=0?lotI:4]).replace(/[^\d.-]/g,''))||0,profit:parseFloat(String(r[profitI>=0?profitI:5]).replace(/[^\d.-]/g,''))||0})).filter(r=>r.date||r.profit);
}
function processFile(file){
  if(!file)return;if(file.size>10*1024*1024){toast('ファイルが大きすぎます（最大10MB）');return}
  const reader=new FileReader();reader.onload=()=>{const parsed=parseCsv(reader.result);if(!parsed.length){toast('CSVの列を認識できませんでした');return}state.trades=parsed;localStorage.setItem('fxcc-trades',JSON.stringify(parsed));localStorage.setItem('fxcc-imported-at',String(Date.now()));renderTrades();renderAnalysis();updateDataset();promptText();toast(`${parsed.length}件の取引を読み込みました`);setView('analysis');};reader.readAsText(file);
}
function calculateRisk(){
  const equity=Math.max(0,Number($('#risk-equity').value)||0), pct=Number($('#risk-pct').value)||1, sl=Math.max(1,Number($('#risk-sl').value)||1), pip=Number($('#risk-pair').value)||10, allowed=equity*pct/100, lot=allowed/(sl*pip);
  $('#recommended-lot').innerHTML=`${lot.toFixed(2)} <small>lots</small>`;$('#risk-amount').textContent=formatMoney(allowed);$('#allowed-loss').textContent=formatMoney(allowed);$('#sl-display').textContent=`${sl} pips`;$('#risk-pct-output').textContent=`${pct.toFixed(1)}%`;$('#risk-meter-fill').style.width=`${Math.min(100,pct/5*100)}%`;$('#risk-level').textContent=`Within your ${pct.toFixed(1)}% limit`;
  renderRiskMatrix(equity,pip,sl);
}
function renderRiskMatrix(equity=48260,pip=10,sl=35){const pcts=[.5,1,1.5,2,3],sls=[20,35,50,75,100];$('#risk-table').innerHTML=`<div class="risk-grid"><div class="risk-head">SL / Risk</div>${pcts.map(p=>`<div class="risk-head">${p}%</div>`).join('')}${sls.map(s=>`<div class="risk-head">${s} pips</div>${pcts.map(p=>{const lot=equity*p/100/(s*pip);const cls=p>=2?'hot':p<=1?'safe':'';return `<div class="${cls}">${lot.toFixed(2)}</div>`}).join('')}`).join('')}</div>`}
function updateLab(){
  const lot=Number($('#lot-slider').value),win=Number($('#win-slider').value),spread=Number($('#spread-slider').value),period=Number($('#lab-period').value);$('#lot-output').textContent=`${lot.toFixed(2)}x`;$('#win-output').textContent=`${win>=0?'+':''}${win}%`;$('#spread-output').textContent=`+${spread}%`;
  const multiplier=lot*(1+win/100)*(1-spread/250), horizon=period/30, profit=8260*multiplier*horizon, dd=8.42*lot*(1+spread/180)-win*.08, sharpe=Math.max(.2,1.42*(1+win/100)/(lot*.72+0.28));
  $('#projected-profit').textContent=formatSignedMoney(profit);$('#profit-delta').textContent=`${profit>=8260?'+':''}${((profit/8260-1)*100).toFixed(1)}% vs baseline`;$('#profit-delta').className=profit>=8260?'positive':'negative';$('#projected-dd').textContent=`-${dd.toFixed(2)}%`;$('#dd-delta').textContent=`${dd<=8.42?'+':''}${(8.42-dd).toFixed(2)}pt vs baseline`;$('#dd-delta').className=dd<=8.42?'positive':'negative';$('#projected-sharpe').textContent=sharpe.toFixed(2);$('#sharpe-delta').textContent=`${sharpe>=1.42?'+':''}${(sharpe-1.42).toFixed(2)} vs baseline`;
  $('#scenario-caption').textContent=`${$('#lab-ea').selectedOptions[0].text} · ${period}日間の期待値`;$('#lab-insight').textContent=dd>10?`ロット倍率 ${lot.toFixed(2)}x では想定DDが10%を超えます。まずは1.00x以下でフォワードテストするのが安全です。`:win<0?`勝率が${Math.abs(win)}%低下すると期待損益は縮小します。スプレッドの大きい時間帯を避ける条件を検討してください。`:`このシナリオでは期待損益とDDのバランスが許容範囲です。実運用前に少なくとも90日分のフォワードデータで確認してください。`;
}
function promptText(){
  const title={review:'EAポートフォリオの成績レビュー',risk:'ポートフォリオのリスクとDDの診断',improve:'EAポートフォリオの改善ポイント提案',compare:'EA別パフォーマンスの比較'}[state.promptType];
  const context=$('#prompt-context').value.trim();const perf=currentAnalysisData().slice(0,5).map(e=>`- ${e.name} (${e.symbol}): 損益 ${formatSignedMoney(e.pnl)}, Return ${e.return>=0?'+':''}${Number(e.return).toFixed(1)}%, Max DD -${Number(e.dd).toFixed(2)}%, 勝率 ${Number(e.win).toFixed(1)}%`).join('\n');
  const text=`あなたは経験豊富なFXシステムトレードのリサーチャーです。以下のデータをもとに「${title}」を日本語で行ってください。\n\n【目的】\n${title}について、事実と推測を分けて、実行可能な提案をしてください。過度な断定や利益保証は避けてください。\n\n【ポートフォリオ概要】\nEquity: $48,260.40\nNet Profit: $8,260.40\nMax Drawdown: -8.42%\nActive EAs: 4 / 6\n\n【EA別パフォーマンス】\n${perf}\n\n【直近の取引】\n${state.trades.slice(0,5).map(t=>`- ${t.date} | ${t.ea} | ${t.symbol} ${t.type} ${t.lots} lots | ${formatSignedMoney(Number(t.profit))}`).join('\n')}\n\n【回答フォーマット】\n1. エグゼクティブサマリー（3行以内）\n2. 重要な観察（数値を引用）\n3. リスク・注意点\n4. 次の7日間で試すこと（優先順位付き）\n5. 追加で必要なデータ\n${context?`\n【ユーザーからの追加質問】\n${context}`:''}`;
  $('#generated-prompt').textContent=text;$('#prompt-length').textContent=`${text.length.toLocaleString()} characters`;return text;
}
function copyPrompt(){navigator.clipboard?.writeText(promptText()).then(()=>toast('プロンプトをコピーしました')).catch(()=>toast('コピーに失敗しました。テキストを選択してコピーしてください'))}
function sampleCsv(){const text='Time,Expert,Symbol,Type,Volume,Profit\n2026.08.31 09:18,Horizon Grid v3,EURUSD,BUY,0.30,86.40\n2026.08.30 14:42,London Breakout,GBPUSD,SELL,0.20,124.80\n2026.08.29 08:06,Momentum X,USDJPY,BUY,0.40,-48.20\n';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/csv'}));a.download='fx-command-center-sample.csv';a.click();URL.revokeObjectURL(a.href)}
function init(){
  const saved=localStorage.getItem('fxcc-trades');if(saved){try{state.trades=JSON.parse(saved)}catch{state.trades=[...demoTrades]}}
  $$('.nav-item[data-view], [data-go]').forEach(el=>el.addEventListener('click',()=>setView(el.dataset.view||el.dataset.go)));
  $('#mobile-menu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));$('#reset-data').addEventListener('click',()=>{state.trades=[...demoTrades];localStorage.removeItem('fxcc-trades');localStorage.removeItem('fxcc-imported-at');renderTrades();renderAnalysis();updateDataset();promptText();toast('デモデータに戻しました')});
  $('#choose-file').addEventListener('click',()=>$('#csv-file').click());$('#csv-file').addEventListener('change',e=>processFile(e.target.files[0]));$('#download-sample').addEventListener('click',sampleCsv);$('#clear-data').addEventListener('click',()=>{localStorage.removeItem('fxcc-trades');localStorage.removeItem('fxcc-imported-at');state.trades=[...demoTrades];renderTrades();renderAnalysis();updateDataset();promptText();toast('保存データをクリアしました')});
  const drop=$('#drop-zone');['dragenter','dragover'].forEach(name=>drop.addEventListener(name,e=>{e.preventDefault();drop.classList.add('dragover')}));['dragleave','drop'].forEach(name=>drop.addEventListener(name,e=>{e.preventDefault();drop.classList.remove('dragover')}));drop.addEventListener('drop',e=>processFile(e.dataTransfer.files[0]));
  $$('#ea-filter button').forEach(btn=>btn.addEventListener('click',()=>{$$('#ea-filter button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderAnalysis(btn.dataset.filter)}));$('#refresh-health').addEventListener('click',()=>{toast('全EAのハートビートを確認しました');renderHealthList()});
  $('#calculate-risk').addEventListener('click',()=>{calculateRisk();toast('リスクを再計算しました')});$('#risk-pct').addEventListener('input',calculateRisk);$('#reset-lab').addEventListener('click',()=>{$('#lot-slider').value=1;$('#win-slider').value=0;$('#spread-slider').value=0;updateLab()});['lot-slider','win-slider','spread-slider','lab-period','lab-ea'].forEach(id=>$('#'+id).addEventListener('input',updateLab));$('#run-lab').addEventListener('click',()=>{updateLab();$('#lab-status').textContent='COMPLETED';toast('シナリオを実行しました')});
  $$('#prompt-presets button').forEach(btn=>btn.addEventListener('click',()=>{$$('#prompt-presets button').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');state.promptType=btn.dataset.prompt;promptText()}));$('#prompt-context').addEventListener('input',promptText);$$('#copy-prompt,#copy-prompt-bottom').forEach(b=>b.addEventListener('click',copyPrompt));
  $$('.segmented button').forEach(btn=>btn.addEventListener('click',()=>{$$('.segmented button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');drawEquity()}));
  renderHealthTable();renderAnalysis();renderHealthList();renderTrades();updateDataset();drawEquity();calculateRisk();updateLab();promptText();$('#last-updated').textContent=new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'});setView(location.hash.slice(1)||'overview');
}
document.addEventListener('DOMContentLoaded',init);
