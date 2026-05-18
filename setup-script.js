// ─── SETUP PAGE LOGIC ───
// Clear any old game data when setup page loads
document.addEventListener('DOMContentLoaded', () => {
  sessionStorage.removeItem('gameState');
  
  // Setup menu button listener
  const leaderboardBtn = document.getElementById('leaderboardBtn');
  if(leaderboardBtn){
    leaderboardBtn.addEventListener('click', () => {
      window.location.href = 'leaderboard.html';
    });
  }
  
  // Setup start button listener
  const startBtn = document.getElementById('startBtn');
  if(startBtn){
    startBtn.addEventListener('click', () => {
      const name = document.getElementById('playerName').value.trim();
      const age = document.getElementById('playerAge').value;
      const grade = document.getElementById('playerGrade').value;
      
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
  }
});

// Toggle menu visibility
function toggleMenu(){
  const dropdown = document.getElementById('menuDropdown');
  if(!dropdown) return;
  dropdown.classList.toggle('show');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('menuDropdown');
  const btn = document.getElementById('menuBtn');
  if(menu && btn && !menu.contains(e.target) && !btn.contains(e.target)){
    menu.classList.remove('show');
  }
});
