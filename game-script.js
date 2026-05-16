// ─── GAME PAGE LOGIC ───
const gs = {
  playerName:'',playerAge:0,playerGrade:'',
  currentWeek:1,currentDay:1,
  money:0,weeklyAllowance:0,
  energy:10,health:10,friendship:10,family:10,grades:85,stress:3,
  totalSpent:0,
  debt:0,
};

// Initialize game state from session storage
function initGameState(){
  gs.playerName = sessionStorage.getItem('playerName') || '';
  gs.playerAge = parseInt(sessionStorage.getItem('playerAge')) || 0;
  gs.playerGrade = sessionStorage.getItem('playerGrade') || 'jhs-lower';
  
  if(!gs.playerName){
    window.location.href='index.html';
    return;
  }
  
  const cfg=gradeConfig[gs.playerGrade];
  gs.weeklyAllowance=cfg.weeklyAllowance;
  gs.money=cfg.weeklyAllowance;
  
  document.getElementById('displayName').textContent=gs.playerName;
  document.getElementById('weekTotal').textContent=cfg.duration;
  
  // Create day progress dots on the side
  const sideBar=document.getElementById('dayProgressSide');
  for(let i=0;i<cfg.duration*7;i++){
    const dot=document.createElement('div');
    dot.className='day-dot-side'+(i===0?' done':'');
    dot.style.animationDelay=(0.4+i*0.05)+'s';
    sideBar.appendChild(dot);
  }
  
  // Setup stats panel toggle
  document.getElementById('statsBtn').addEventListener('click',()=>{
    document.getElementById('statsPanel').classList.add('show');
    updateDebtInfo();
  });
  
  document.getElementById('statsClose').addEventListener('click',()=>{
    document.getElementById('statsPanel').classList.remove('show');
  });
  
  document.getElementById('statsPanel').addEventListener('click',(e)=>{
    if(e.target.id==='statsPanel'){
      document.getElementById('statsPanel').classList.remove('show');
    }
  });

  // Setup nanay button and modal
  document.getElementById('nanayBtn').addEventListener('click',()=>{
    document.getElementById('nanayModal').classList.add('show');
  });

  document.getElementById('nanayModalClose').addEventListener('click',()=>{
    document.getElementById('nanayModal').classList.remove('show');
  });

  document.getElementById('borrowCancel').addEventListener('click',()=>{
    document.getElementById('nanayModal').classList.remove('show');
    document.getElementById('borrowAmount').value='';
  });

  document.getElementById('borrowConfirm').addEventListener('click',()=>{
    const amt=parseInt(document.getElementById('borrowAmount').value)||0;
    if(amt>0){
      gs.money+=amt;
      gs.debt+=amt;
      showToast('💵 Nanay gave you ₱'+amt+'! Remember: next week -₱'+amt,'tip');
      document.getElementById('nanayModal').classList.remove('show');
      document.getElementById('borrowAmount').value='';
      updateUI();
      updateDebtInfo();
    }
  });
  
  document.getElementById('nanayModal').addEventListener('click',(e)=>{
    if(e.target.id==='nanayModal'){
      document.getElementById('nanayModal').classList.remove('show');
    }
  });

  // Setup quit button and modal
  document.getElementById('quitBtn').addEventListener('click',()=>{
    document.getElementById('quitModal').classList.add('show');
  });

  document.getElementById('quitContinue').addEventListener('click',()=>{
    document.getElementById('quitModal').classList.remove('show');
  });

  document.getElementById('quitConfirm').addEventListener('click',()=>{
    sessionStorage.clear();
    window.location.href='index.html';
  });

  document.getElementById('quitModal').addEventListener('click',(e)=>{
    if(e.target.id==='quitModal'){
      document.getElementById('quitModal').classList.remove('show');
    }
  });
  
  updateUI();
  loadScenario();
}

// ─── SCENARIO ──────────────────────────────────────────────
let usedIdx=[];
function loadScenario(){
  const pool=scenariosDB[gs.playerGrade]||scenariosDB['jhs-lower'];
  if(usedIdx.length>=pool.length)usedIdx=[];
  let i;
  do{i=Math.floor(Math.random()*pool.length);}
  while(usedIdx.includes(i)&&usedIdx.length<pool.length);
  usedIdx.push(i);
  displayScenario(pool[i]);
}

function displayScenario(sc){
  document.getElementById('scenLoc').textContent=sc.loc||'Sa Paaralan';
  document.getElementById('scenTitle').textContent=sc.title;
  document.getElementById('scenText').textContent=sc.text;
  const panel=document.getElementById('choicesPanel');panel.innerHTML='';
  // Add staggered animation to buttons
  let delay=0;
  sc.choices.forEach(ch=>{
    const btn=document.createElement('button');
    btn.className='choice-btn-spent '+ch.type;btn.textContent=ch.text;
    btn.style.animationDelay=(0.4+delay*0.1)+'s';
    btn.onclick=()=>makeChoice(ch);panel.appendChild(btn);
    delay++;
  });
}

// ─── CHOICE ────────────────────────────────────────────────
function makeChoice(ch){
  document.querySelectorAll('.choice-btn-spent').forEach(b=>b.disabled=true);
  const oldMoney=gs.money;
  gs.money+=-(ch.cost);
  if(ch.cost>0)gs.totalSpent+=ch.cost;
  const im=ch.impact;
  gs.energy    =clamp(gs.energy    +(im.energy    ||0),0,10);
  gs.health    =clamp(gs.health    +(im.health    ||0),0,10);
  gs.friendship=clamp(gs.friendship+(im.friendship||0),0,10);
  gs.family    =clamp(gs.family    +(im.family    ||0),0,10);
  gs.grades    =clamp(gs.grades    +(im.grades    ||0),0,100);
  gs.stress    =clamp(gs.stress    +(im.stress    ||0),0,10);
  const tt=ch.type==='positive'?'ok':ch.type==='negative'?'bad':'tip';
  showToast(ch.feedback||'',tt);
  gs.currentDay++;
  if(gs.currentDay>7){
    gs.currentDay=1;gs.currentWeek++;
    const allowanceThisWeek=gs.weeklyAllowance-gs.debt;
    gs.money+=allowanceThisWeek;
    gs.debt=0;
    const dur=gradeConfig[gs.playerGrade].duration;
    if(gs.currentWeek<=dur){
      if(allowanceThisWeek<gs.weeklyAllowance){
        setTimeout(()=>showToast('✅ Bagong Linggo! +₱'+allowanceThisWeek+' (−₱'+(gs.weeklyAllowance-allowanceThisWeek)+' debt)','ok'),500);
      }else{
        setTimeout(()=>showToast('✅ Bagong Linggo! +₱'+allowanceThisWeek+' allowance','ok'),500);
      }
    }
  }
  if(gs.money<0){gs.stress=clamp(gs.stress+1,0,10);gs.health=clamp(gs.health-1,0,10);}
  const duration=gradeConfig[gs.playerGrade].duration;
  if(gs.currentWeek>duration){
    // Save game state and navigate to result page
    sessionStorage.setItem('gameState', JSON.stringify(gs));
    setTimeout(()=>window.location.href='result.html',900);
    return;
  }
  updateUI();
  // Trigger money animation based on change
  const moneyEl=document.getElementById('moneyDisplay');
  if(gs.money<oldMoney){moneyEl.classList.add('loss');}
  else if(gs.money>oldMoney){moneyEl.classList.add('gain');}
  setTimeout(()=>moneyEl.classList.remove('loss','gain'),500);
  setTimeout(loadScenario,350);
}

// ─── UI ────────────────────────────────────────────────────
function updateUI(){
  document.getElementById('dayNum').textContent=gs.currentDay;
  const md=document.getElementById('moneyDisplay');
  md.textContent=gs.money;
  setStat('energy',gs.energy,10);setStat('health',gs.health,10);
  setStat('friendship',gs.friendship,10);setStat('family',gs.family,10);
  setStat('grades',gs.grades,100);setStat('stress',gs.stress,10);
  // Update day progress side dots
  const sideDots=document.querySelectorAll('.day-dot-side');
  const currentDayTotal=gs.currentWeek*7-7+gs.currentDay;
  sideDots.forEach((dot,i)=>{
    if(i<currentDayTotal)dot.classList.add('done');
    else dot.classList.remove('done');
  });
}

function setStat(n,v,max){
  const bar=document.getElementById('b-'+n);
  const fill=bar.parentElement;
  bar.style.width=(v/max*100)+'%';
  document.getElementById('v-'+n).textContent=v+'/'+max;
  // Trigger animation
  fill.style.animation='barFill 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  setTimeout(()=>fill.style.animation='',400);
}

// Initialize when page loads
initGameState();

// DEBT INFO UPDATE
function updateDebtInfo(){
  const debtEl=document.getElementById('debtInfo');
  if(gs.debt>0){
    debtEl.classList.add('show');
    debtEl.textContent='💳 Debt: ₱'+gs.debt+' (idi-deduct sa next allowance)';
  }else{
    debtEl.classList.remove('show');
  }
}
