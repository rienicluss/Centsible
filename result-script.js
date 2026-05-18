// ─── CALCULATE ENDING RANK ────────────────────────
function calculateEndingRank(gs){
  const moneyLeft = gs.money;
  
  let rank = {};
  
  if(moneyLeft >= 200){
    rank = {
      title: 'The Tycoon',
      emoji: '💰',
      money: moneyLeft,
      description: 'Future billionaire. You probably walked to school every day and ate nothing but air.'
    };
  } else if(moneyLeft >= 50){
    rank = {
      title: 'The Wise Spender',
      emoji: '🎯',
      money: moneyLeft,
      description: 'Balanced and responsible. You know when to treat yourself.'
    };
  } else if(moneyLeft >= 1){
    rank = {
      title: 'The Survivor',
      emoji: '💪',
      money: moneyLeft,
      description: 'You made it, but barely. You\'re probably very hungry right now.'
    };
  } else {
    rank = {
      title: 'The Petsa de Peligro Master',
      emoji: '🚨',
      money: moneyLeft,
      description: 'You\'ve been living on "borrowed" money. Time to rethink your life choices.'
    };
  }
  
  return rank;
}

// ─── RESULT PAGE LOGIC ───
function displayResults(){
  // Get game state from session storage
  const gsStr = sessionStorage.getItem('gameState');
  if(!gsStr){
    window.location.href='index.html';
    return;
  }
  
  const gs = JSON.parse(gsStr);
  
  // Calculate ending rank
  const rank = calculateEndingRank(gs);
  
  // Calculate spending personality
  const personality = calculateSpendingPersonality(gs);
  
  // Calculate final score (30-day Financial Grade)
  const moneyScore =Math.max(0,gs.money)/gs.weeklyAllowance*25;
  const savingsScore = (gs.savings||0)/gs.weeklyAllowance*15;
  const gradeScore =gs.grades*0.3;
  const statsScore =(gs.health+gs.friendship+gs.family+gs.energy)/40*20;
  const stressPen  =gs.stress*1.5;
  const finalNum   =clamp(Math.round(moneyScore+savingsScore+gradeScore+statsScore-stressPen),0,100);

  let title,sub,reflection,tips;
  if(finalNum>=85){
    title='🏆 KABOG NA KABOG!';sub='Ikaw ang tunay na Pinoy na matalino!';
    reflection='Napakahusay mo! Napamahalaan mo nang maayos ang iyong ₱100 allowance kada Linggo. Ang iyong financial management sa 30 araw ay nagpapakita ng disiplina at matalinong desisyon. Maganda ang iyong kinabukasan!';
    tips=['Patuloy ang ugaling mag-baon at mag-ipon','Huwag kalimutang gamitin ang parental advance kung tunay na kailangan lamang','Simulan ang 52-week saving challenge para mas malaki pa ang ipon'];
  }else if(finalNum>=65){
    title='👍 MAGALING!';sub='May magandang simula ka na!';
    reflection='Maayos ang ginawa mo sa loob ng 30 araw! Nakamit mo ang balance sa pera at lifestyle. May mga desisyon pang pwedeng pagandahin, lalo na sa pag-isip nang matagal bago gumamit ng parental advance. Keep it up!';
    tips=['I-monitor ang iyong weekly gastos gamit ang receipt system','Subukan na magbigay ng sariling budget para sa bawat kategorya (food, transport, socials)','Pag-aralan kung paano mapapabuti ang parental advance usage'];
  }else if(finalNum>=40){
    title='⚠️ Kailangan ng Improvement';sub='Natuto ka ng mabuting aral sa 30 araw.';
    reflection='Mahirap ang pamamahala ng pera kahit sa loob lamang ng 30 araw. Nakita mo kung paano mabilis maubos ang ₱100 weekly baon. Ang iyong dependensya sa parental advance ay nagsimula nang mataas. Pero okay lang — ito ang layunin ng laro: matuto!';
    tips=['Gawa ng listahan: KAILANGAN (food, transport) vs GUSTO (socials, snacks)','Pag-usapan ang budget sa magulang o guardian mo bago ang susunod na 30 araw','Subukan muli ang laro at gamitin ang mga natutunan mo!'];
  }else{
    title='😬 Mahirap ang Nangyari!';sub='Pag-aralan natin ang nangyari sa 30 araw…';
    reflection='Ang ₱100 weekly baon ay hindi sapat dahil sa masyadong gastos at mataas na parental advance. Sa totoong buhay, mas malala pa ang consequences. Pero ngayon mo pa lang natutunan ito — mas maaga, mas mabuti!';
    tips=['Magsimula sa basic: track lahat ng gastos para sa 7 araw','Magtanong kung ano ang priority expenses (food vs snacks)','Subukan na hindi gumamit ng parental advance sa susunod na 30 araw'];
  }

  document.getElementById('resultTitle').textContent=title;
  document.getElementById('resultSub').textContent=sub;
  document.getElementById('finalGradeDisplay').textContent=finalNum+'%';
  document.getElementById('reflectionText').textContent=reflection;
  
  // Display ending rank (primary)
  const rankBox = document.getElementById('rankBox');
  rankBox.innerHTML = `
    <div class="rank-card">
      <div class="rank-emoji">${rank.emoji}</div>
      <div class="rank-title">${rank.title}</div>
      <div class="rank-money">₱${rank.money} Left</div>
      <div class="rank-description">${rank.description}</div>
    </div>
  `;
  
  // Display spending personality
  const personalityBox = document.getElementById('personalityBox');
  personalityBox.innerHTML = `
    <div class="personality-content">
      <div class="personality-icon">${personality.icon}</div>
      <div class="personality-info">
        <h3>${personality.title}</h3>
        <p>${personality.subtitle}</p>
      </div>
    </div>
  `;
  
  // Display spending breakdown
  const breakdownBox = document.getElementById('spendingBreakdown');
  if(personality.spending){
    const sb = personality.spending;
    breakdownBox.innerHTML = `
      <div class="breakdown-title">📊 Spending Breakdown (30 days)</div>
      <div class="breakdown-items">
        <div class="breakdown-item">
          <div class="breakdown-label">🚌 Transport</div>
          <div class="breakdown-bar"><div class="breakdown-fill" style="width:${sb.transport}%"></div></div>
          <div class="breakdown-pct">${sb.transport}%</div>
        </div>
        <div class="breakdown-item">
          <div class="breakdown-label">🍽️ Food</div>
          <div class="breakdown-bar"><div class="breakdown-fill" style="width:${sb.food}%"></div></div>
          <div class="breakdown-pct">${sb.food}%</div>
        </div>
        <div class="breakdown-item">
          <div class="breakdown-label">👯 Socials</div>
          <div class="breakdown-bar"><div class="breakdown-fill" style="width:${sb.social}%"></div></div>
          <div class="breakdown-pct">${sb.social}%</div>
        </div>
        <div class="breakdown-item">
          <div class="breakdown-label">📚 Extracurricular</div>
          <div class="breakdown-bar"><div class="breakdown-fill" style="width:${sb.extracurricular}%"></div></div>
          <div class="breakdown-pct">${sb.extracurricular}%</div>
        </div>
        <div class="breakdown-item">
          <div class="breakdown-label">🏦 Savings</div>
          <div class="breakdown-bar"><div class="breakdown-fill savings-fill" style="width:${sb.savings}%"></div></div>
          <div class="breakdown-pct">${sb.savings}%</div>
        </div>
      </div>
    `;
  }

  const grid=document.getElementById('resultGrid');
  [{label:'💰 Pera natitira',val:'₱'+gs.money},{label:'🏦 Naipon mo',val:'₱'+(gs.savings||0)},
   {label:'📚 Grades',val:gs.grades+'%'},{label:'❤️ Kalusugan',val:gs.health+'/10'},
   {label:'💕 Kaibigan',val:gs.friendship+'/10'},{label:'👨‍👩‍👧 Pamilya',val:gs.family+'/10'},
  ].forEach(s=>{
    const c=document.createElement('div');c.className='r-card';
    c.innerHTML='<div class="r-label">'+s.label+'</div><div class="r-val">'+s.val+'</div>';
    grid.appendChild(c);
  });

  document.getElementById('tipsList').innerHTML=tips.map(t=>'<li>'+t+'</li>').join('');
  
  // Save score to leaderboard
  saveScoreToLeaderboard(gs.playerName, gs.playerAge, gs.playerGrade, finalNum, finalNum>=85?'🏆 KABOG NA KABOG!':finalNum>=65?'👍 MAGALING!':finalNum>=40?'⚠️ Improvement':'😬 Critical');
}

function saveScoreToLeaderboard(name, age, grade, score, tier){
  let scores = JSON.parse(localStorage.getItem('allowanceScores') || '[]');
  scores.push({
    name: name,
    age: age,
    grade: grade,
    score: score,
    tier: tier,
    date: new Date().toLocaleDateString('fil-PH')
  });
  localStorage.setItem('allowanceScores', JSON.stringify(scores));
}

// ─── CALCULATE SPENDING PERSONALITY ────────────────────────
function calculateSpendingPersonality(gs){
  const spent = gs.spentByCategory || {};
  const transport = spent.transport || 0;
  const food = spent.food || 0;
  const social = spent.social || 0;
  const extracurricular = spent.extracurricular || 0;
  const totalSpent = transport + food + social + extracurricular;
  
  // Total allowance over 30 days
  const totalBudget = gs.weeklyAllowance * 4; // ₱100 × 4 weeks = ₱400
  
  // Calculate percentages based on TOTAL BUDGET (not just spent)
  const transportPct = totalBudget > 0 ? (transport / totalBudget) * 100 : 0;
  const foodPct = totalBudget > 0 ? (food / totalBudget) * 100 : 0;
  const socialPct = totalBudget > 0 ? (social / totalBudget) * 100 : 0;
  const extraPct = totalBudget > 0 ? (extracurricular / totalBudget) * 100 : 0;
  
  // Calculate savings rate
  const savingsRate = totalBudget > 0 ? (gs.savings / totalBudget) * 100 : 0;
  
  // Calculate advance usage rate
  const advanceUsageCount = gs.parentalAdvanceCount || 0;
  
  let personality = {
    title: '💼 Balanced Budgeter',
    subtitle: 'You know how to spend wisely!',
    icon: '⚖️'
  };
  
  // Determine personality based on spending patterns
  if(savingsRate > 30){
    personality = {title: '🏦 Penny Pincher', subtitle: 'Master of saving!', icon: '💰'};
  } else if(socialPct > 40 && advanceUsageCount <= 1){
    personality = {title: '🎉 Socials Butterfly', subtitle: 'Life is for enjoying with friends!', icon: '✨'};
  } else if(foodPct > 40){
    personality = {title: '🍔 Foodie Lover', subtitle: 'Money follows your stomach!', icon: '🍽️'};
  } else if(advanceUsageCount > 3){
    personality = {title: '🛍️ Big Spender', subtitle: 'Living life to the fullest!', icon: '💸'};
  } else if(totalSpent < totalBudget * 0.3){
    personality = {title: '⛑️ Practical Planner', subtitle: 'You only spend what you need!', icon: '🎯'};
  }
  
  personality.spending = {
    transport: Math.round(transportPct),
    food: Math.round(foodPct),
    social: Math.round(socialPct),
    extracurricular: Math.round(extraPct),
    savings: Math.round(savingsRate)
  };
  
  return personality;
}

// Display results when page loads
displayResults();
