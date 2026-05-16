// ─── RESULT PAGE LOGIC ───
function displayResults(){
  // Get game state from session storage
  const gsStr = sessionStorage.getItem('gameState');
  if(!gsStr){
    window.location.href='index.html';
    return;
  }
  
  const gs = JSON.parse(gsStr);
  const playerGrade = gs.playerGrade;
  
  // Calculate final score
  const moneyScore =Math.max(0,gs.money)/gs.weeklyAllowance*20;
  const gradeScore =gs.grades*0.3;
  const statsScore =(gs.health+gs.friendship+gs.family+gs.energy)/40*30;
  const stressPen  =gs.stress*2;
  const finalNum   =clamp(Math.round(moneyScore+gradeScore+statsScore-stressPen),0,100);

  let title,sub,reflection,tips;
  if(finalNum>=85){
    title='🏆 KABOG NA KABOG!';sub='Ikaw ang tunay na Pinoy na matalino!';
    reflection='Napakahusay mo! Pinamamahalaan mo nang maayos ang allowance mo habang iniingatan ang pamilya, kaibigan, at sariling kalusugan. Maganda ang kinabukasan mo dahil alam mo nang maaga ang halaga ng pera at tamang desisyon.';
    tips=['Subukan ang saving challenge — ₱1 sa unang araw, ₱2 sa ikalawa, at iba pa','Ituloy ang ugaling mag-baon para makatipid','Huwag kalimutang mag-ambag sa pamilya kapag kaya mo'];
  }else if(finalNum>=65){
    title='👍 MAGALING!';sub='May magandang simula ka na!';
    reflection='Maayos ang ginawa mo! May mga desisyon kang pwedeng pagandahin pa, lalo na sa pag-iisip nang mas matagal bago gumastos. Keep it up at patuloy na matuto!';
    tips=['I-practice ang 24-hour rule — hintayin ng isang araw bago bumili ng hindi kinakailangan','Gumawa ng simpleng budget planner','I-track ang mga nagastos mo lingguhan'];
  }else if(finalNum>=40){
    title='⚠️ Kailangan ng Improvement';sub='Natuto ka ng mabuting aral ngayon.';
    reflection='Mahirap ang pamamahala ng pera, alam na alam mo na iyan ngayon! Maraming beses kang nahulog sa tukso ng pagpapakasaya nang hindi inisip ang bukas. Pero okay lang — ito ang layunin ng laro: matuto!';
    tips=['Una: bayaran muna ang kailangan, pagkatapos ang gusto','Huwag umutang maliban sa emergency','Mag-ipon kahit ₱5 o ₱10 sa bawat linggo'];
  }else{
    title='😬 Grabe ang Nangyari!';sub='Pag-aralan natin ang nangyari…';
    reflection='Maubos ang allowance bago matapos ang linggo — ito ang pinakamahal na aral ng laro. Sa totoong buhay, mas malala pa ang consequences. Pero ngayon mo pa lang natutunan ito — mas maaga, mas mabuti!';
    tips=['Gawa ng listahan ng kailangan vs gusto bago bumili','Pag-usapan ang budget sa magulang o guardian mo','Subukan muli ang laro at gamitin ang mga natutunan mo!'];
  }

  document.getElementById('resultTitle').textContent=title;
  document.getElementById('resultSub').textContent=sub;
  document.getElementById('finalGradeDisplay').textContent=finalNum+'%';
  document.getElementById('reflectionText').textContent=reflection;

  const grid=document.getElementById('resultGrid');
  [{label:'💰 Pera natitira',val:'₱'+gs.money},{label:'📚 Grades',val:gs.grades+'%'},
   {label:'❤️ Kalusugan',val:gs.health+'/10'},{label:'💕 Kaibigan',val:gs.friendship+'/10'},
   {label:'👨‍👩‍👧 Pamilya',val:gs.family+'/10'},{label:'😰 Stress',val:gs.stress+'/10'},
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

// Display results when page loads
displayResults();
}

// Display results when page loads
displayResults();
