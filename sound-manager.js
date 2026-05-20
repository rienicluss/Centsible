// ─── SOUND MANAGER ───────────────────────────────────────
// Manages all background music and sound effects for the game

const soundManager = {
  bgMusicEnabled: true,
  sfxEnabled: true,
  masterVolume: 0.7,
  
  // Audio elements (initialized in initSounds)
  bgMusic: {
    menu: null,      // Start menu & leaderboards
    story: null,     // Story slideshow
    game: null       // In-game music
  },
  currentBgMusic: null,
  
  // Sound effects pool
  soundEffects: {},
  
  // Initialize audio system
  init() {
    this.bgMusic.menu = document.getElementById('bgMusic-menu');
    this.bgMusic.story = document.getElementById('bgMusic-story');
    this.bgMusic.game = document.getElementById('bgMusic-game');
    this.initSoundEffects();
    this.loadPreferences();
    this.setupControls();
    
    // Try to play immediately with muted (will work even on file://)
    this.playMenuMusic();
    
    // Unmute on first user interaction
    this.setupAudioUnmute();
  },
  
  // Setup unmuting on user interaction (browsers allow unmuting after user gesture)
  setupAudioUnmute() {
    const unmute = () => {
      // Unmute all audio
      if (this.bgMusic.menu) this.bgMusic.menu.muted = false;
      if (this.bgMusic.story) this.bgMusic.story.muted = false;
      if (this.bgMusic.game) this.bgMusic.game.muted = false;
      console.log('Audio unmuted');
      // Remove listeners after first interaction
      document.removeEventListener('click', unmute);
      document.removeEventListener('touchstart', unmute);
      document.removeEventListener('keydown', unmute);
    };
    
    // Listen for any user interaction
    document.addEventListener('click', unmute);
    document.addEventListener('touchstart', unmute);
    document.addEventListener('keydown', unmute);
  },
  
  // Setup audio permission - require user interaction first (browser autoplay policy)
  setupAudioPermission() {
    const enableAudio = () => {
      if (!this.audioInitialized) {
        this.audioInitialized = true;
        console.log('Audio enabled after user interaction');
        // Try playing menu music
        if (this.bgMusicEnabled) {
          this.playMenuMusic();
        }
        // Remove listeners after first interaction
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
        document.removeEventListener('keydown', enableAudio);
      }
    };
    
    // Listen for any user interaction
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
    document.addEventListener('keydown', enableAudio);
  },
  
  // Initialize sound effect audio elements
  initSoundEffects() {
    const sfxNames = [
      'click', 'coin', 'error', 'success', 
      'levelup', 'unlock', 'borrow', 'save'
    ];
    
    sfxNames.forEach(name => {
      const audio = document.getElementById(`sfx-${name}`);
      if (audio) {
        this.soundEffects[name] = audio;
      }
    });
  },
  
  // Load sound preferences from localStorage
  loadPreferences() {
    const saved = localStorage.getItem('soundPreferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      this.bgMusicEnabled = prefs.bgMusicEnabled !== false;
      this.sfxEnabled = prefs.sfxEnabled !== false;
      this.masterVolume = prefs.masterVolume || 0.7;
    }
    this.updateVolumeControls();
  },
  
  // Save sound preferences
  savePreferences() {
    localStorage.setItem('soundPreferences', JSON.stringify({
      bgMusicEnabled: this.bgMusicEnabled,
      sfxEnabled: this.sfxEnabled,
      masterVolume: this.masterVolume
    }));
  },
  
  // Setup volume and toggle controls
  setupControls() {
    const volumeSlider = document.getElementById('volumeSlider');
    const bgToggle = document.getElementById('bgMusicToggle');
    const sfxToggle = document.getElementById('sfxToggle');
    const soundBtn = document.getElementById('soundBtn');
    const soundMenuBtn = document.getElementById('soundMenuBtn');
    const soundModalClose = document.getElementById('soundModalClose');
    const soundModal = document.getElementById('soundModal');
    
    // Sound button from hamburger menu (start screen)
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        if (soundModal) {
          soundModal.classList.add('show');
        }
      });
    }
    
    // Sound menu button toggle (game screen)
    if (soundMenuBtn) {
      soundMenuBtn.addEventListener('click', () => {
        soundModal.classList.add('show');
      });
    }
    
    // Close button
    if (soundModalClose) {
      soundModalClose.addEventListener('click', () => {
        soundModal.classList.remove('show');
      });
    }
    
    // Close modal when clicking outside
    if (soundModal) {
      soundModal.addEventListener('click', (e) => {
        if (e.target.id === 'soundModal') {
          soundModal.classList.remove('show');
        }
      });
    }
    
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this.masterVolume = parseFloat(e.target.value);
        this.updateVolumes();
        this.savePreferences();
      });
    }
    
    if (bgToggle) {
      bgToggle.addEventListener('change', (e) => {
        this.bgMusicEnabled = e.target.checked;
        if (this.bgMusicEnabled) {
          // Resume current music if it exists
          if (this.currentBgMusic) {
            this.currentBgMusic.play().catch(err => {
              console.log('Could not play music:', err);
            });
          }
        } else {
          this.stopAllBgMusic();
        }
        this.savePreferences();
      });
    }
    
    if (sfxToggle) {
      sfxToggle.addEventListener('change', (e) => {
        this.sfxEnabled = e.target.checked;
        this.savePreferences();
      });
    }
  },
  
  // Update all audio volumes based on master volume
  updateVolumes() {
    const bgVolume = this.masterVolume * 0.6; // BG music slightly quieter
    const sfxVolume = this.masterVolume * 0.8; // SFX at adjusted volume
    
    if (this.bgMusic.menu) this.bgMusic.menu.volume = bgVolume;
    if (this.bgMusic.story) this.bgMusic.story.volume = bgVolume;
    if (this.bgMusic.game) this.bgMusic.game.volume = bgVolume;
    
    Object.values(this.soundEffects).forEach(audio => {
      if (audio) {
        audio.volume = sfxVolume;
      }
    });
  },
  
  // Update volume control UI
  updateVolumeControls() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumePercent = document.getElementById('volumePercent');
    
    if (volumeSlider) {
      volumeSlider.value = this.masterVolume;
    }
    if (volumePercent) {
      volumePercent.textContent = Math.round(this.masterVolume * 100);
    }
    
    const bgToggle = document.getElementById('bgMusicToggle');
    const sfxToggle = document.getElementById('sfxToggle');
    
    if (bgToggle) bgToggle.checked = this.bgMusicEnabled;
    if (sfxToggle) sfxToggle.checked = this.sfxEnabled;
    
    this.updateVolumes();
  },
  
  // Stop all background music
  stopAllBgMusic() {
    Object.values(this.bgMusic).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    this.currentBgMusic = null;
  },
  
  // Play menu music (start screen & leaderboards)
  playMenuMusic() {
    if (!this.bgMusicEnabled || !this.bgMusic.menu) return;
    this.stopAllBgMusic();
    this.currentBgMusic = this.bgMusic.menu;
    this.bgMusic.menu.currentTime = 0;
    this.bgMusic.menu.play().catch(err => {
      console.log('Could not play menu music:', err);
    });
  },
  
  // Play story music (slideshow)
  playStoryMusic() {
    if (!this.bgMusicEnabled || !this.bgMusic.story) return;
    this.stopAllBgMusic();
    this.currentBgMusic = this.bgMusic.story;
    this.bgMusic.story.currentTime = 0;
    this.bgMusic.story.play().catch(err => {
      console.log('Could not play story music:', err);
    });
  },
  
  // Play game music (during gameplay)
  playGameMusic() {
    if (!this.bgMusicEnabled || !this.bgMusic.game) return;
    this.stopAllBgMusic();
    this.currentBgMusic = this.bgMusic.game;
    this.bgMusic.game.currentTime = 0;
    this.bgMusic.game.play().catch(err => {
      console.log('Could not play game music:', err);
    });
  },
  
  // Play a sound effect
  playSFX(effectName) {
    if (!this.sfxEnabled) return;
    
    const audio = this.soundEffects[effectName];
    if (!audio) {
      console.log('Sound effect not found:', effectName);
      return;
    }
    
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.log('Could not play SFX:', err);
    });
  },
  
  // Play sound with fallback
  playSound(name) {
    this.playSFX(name);
  }
};

// Initialize sounds when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    soundManager.init();
  });
} else {
  soundManager.init();
}
