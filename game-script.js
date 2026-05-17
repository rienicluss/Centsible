// ─── GAME PAGE LOGIC ───
const gs = {
  playerName:'',playerAge:0,playerGrade:'',
  currentWeek:1,currentDay:1,
  money:0,weeklyAllowance:0,
  energy:10,health:10,friendship:10,family:10,grades:85,stress:3,
  totalSpent:0,
  debt:0,
  savings:0,
  weeklyChoices:[],
};

// Initialize game state from session storage
function initGameState(){
  gs.playerName = sessionStorage.getItem('playerName') || '';
  gs.playerAge = parseInt(sessionStorage.getItem('playerAge')) || 0;
  
  // NEW: Use custom allowance instead of grade-based
  const customAllowance = parseInt(sessionStorage.getItem('playerAllowance')) || 100;
  
  if(!gs.playerName){
    window.location.href='index.html';
    return;
  }
  
  gs.weeklyAllowance = customAllowance;
  gs.money = customAllowance;
  // Set game duration to 4 weeks by default for custom allowance
  const gameDuration = 4;
  
  // Assign grade based on allowance for scenario selection
  if(customAllowance <= 50) gs.playerGrade = 'elem-lower';
  else if(customAllowance <= 75) gs.playerGrade = 'elem-upper';
  else if(customAllowance <= 100) gs.playerGrade = 'jhs-lower';
  else if(customAllowance <= 150) gs.playerGrade = 'jhs-upper';
  else if(customAllowance <= 200) gs.playerGrade = 'shs';
  else gs.playerGrade = 'college-1';
  
  document.getElementById('displayName').textContent=gs.playerName;
  document.getElementById('dayTotal').textContent=gameDuration;
  
  // No more day progress dots - using minimal SPENT design
  
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

  // Setup quit button in stats
  document.getElementById('quitBtnStats').addEventListener('click',()=>{
    document.getElementById('quitModal').classList.add('show');
  });

  // Setup quick nanay button (sidebar)
  if(document.getElementById('nanayQuickBtn')){
    document.getElementById('nanayQuickBtn').addEventListener('click',()=>{
      document.getElementById('nanayModal').classList.add('show');
    });
  }

  // Setup quick ipon button (sidebar) - opens ipon modal with deposit/withdraw options
  if(document.getElementById('iponQuickBtn')){
    document.getElementById('iponQuickBtn').addEventListener('click',()=>{
      document.getElementById('iponModal').classList.add('show');
      // Show deposit mode by default
      showIponMode('deposit');
      document.getElementById('availableMoney').textContent='₱'+(gs.money || 0);
      document.getElementById('currentSavings').textContent='₱'+(gs.savings || 0);
      document.getElementById('savingsAmount').value='';
      
      document.getElementById('currentSavingsWithdraw').textContent='₱'+(gs.savings || 0);
      document.getElementById('availableMoneyWithdraw').textContent='₱'+(gs.money || 0);
      document.getElementById('withdrawAmount').value='';
    });
  }
  
  // Ipon mode selector buttons
  if(document.getElementById('iponDepositModeBtn')){
    document.getElementById('iponDepositModeBtn').addEventListener('click',()=>{
      showIponMode('deposit');
    });
  }
  
  if(document.getElementById('iponWithdrawModeBtn')){
    document.getElementById('iponWithdrawModeBtn').addEventListener('click',()=>{
      showIponMode('withdraw');
    });
  }

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

  // Setup Ipon modal (Savings Deposit)
  document.getElementById('iponModalClose').addEventListener('click',()=>{
    document.getElementById('iponModal').classList.remove('show');
  });

  document.getElementById('savingsCancel').addEventListener('click',()=>{
    document.getElementById('iponModal').classList.remove('show');
    document.getElementById('savingsAmount').value='';
  });

  document.getElementById('savingsConfirm').addEventListener('click',()=>{
    const amt=parseInt(document.getElementById('savingsAmount').value)||0;
    if(amt>0){
      if(amt > gs.money){
        showToast('Kulang ang iyong pera! Available lang: ₱'+gs.money,'bad');
        return;
      }
      gs.money-=amt;
      gs.savings+=amt;
      showToast('💰 Nag-ipon ka ng ₱'+amt+'! Total savings: ₱'+gs.savings,'ok');
      document.getElementById('iponModal').classList.remove('show');
      document.getElementById('savingsAmount').value='';
      updateUI();
    }else{
      showToast('Maglagay ng amount!','bad');
    }
  });
  
  // Withdraw handlers
  document.getElementById('withdrawCancel').addEventListener('click',()=>{
    document.getElementById('iponModal').classList.remove('show');
    document.getElementById('withdrawAmount').value='';
  });

  document.getElementById('withdrawConfirm').addEventListener('click',()=>{
    const amt=parseInt(document.getElementById('withdrawAmount').value)||0;
    if(amt>0){
      if(amt > gs.savings){
        showToast('Kulang ang ipon mo! Available lang: ₱'+gs.savings,'bad');
        return;
      }
      gs.savings-=amt;
      gs.money+=amt;
      showToast('💸 Kunin mo ang ₱'+amt+'! Remaining savings: ₱'+gs.savings,'ok');
      document.getElementById('iponModal').classList.remove('show');
      document.getElementById('withdrawAmount').value='';
      updateUI();
    }else{
      showToast('Maglagay ng amount!','bad');
    }
  });

  document.getElementById('iponModal').addEventListener('click',(e)=>{
    if(e.target.id==='iponModal'){
      document.getElementById('iponModal').classList.remove('show');
    }
  });

  // Setup quit button in stats and modal
  document.getElementById('quitBtnStats').addEventListener('click',()=>{
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
  if(ch.cost>0){
    gs.totalSpent+=ch.cost;
    // Track choice for weekly receipt
    gs.weeklyChoices.push({title:ch.text, cost:ch.cost});
  }
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
  
  const showReceipt=gs.currentDay>7;
  
  if(gs.currentDay>7){
    gs.currentDay=1;gs.currentWeek++;
    const allowanceThisWeek=gs.weeklyAllowance-gs.debt;
    gs.money+=allowanceThisWeek;
    gs.debt=0;
    const dur=4; // Always 4 weeks for custom allowance
    if(gs.currentWeek<=dur){
      if(allowanceThisWeek<gs.weeklyAllowance){
        setTimeout(()=>showToast('✅ Bagong Linggo! +₱'+allowanceThisWeek+' (−₱'+(gs.weeklyAllowance-allowanceThisWeek)+' debt)','ok'),500);
      }else{
        setTimeout(()=>showToast('✅ Bagong Linggo! +₱'+allowanceThisWeek+' allowance','ok'),500);
      }
    }
  }
  if(gs.money<0){gs.stress=clamp(gs.stress+1,0,10);gs.health=clamp(gs.health-1,0,10);}
  const duration=4; // Always 4 weeks for custom allowance
  if(gs.currentWeek>duration){
    // Save game state and navigate to result page
    sessionStorage.setItem('gameState', JSON.stringify(gs));
    setTimeout(()=>window.location.href='result.html',900);
    return;
  }
  updateUI();
  
  // Show weekly receipt if transitioning to next week
  if(showReceipt){
    setTimeout(()=>showWeeklyReceipt(gs.currentWeek-1), 800);
    return; // Don't load next scenario yet
  }
  
  // Trigger money animation based on change
  const moneyEl=document.getElementById('moneyDisplay');
  if(gs.money<oldMoney){moneyEl.classList.add('loss');}
  else if(gs.money>oldMoney){moneyEl.classList.add('gain');}
  setTimeout(()=>moneyEl.classList.remove('loss','gain'),500);
  setTimeout(loadScenario,350);
}

// ─── UI ────────────────────────────────────────────────────
function updateUI(){
  document.getElementById('dayNum').textContent=gs.currentWeek;
  const md=document.getElementById('moneyDisplay');
  md.textContent=gs.money;
  
  // Update sidebar info
  document.getElementById('savingsDisplay').textContent='₱'+(gs.savings || 0);
  document.getElementById('debtDisplay').textContent='₱'+(gs.debt || 0);
  
  // Update stats bars
  setStat('energy',gs.energy,10);setStat('health',gs.health,10);
  setStat('friendship',gs.friendship,10);setStat('family',gs.family,10);
  setStat('grades',gs.grades,100);setStat('stress',gs.stress,10);
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

// WEEKLY RECEIPT DISPLAY
function showWeeklyReceipt(week){
  // Calculate total spent this week
  let totalSpentThisWeek=0;
  gs.weeklyChoices.forEach(choice=>{
    totalSpentThisWeek+=choice.cost;
  });
  
  // Update receipt header
  document.getElementById('receiptTitle').textContent=`Linggo ${week} - Gastos`;
  document.getElementById('spentAmount').textContent='₱'+totalSpentThisWeek;
  
  // Populate receipt items
  const itemsContainer=document.getElementById('receiptItems');
  itemsContainer.innerHTML='';
  if(gs.weeklyChoices.length>0){
    gs.weeklyChoices.forEach(choice=>{
      const item=document.createElement('div');
      item.className='receipt-item';
      item.innerHTML=`
        <div class="receipt-item-name">${choice.title}</div>
        <div class="receipt-item-cost">−₱${choice.cost}</div>
      `;
      itemsContainer.appendChild(item);
    });
  }else{
    itemsContainer.innerHTML='<p style="text-align:center;color:#666;padding:20px;">Walang gastos ngayong linggo!</p>';
  }
  
  // Show modal
  document.getElementById('weeklyReceiptModal').classList.add('show');
  
  // Setup quick save ₱50 button
  document.getElementById('quickSave50Btn').onclick=()=>{
    if(gs.money >= 50){
      gs.money -= 50;
      gs.savings += 50;
      showToast('💰 Na-save mo ang ₱50! Total savings: ₱'+gs.savings, 'ok');
      updateUI();
      // Re-render the receipt to show updated money
      document.getElementById('quickSave50Btn').disabled = true;
      document.getElementById('quickSave50Btn').textContent = '✓ Naka-save na ang ₱50';
    }else{
      showToast('❌ Kulang ang pera mo para mag-ipon ng ₱50', 'bad');
    }
  };
  
  // Setup continue button
  document.getElementById('continueReceipt').onclick=()=>{
    document.getElementById('weeklyReceiptModal').classList.remove('show');
    gs.weeklyChoices=[]; // Reset for next week
    loadScenario();
  };
}

// SHOW IPON MODE (Deposit or Withdraw)
function showIponMode(mode){
  const depositMode=document.getElementById('iponDepositMode');
  const withdrawMode=document.getElementById('iponWithdrawMode');
  const depositBtn=document.getElementById('iponDepositModeBtn');
  const withdrawBtn=document.getElementById('iponWithdrawModeBtn');
  
  if(mode==='deposit'){
    depositMode.style.display='block';
    withdrawMode.style.display='none';
    depositBtn.classList.add('active');
    withdrawBtn.classList.remove('active');
  }else{
    depositMode.style.display='none';
    withdrawMode.style.display='block';
    depositBtn.classList.remove('active');
    withdrawBtn.classList.add('active');
  }
}
