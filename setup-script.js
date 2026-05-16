// ─── SETUP PAGE LOGIC ───
// Clear any old game data when setup page loads
document.addEventListener('DOMContentLoaded', () => {
  sessionStorage.removeItem('gameState');
});

document.getElementById('startBtn').addEventListener('click',()=>{
  const name=document.getElementById('playerName').value.trim();
  const age=document.getElementById('playerAge').value;
  const grade=document.getElementById('playerGrade').value;
  
  if(!name){showToast('Ilagay mo ang iyong pangalan!','bad');return;}
  if(!age){showToast('Ilagay mo ang iyong edad!','bad');return;}
  if(!grade){showToast('Piliin mo ang iyong grade!','bad');return;}
  
  // Clear old data and save new player data
  sessionStorage.removeItem('gameState');
  sessionStorage.setItem('playerName', name);
  sessionStorage.setItem('playerAge', age);
  sessionStorage.setItem('playerGrade', grade);
  
  // Navigate to game page
  window.location.href='game.html';
});

document.getElementById('leaderboardBtn').addEventListener('click',()=>{
  window.location.href='leaderboard.html';
});
