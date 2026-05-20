# Audio Setup Guide for ALLOWANCE Game

## Directory Structure

Create the following folder structure in your game directory:

```
Game/
├── audio/
│   ├── bg-menu.mp3           (Start menu & Leaderboards)
│   ├── bg-story.mp3          (Story slideshow)
│   ├── bg-game.mp3           (In-game music)
│   └── sfx/
│       ├── click.mp3
│       ├── coin.mp3
│       ├── error.mp3
│       ├── success.mp3
│       ├── levelup.mp3
│       ├── unlock.mp3
│       ├── borrow.mp3
│       └── save.mp3
```

## Audio Files Needed

### Background Music (3 files)

#### 1. **bg-menu.mp3**
- **Where Used:** Start screen, hamburger menu, leaderboard page
- **Duration:** 30+ seconds (loops continuously)
- **Style:** Welcoming, upbeat, calm background music
- **Suggestions:**
  - Search: "royalty free menu music" or "game lobby music"
  - Sites: Pixabay, Incompetech, YouTube Audio Library

#### 2. **bg-story.mp3**
- **Where Used:** Story slideshow (introduction/narrative screens)
- **Duration:** 30+ seconds (loops continuously)
- **Style:** Engaging, narrative-driven, slightly dramatic
- **Suggestions:**
  - Search: "royalty free story music" or "game intro music"
  - Make it different from menu and game music

#### 3. **bg-game.mp3**
- **Where Used:** During actual gameplay (making daily choices)
- **Duration:** 30+ seconds (loops continuously)
- **Style:** Upbeat, energetic, educational, Filipino-inspired optional
- **Volume Level:** Medium (controlled by master volume slider)
- **Suggestions:**
  - Search: "royalty free upbeat game music"
  - Should be different from story music but complementary

### Sound Effects (8 files)

#### 1. **click.mp3 / click.ogg**
- **When Used:** When player selects a choice
- **Duration:** 0.3-0.5 seconds
- **Type:** Short, punchy click/button sound
- **Suggestions:** Game UI click, switch sound

#### 2. **coin.mp3 / coin.ogg**
- **When Used:** When money is spent or withdrawn from savings
- **Duration:** 0.4-0.6 seconds
- **Type:** Metallic coin drop/jingle sound
- **Suggestions:** Cash register sound, coin drop effect

#### 3. **error.mp3 / error.ogg**
- **When Used:** When an invalid action occurs (insufficient funds, empty fields)
- **Duration:** 0.3-0.5 seconds
- **Type:** Buzzer or negative beep
- **Suggestions:** Error buzz, wrong answer sound

#### 4. **success.mp3 / success.ogg**
- **When Used:** When a positive/beneficial choice is made
- **Duration:** 0.5-0.7 seconds
- **Type:** Uplifting chime or ding
- **Suggestions:** Positive notification, success chime

#### 5. **levelup.mp3 / levelup.ogg**
- **When Used:** When reaching a new week/Monday reset
- **Duration:** 0.8-1.2 seconds
- **Type:** Celebratory level-up sound
- **Suggestions:** Level up jingle, achievement sound

#### 6. **unlock.mp3 / unlock.ogg**
- **When Used:** When unlocking new features or events
- **Duration:** 0.5-0.8 seconds
- **Type:** Achievement or unlock sound
- **Suggestions:** Power-up sound, unlock chime

#### 7. **borrow.mp3 / borrow.ogg**
- **When Used:** When borrowing money from parents
- **Duration:** 0.4-0.6 seconds
- **Type:** Interesting, slightly warning-like sound
- **Suggestions:** Cha-ching, cash register, or mild alert sound

#### 8. **save.mp3 / save.ogg**
- **When Used:** When saving money to piggy bank
- **Duration:** 0.5-0.7 seconds
- **Type:** Positive, satisfying thud or chime
- **Suggestions:** Piggy bank drop, satisfaction sound, coin into piggy bank

## How to Get These Sounds

### Option 1: Free Royalty-Free Websites
1. **Pixabay.com** - Download free MP3s
2. **Incompetech.com** - Kevin MacLeod's free music library
3. **YouTube Audio Library** - Sign in to YouTube, check available free tracks
4. **Freesound.org** - Community sound effects
5. **Freepik.com** - Music and sounds section
6. **Zapsplat.com** - Free sound effects and music

### Option 2: Create Your Own (Using Audacity - Free)
1. Download [Audacity](https://www.audacityteam.org/) (free, open-source)
2. Generate simple tones for beeps and clicks
3. Record your own sounds (coins dropping, etc.)
4. Export as MP3 and OGG formats

### Option 3: AI Sound Generators
- **Elevenlabs** - Can generate sound effects descriptions
- **Soundly** - Sound effect generator
- **BFXR** - Retro game sound generator (free, browser-based)

## Installation Steps

1. **Create the audio folder structure:**
   ```
   Right-click in Game folder → New → Folder → name it "audio"
   Right-click in audio folder → New → Folder → name it "sfx"
   ```

2. **Download or create your audio files (MP3 format)**
   - 3 background music files
   - 8 sound effect files
   - **Total: 11 MP3 files**

3. **Place files in correct locations:**
   - Background menu music → `audio/bg-menu.mp3`
   - Background story music → `audio/bg-story.mp3`
   - Background game music → `audio/bg-game.mp3`
   - Sound effects → `audio/sfx/click.mp3`, `audio/sfx/coin.mp3`, etc.

4. **Test in the game:**
   - Open game and check if music plays on load
   - Click on choices and verify sound effects work
   - Use sound settings menu (🔊 button) to toggle and adjust volume

## Browser Compatibility

MP3 format has excellent support across all modern browsers and devices.

## Troubleshooting

**No sound playing?**
1. Check if sounds are in correct folders
2. Check browser console (F12) for errors
3. Ensure file names match exactly (case-sensitive on some systems)
4. Verify files are MP3 format (.mp3 extension)
5. Check browser permissions (some browsers require user interaction first)

**Game works but sounds are missing?**
- Check file paths are correct relative to index
- Ensure audio files are not corrupted
- Verify all files have .mp3 extension
- Check that audio is not muted in system/browser

## Quick Start

**Fastest way to get sounds working:**
1. Go to Pixabay.com or Incompetech.com
2. Search and download these 11 MP3 files:
   
   **Background Music (3 files):**
   - "upbeat menu music" → `bg-menu.mp3`
   - "story narrative music" → `bg-story.mp3`
   - "upbeat game music" → `bg-game.mp3`
   
   **Sound Effects (8 files):**
   - "button click sound" → `click.mp3`
   - "coin drop" → `coin.mp3`
   - "error buzz" → `error.mp3`
   - "success chime" → `success.mp3`
   - "achievement sound" → `levelup.mp3`
   - "unlock chime" → `unlock.mp3`
   - "cash register" or "cha-ching" → `borrow.mp3`
   - "piggy bank drop" → `save.mp3`

3. Create the `audio/sfx/` folder structure
4. Rename and place all files in correct folders
5. Test in game!

**Total setup time:** ~10-15 minutes
