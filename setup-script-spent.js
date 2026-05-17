// ─── SLIDESHOW LOGIC (SPENT STYLE) ───

let currentSlide = 0;
let slides = [];

function startSlideshow() {
  const titleScreen = document.getElementById('titleScreen');
  const slideshowContainer = document.getElementById('slideshowContainer');
  
  if(titleScreen) titleScreen.style.display = 'none';
  if(slideshowContainer) slideshowContainer.style.display = 'flex';
  
  slides = Array.from(document.querySelectorAll('.slideshow-container .slide'));
  currentSlide = 0;
  
  showSlide(0);
  setupAutoAdvance();
}

function showSlide(n) {
  if(!slides || slides.length === 0) return;
  
  // Remove active class from all slides
  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  
  // Show current slide
  if(n >= 0 && n < slides.length){
    slides[n].classList.add('active');
    currentSlide = n;
    
    // Focus on input if it's an input slide
    const input = slides[n].querySelector('.slide-input');
    if(input){
      setTimeout(() => {
        input.focus();
      }, 300);
    }
  }
}

function nextSlide() {
  if(currentSlide < slides.length - 1){
    showSlide(currentSlide + 1);
  }
}

function prevSlide() {
  if(currentSlide > 0){
    showSlide(currentSlide - 1);
  }
}

function setupAutoAdvance() {
  // Auto-advance for name input
  const playerName = document.getElementById('playerName');
  if(playerName){
    playerName.addEventListener('change', () => {
      if(playerName.value.trim().length > 0 && currentSlide === 6){
        setTimeout(nextSlide, 500);
      }
    });
    playerName.addEventListener('blur', () => {
      if(playerName.value.trim().length > 0 && currentSlide === 6){
        setTimeout(nextSlide, 300);
      }
    });
  }
  
  // Auto-advance for age input
  const playerAge = document.getElementById('playerAge');
  if(playerAge){
    playerAge.addEventListener('change', () => {
      if(playerAge.value && currentSlide === 7){
        setTimeout(nextSlide, 500);
      }
    });
    playerAge.addEventListener('blur', () => {
      if(playerAge.value && currentSlide === 7){
        setTimeout(nextSlide, 300);
      }
    });
  }
  
  // Auto-advance for allowance input
  const playerAllowance = document.getElementById('playerAllowance');
  if(playerAllowance){
    playerAllowance.addEventListener('change', () => {
      if(playerAllowance.value && currentSlide === 8){
        setTimeout(nextSlide, 500);
      }
    });
    playerAllowance.addEventListener('blur', () => {
      if(playerAllowance.value && currentSlide === 8){
        setTimeout(nextSlide, 300);
      }
    });
  }
  
  // Setup menu buttons
  const leaderboardBtn = document.getElementById('leaderboardBtn');
  if(leaderboardBtn){
    leaderboardBtn.onclick = () => {
      window.location.href = 'leaderboard.html';
    };
  }
  
  const aboutBtn = document.getElementById('aboutBtn');
  if(aboutBtn){
    aboutBtn.onclick = () => {
      window.location.href = 'how-it-works.html';
    };
  }
}

function submitSetupForm() {
  const name = document.getElementById('playerName').value.trim();
  const age = document.getElementById('playerAge').value;
  const allowance = document.getElementById('playerAllowance').value;
  
  if(!name){alert('Ilagay mo ang iyong pangalan!');return false;}
  if(!age){alert('Ilagay mo ang iyong edad!');return false;}
  if(!allowance){alert('Ilagay mo ang iyong weekly allowance!');return false;}
  
  const amt = parseInt(allowance);
  if(amt < 10){alert('Allowance dapat at least ₱10!');return false;}
  if(amt > 5000){alert('Allowance ay maximum ₱5000!');return false;}
  
  sessionStorage.removeItem('gameState');
  sessionStorage.setItem('playerName', name);
  sessionStorage.setItem('playerAge', age);
  sessionStorage.setItem('playerAllowance', amt);
  
  window.location.href = 'game.html';
  return false;
}

function toggleMenu() {
  const menuDropdown = document.getElementById('menuDropdown');
  if(menuDropdown){
    if(menuDropdown.style.display === 'none' || menuDropdown.style.display === ''){
      menuDropdown.style.display = 'flex';
    }else{
      menuDropdown.style.display = 'none';
    }
  }
  return false;
}

// Initialize on page load
(function() {
  function init() {
    sessionStorage.removeItem('gameState');
  }
  
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
  
  setTimeout(init, 100);
})();
});
