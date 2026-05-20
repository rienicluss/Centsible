// ─── GAME PAGE LOGIC ───
const gs = {
  playerName:'',playerAge:0,playerGrade:'',
  currentDay:1,
  money:0,weeklyAllowance:100,
  energy:10,health:10,friendship:10,family:10,grades:85,stress:3,
  totalSpent:0,
  debt:0,
  savings:0,
  dailyChoices:[],
  // Category tracking for spending personality
  spentByCategory:{transport:0,food:0,social:0,extracurricular:0},
  parentalAdvanceCount:0,
  // Big Events system
  weeklyBigEvents:{},
  usedBigEvents:[],
  dayChoiceCount:0, // Track choices within a day (0=commute, 1=lunch, 2=event)
  mondayAllowanceGiven:{}, // Track which Monday days already received allowance (to prevent double-adding on refresh)
};

// Initialize game state from session storage
function initGameState(){
  // Check if there's an existing game state to restore (game in progress)
  const savedGameState = sessionStorage.getItem('gameState');
  if(savedGameState){
    try {
      const restored = JSON.parse(savedGameState);
      // Merge restored state into gs object
      Object.assign(gs, restored);
      document.getElementById('displayName').textContent=gs.playerName;
      document.getElementById('dayTotal').textContent=30;
      setupEventListeners();
      updateUI();
      
      // Play game music when resuming
      soundManager.playGameMusic();
      
      // Check if this is a Monday - show Monday Reset modal
      if([1,8,15,22,29].includes(gs.currentDay)){
        setTimeout(showMondayReset, 300);
      } else {
        loadScenario();
      }
      return;
    } catch(e){
      console.log('Could not restore saved game, starting fresh');
    }
  }
  
  // NEW GAME: Initialize from session storage
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
  gs.mondayAllowanceGiven[1] = true; // Mark Day 1 allowance as given (initialized with full amount)
  // Game duration: 30 days. Allowance given on Mondays (Days 1, 8, 15, 22, 29)
  const gameDuration = 30;
  
  // Assign grade based on allowance for scenario selection
  if(customAllowance <= 50) gs.playerGrade = 'elem-lower';
  else if(customAllowance <= 75) gs.playerGrade = 'elem-upper';
  else if(customAllowance <= 100) gs.playerGrade = 'jhs-lower';
  else if(customAllowance <= 150) gs.playerGrade = 'jhs-upper';
  else if(customAllowance <= 200) gs.playerGrade = 'shs';
  else gs.playerGrade = 'college-1';
  
  document.getElementById('displayName').textContent=gs.playerName;
  document.getElementById('dayTotal').textContent=gameDuration;
  
  setupEventListeners();
  
  // Generate big events for all weeks
  generateWeeklyBigEvents();
  
  updateUI();
  
  // Play game music
  soundManager.playGameMusic();
  
  // Check if this is a Monday - show Monday Reset modal
  if([1,8,15,22,29].includes(gs.currentDay)){
    setTimeout(showMondayReset, 300);
  } else {
    loadScenario();
  }
}

// ─── SETUP EVENT LISTENERS ───────────────────────────────────────
function setupEventListeners(){
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
      soundManager.playSFX('borrow');
      gs.money+=amt;
      gs.debt+=amt;
      gs.parentalAdvanceCount++;
      showToast('💵 Nanay gave you ₱'+amt+'! Remember: next Monday -₱'+amt+' (parental advance)','tip');
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
        soundManager.playSFX('error');
        showToast('Kulang ang iyong pera! Available lang: ₱'+gs.money,'bad');
        return;
      }
      soundManager.playSFX('save');
      gs.money-=amt;
      gs.savings+=amt;
      showToast('💰 Nag-ipon ka ng ₱'+amt+'! Total savings: ₱'+gs.savings,'ok');
      document.getElementById('iponModal').classList.remove('show');
      document.getElementById('savingsAmount').value='';
      updateUI();
    }else{
      soundManager.playSFX('error');
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
        soundManager.playSFX('error');
        showToast('Kulang ang ipon mo! Available lang: ₱'+gs.savings,'bad');
        return;
      }
      soundManager.playSFX('coin');
      gs.savings-=amt;
      gs.money+=amt;
      showToast('💸 Kunin mo ang ₱'+amt+'! Remaining savings: ₱'+gs.savings,'ok');
      document.getElementById('iponModal').classList.remove('show');
      document.getElementById('withdrawAmount').value='';
      updateUI();
    }else{
      soundManager.playSFX('error');
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
  
  // Setup Big Event modal handlers
  setupBigEventModalHandlers();
}

// ─── BIG EVENT MODAL ───────────────────────────────────────
function showBigEventModal(event){
  const costAmount = Math.round(gs.weeklyAllowance * (event.costScale || 0));
  
  document.getElementById('bigEventTitle').textContent = event.title;
  document.getElementById('bigEventDesc').textContent = event.desc;
  document.getElementById('bigEventCost').textContent = '₱' + costAmount;
  
  document.getElementById('bigEventPayBtn').onclick = () => {
    if(gs.money >= costAmount){
      gs.money -= costAmount;
      gs.totalSpent += costAmount;
      gs.spentByCategory['extracurricular'] = (gs.spentByCategory['extracurricular'] || 0) + costAmount;
      if(event.gradeImpact) gs.grades = clamp(gs.grades + event.gradeImpact, 0, 100);
      if(event.socialImpact) gs.friendship = clamp(gs.friendship + event.socialImpact, 0, 10);
      if(event.healthImpact) gs.health = clamp(gs.health + event.healthImpact, 0, 10);
      if(event.stressImpact) gs.stress = clamp(gs.stress + event.stressImpact, 0, 10);
      showToast('✅ Bayad mo na! ' + event.title, 'ok');
      closeBigEventModal();
      setTimeout(() => {
        gs.currentDay++;
        updateUI();
        sessionStorage.setItem('gameState', JSON.stringify(gs));
        if([8,15,22,29].includes(gs.currentDay)){
          showMondayReset();
        } else if(gs.currentDay > 30){
          window.location.href='result.html';
        } else {
          loadScenario();
        }
      }, 500);
    } else {
      showToast('Kulang ang pera mo! Need ₱' + costAmount, 'bad');
    }
  };
  
  document.getElementById('bigEventAdvanceBtn').onclick = () => {
    gs.money += costAmount;
    gs.debt += costAmount;
    gs.parentalAdvanceCount++;
    if(event.gradeImpact) gs.grades = clamp(gs.grades + event.gradeImpact, 0, 100);
    if(event.socialImpact) gs.friendship = clamp(gs.friendship + event.socialImpact, 0, 10);
    if(event.healthImpact) gs.health = clamp(gs.health + event.healthImpact, 0, 10);
    if(event.stressImpact) gs.stress = clamp(gs.stress + event.stressImpact, 0, 10);
    showToast('💵 Parental Advance: ₱' + costAmount + ' (deduct sa next Monday)', 'tip');
    closeBigEventModal();
    setTimeout(() => {
      gs.currentDay++;
      updateUI();
      sessionStorage.setItem('gameState', JSON.stringify(gs));
      if([8,15,22,29].includes(gs.currentDay)){
        showMondayReset();
      } else if(gs.currentDay > 30){
        window.location.href='result.html';
      } else {
        loadScenario();
      }
    }, 500);
  };
  
  document.getElementById('bigEventSkipBtn').onclick = () => {
    gs.grades = clamp(gs.grades - 5, 0, 100);
    gs.stress = clamp(gs.stress + 1, 0, 10);
    showToast('⚠️ Skipped. Grades -5', 'bad');
    closeBigEventModal();
    setTimeout(() => {
      gs.currentDay++;
      updateUI();
      sessionStorage.setItem('gameState', JSON.stringify(gs));
      if([8,15,22,29].includes(gs.currentDay)){
        showMondayReset();
      } else if(gs.currentDay > 30){
        window.location.href='result.html';
      } else {
        loadScenario();
      }
    }, 500);
  };
  
  document.getElementById('bigEventModal').classList.add('show');
}

function closeBigEventModal(){
  document.getElementById('bigEventModal').classList.remove('show');
}

function setupBigEventModalHandlers(){
  const modal = document.getElementById('bigEventModal');
  if(modal){
    modal.addEventListener('click', (e) => {
      if(e.target.id === 'bigEventModal'){
        closeBigEventModal();
      }
    });
  }
}
function showMondayReset(){
  const week = Math.ceil(gs.currentDay / 7);
  
  // MONDAY ALLOWANCE DELIVERY: ₱100 minus debt, then add to current money
  // BUT: Skip allowance on Day 1 (already initialized with ₱100)
  // AND: Only add if not already processed (prevents double-adding on refresh)
  if(gs.currentDay > 1 && !gs.mondayAllowanceGiven[gs.currentDay]){
    let allowanceAfterDebt = gs.weeklyAllowance; // ₱100
    
    if(gs.debt > 0){
      allowanceAfterDebt = gs.weeklyAllowance - gs.debt; // ₱100 - debt
      gs.debt = 0; // Clear the debt after payment
    }
    
    gs.money += allowanceAfterDebt; // Add net allowance to current money
    gs.mondayAllowanceGiven[gs.currentDay] = true; // Mark this Monday as processed
  }
  
  document.getElementById('mondayWeekNum').textContent = week;
  document.getElementById('mondayBalance').textContent = '₱' + gs.money;
  
  // Show big events for this week
  const eventsList = document.getElementById('mondayEventsList');
  eventsList.innerHTML = '';
  if(gs.weeklyBigEvents[week] && gs.weeklyBigEvents[week].length > 0){
    gs.weeklyBigEvents[week].forEach(event => {
      const item = document.createElement('div');
      item.className = 'monday-event-item';
      item.innerHTML = `<div class="event-icon">📋</div><div class="event-text"><strong>${event.title}</strong></div>`;
      eventsList.appendChild(item);
    });
  } else {
    eventsList.innerHTML = '<p style="color:#888;">No big events this week</p>';
  }
  
  document.getElementById('mondayResetModal').classList.add('show');
  
  document.getElementById('mondayReadyBtn').onclick = () => {
    document.getElementById('mondayResetModal').classList.remove('show');
    updateUI();
    sessionStorage.setItem('gameState', JSON.stringify(gs));
    loadScenario();
  };
}

// ─── GENERATE WEEKLY BIG EVENTS ────────────────────────────
function generateWeeklyBigEvents(){
  for(let week = 1; week <= 4; week++){
    gs.weeklyBigEvents[week] = [];
    // Randomly select 0-2 big events per week
    const eventCount = Math.floor(Math.random() * 3);
    const shuffled = bigEvents.sort(() => 0.5 - Math.random());
    for(let i = 0; i < eventCount && i < shuffled.length; i++){
      if(!gs.usedBigEvents.includes(shuffled[i].id)){
        gs.weeklyBigEvents[week].push(shuffled[i]);
        gs.usedBigEvents.push(shuffled[i].id);
      }
    }
  }
}

// ─── GET SCENARIO BY CATEGORY ──────────────────────────────
function getScenarioByCategory(category){
  const pool = scenariosDB[gs.playerGrade] || scenariosDB['jhs-lower'];
  const categoryScenarios = pool.filter(s => s.category === category);
  if(categoryScenarios.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return categoryScenarios[Math.floor(Math.random() * categoryScenarios.length)];
}

// ─── GET RANDOM SOCIAL EVENT ──────────────────────────────
function getRandomSocialEvent(){
  const pool = scenariosDB[gs.playerGrade] || scenariosDB['jhs-lower'];
  const socialScenarios = pool.filter(s => ['social','socials','food','transport'].includes(s.category));
  if(socialScenarios.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return socialScenarios[Math.floor(Math.random() * socialScenarios.length)];
}

// ─── SCENARIO LOADING WITH DAILY STRUCTURE ─────────────────
let usedIdx=[];
function loadScenario(){
  // Load the daily scenario for the current day
  const dayIndex = gs.currentDay - 1; // Days 1-30 map to indices 0-29
  
  if(dayIndex >= dailyScenarios.length){
    // Game over - reached Day 31
    endGame();
    return;
  }
  
  const scenario = dailyScenarios[dayIndex];
  displayScenario(scenario);
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
    btn.className='choice-btn-spent '+ch.type;
    
    // Format button text with cost if available
    let btnText = ch.text;
    if(ch.costAll){
      btnText += ' (spend all)';
    } else if(ch.cost !== undefined && ch.cost > 0){
      btnText += ' (−₱' + ch.cost + ')';
    } else if(ch.cost === 0 || ch.cost === undefined){
      // No cost or free option
      if(ch.text.indexOf('−₱') === -1 && ch.text.indexOf('save') === -1){
        // Only add if not already mentioned in text
      }
    }
    
    btn.textContent = btnText;
    btn.style.animationDelay=(0.4+delay*0.1)+'s';
    btn.onclick=()=>makeChoice(ch);
    panel.appendChild(btn);
    delay++;
  });
}

// Generate feedback text based on choice impacts
function generateFeedback(ch, costAmount){
  if(ch.feedback) return ch.feedback; // Use explicit feedback if provided
  
  const im = ch.impact || {};
  const messages = [];
  
  if(costAmount > 0) messages.push('−₱' + costAmount);
  if(im.energy < 0) messages.push('napagod');
  if(im.energy > 0) messages.push('nag-energize');
  if(im.health < 0) messages.push('nabawasan ang lakas');
  if(im.health > 0) messages.push('naging healthy');
  if(im.stress < 0) messages.push('nag-relax');
  if(im.stress > 0) messages.push('nag-stress');
  if(im.friendship < 0) messages.push('naging awkward ang friendships');
  if(im.friendship > 0) messages.push('mas lapit sa friends');
  if(im.family < 0) messages.push('nag-alala ang pamilya');
  if(im.family > 0) messages.push('masaya ang pamilya');
  if(im.grades < 0) messages.push('bumaba ang grades');
  if(im.grades > 0) messages.push('tumaas ang grades');
  if(im.savings > 0) messages.push('nag-ipon');
  
  return messages.length > 0 ? messages.join(' • ') : '';
}

// ─── CHOICE ────────────────────────────────────────────────
function makeChoice(ch){
  soundManager.playSFX('click');
  
  document.querySelectorAll('.choice-btn-spent').forEach(b=>b.disabled=true);
  const oldMoney=gs.money;
  
  // Handle cost calculation - support both old costScale and new direct cost
  let costAmount = 0;
  if(ch.costAll){
    // Special case: spend all remaining money
    costAmount = gs.money;
  } else if(ch.cost !== undefined){
    // Direct cost amount from daily scenarios
    costAmount = ch.cost;
  } else if(ch.costScale !== undefined){
    // Old system: costScale as percentage of allowance
    costAmount = Math.round(gs.weeklyAllowance * ch.costScale);
  }
  
  // Play sound effect based on spending
  if(costAmount > 0){
    soundManager.playSFX('coin');
  } else if(ch.type === 'positive'){
    soundManager.playSFX('success');
  }
  
  gs.money -= costAmount;
  if(costAmount > 0){
    gs.totalSpent += costAmount;
  }
  // Track ALL choices (even free ones) for daily record in weekly receipt
  gs.dailyChoices.push({title:ch.text, cost:costAmount, day:gs.currentDay});
  
  const im = ch.impact || {};
  gs.energy    = clamp(gs.energy    + (im.energy    || 0), 0, 10);
  gs.health    = clamp(gs.health    + (im.health    || 0), 0, 10);
  gs.friendship = clamp(gs.friendship + (im.friendship || 0), 0, 10);
  gs.family    = clamp(gs.family    + (im.family    || 0), 0, 10);
  gs.grades    = clamp(gs.grades    + (im.grades    || 0), 0, 100);
  gs.stress    = clamp(gs.stress    + (im.stress    || 0), 0, 10);
  if(im.savings) gs.savings = (gs.savings || 0) + (im.savings || 0);
  if(ch.debt) gs.debt = (gs.debt || 0) + ch.debt;
  
  // Generate and show feedback based on impacts
  const feedback = generateFeedback(ch, costAmount);
  const tt = (im.stress && im.stress > 0) ? 'bad' : (im.stress && im.stress < 0) ? 'ok' : 'tip';
  showToast(feedback, tt);
  
  // Move to next day after each choice (1 question per day)
  gs.currentDay++;
  
  if(gs.money<0){
    gs.stress=clamp(gs.stress+1,0,10);
    gs.health=clamp(gs.health-1,0,10);
  }
  
  updateUI();
  // Save current game state after each choice
  sessionStorage.setItem('gameState', JSON.stringify(gs));
  
  // Check if game is complete (Day 31 reached - game goes from 1-30)
  if(gs.currentDay>30){
    // Save game state and navigate to result page
    sessionStorage.setItem('gameState', JSON.stringify(gs));
    setTimeout(()=>window.location.href='result.html',900);
    return;
  }
  
  // Check if today is a Monday (Days 8, 15, 22, 29) - allowance delivery day
  const isMondayAllowanceDay=[8,15,22,29].includes(gs.currentDay);
  
  if(isMondayAllowanceDay){
    // Show Monday Reset with allowance delivery
    setTimeout(showMondayReset, 600);
    return;
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
  document.getElementById('dayNum').textContent=gs.currentDay;
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
  // Calculate total spent this week by filtering dailyChoices for this week
  const weekStartDay=(week-1)*7+1;
  const weekEndDay=week*7;
  const thisWeeksChoices=gs.dailyChoices.filter(c=>c.day>=weekStartDay && c.day<=weekEndDay);
  
  let totalSpentThisWeek=0;
  thisWeeksChoices.forEach(choice=>{
    totalSpentThisWeek+=choice.cost;
  });
  
  // Update receipt header
  document.getElementById('receiptTitle').textContent=`Linggo ${week} - Gastos`;
  document.getElementById('spentAmount').textContent='₱'+totalSpentThisWeek;
  
  // Populate receipt items
  const itemsContainer=document.getElementById('receiptItems');
  itemsContainer.innerHTML='';
  if(thisWeeksChoices.length>0){
    thisWeeksChoices.forEach(choice=>{
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
    gs.currentDay++;
    
    // Check if the new day is a Monday - show Monday Reset if so
    if([8,15,22,29].includes(gs.currentDay)){
      setTimeout(showMondayReset, 300);
    } else {
      loadScenario();
    }
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
