// ─── LEADERBOARD PAGE LOGIC ───
function displayLeaderboard(){
  const scoresStr = localStorage.getItem('allowanceScores');
  const scores = scoresStr ? JSON.parse(scoresStr) : [];
  
  const listEl = document.getElementById('leaderboardList');
  const emptyEl = document.getElementById('emptyState');
  
  if(scores.length === 0){
    listEl.style.display = 'none';
    emptyEl.style.display = 'block';
    return;
  }
  
  // Sort by score descending
  scores.sort((a,b) => b.score - a.score);
  
  // Display top 20
  listEl.innerHTML = '';
  scores.slice(0, 20).forEach((entry, idx) => {
    const rankClass = idx === 0 ? 'top1' : idx === 1 ? 'top2' : idx === 2 ? 'top3' : '';
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx+1}.`;
    
    const div = document.createElement('div');
    div.className = `lb-entry-spent ${rankClass}`;
    div.innerHTML = `
      <div class="lb-rank-spent">${medal}</div>
      <div class="lb-info-spent">
        <div class="lb-name-spent">${entry.name}</div>
        <div class="lb-details-spent">${entry.grade} • Age ${entry.age}</div>
      </div>
      <div class="lb-score-spent">
        <div class="lb-score-val-spent">${entry.score}%</div>
        <div class="lb-grade-spent">${entry.tier}</div>
      </div>
    `;
    listEl.appendChild(div);
  });
  
  emptyEl.style.display = 'none';
  listEl.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', displayLeaderboard);
