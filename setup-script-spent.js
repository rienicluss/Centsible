// ─── SETUP PAGE LOGIC (SPENT STYLE) ───
// Clear any old game data when setup page loads
document.addEventListener('DOMContentLoaded', () => {
  sessionStorage.removeItem('gameState');
  
  // Menu toggle
  const menuBtn = document.getElementById('menuBtn');
  const menuDropdown = document.getElementById('menuDropdown');
  
  menuBtn.addEventListener('click', () => {
    if(menuDropdown.style.display === 'none'){
      menuDropdown.style.display = 'flex';
      menuDropdown.classList.add('show');
    }else{
      menuDropdown.style.display = 'none';
      menuDropdown.classList.remove('show');
    }
  });
  
  // Challenge button - show form
  const startBtn = document.getElementById('startBtn');
  const setupForm = document.getElementById('setupForm');
  
  startBtn.addEventListener('click', () => {
    setupForm.style.display = 'block';
    setupForm.scrollIntoView({behavior: 'smooth', block: 'center'});
  });
  
  // Leaderboard button
  const leaderboardBtn = document.getElementById('leaderboardBtn');
  leaderboardBtn.addEventListener('click', () => {
    window.location.href = 'leaderboard.html';
  });
  
  // About button (How It Works)
  const aboutBtn = document.getElementById('aboutBtn');
  aboutBtn.addEventListener('click', () => {
    window.location.href = 'how-it-works.html';
  });
  
  // Confirm button - validate and start game
  const confirmBtn = document.getElementById('confirmBtn');
  confirmBtn.addEventListener('click', () => {
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
});
