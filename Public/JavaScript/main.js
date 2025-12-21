// public/javascript/main.js

document.addEventListener("DOMContentLoaded", () => {
  const DESKTOP_BP = 768;

  // ---------- Audio elements ----------
  const bgm = document.getElementById("bgm");            // loop music
  const notifSfx = document.getElementById("notifSfx");  // notif sound
  const clickSfx = document.getElementById("clickSfx");  // click sound

  // ---------- Audio functions ----------
  function playMusic() {
    if (!bgm) return Promise.resolve(false);
    bgm.volume = 0.35;
    return bgm.play().then(() => true).catch(() => false);
  }

  function playSfx(el, volume = 0.85) {
    if (!el) return Promise.resolve(false);
    try {
      el.volume = volume;
      el.currentTime = 0; // restart so it can be replayed quickly
      return el.play().then(() => true).catch(() => false);
    } catch (_) {
      return Promise.resolve(false);
    }
  }

  function playNotif() {
    return playSfx(notifSfx, 0.85);
  }

  function playClick() {
    return playSfx(clickSfx, 0.9);
  }

  // Try to start music as soon as the page loads (often blocked)
  playMusic();

  // Fallback: start music on first interaction anywhere
  const unlockMusic = () =>
  {
    playMusic();
    window.removeEventListener("pointerdown", unlockMusic);
    window.removeEventListener("keydown", unlockMusic);
  };
  window.addEventListener("pointerdown", unlockMusic, { passive: true });
  window.addEventListener("keydown", unlockMusic);

  // ---------- UI helpers ----------
  function getActiveUI() {
    const isMobile = window.innerWidth <= DESKTOP_BP;
    return document.querySelector(isMobile ? "#mobileUI" : "#desktopUI");
  }

  function wireUI(ui) {
    if (!ui) return;

    const mainScreen = ui.querySelector(".screen-main");
    const notifScreen = ui.querySelector(".screen-message");
    const openScreen = ui.querySelector(".screen-message-open");

    const playButton = ui.querySelector(".play-button");
    const openTrigger = ui.querySelector(".open-trigger");
    const okayBtn = ui.querySelector(".okay-btn");

    if (!mainScreen || !notifScreen || !openScreen) return;

    let okayTimer = null;
    let notifSoundTimer = null;

    function showNotif() {
      // Click sound when Play is clicked
      playClick();

      // Start music (in case it was blocked until now)
      playMusic();

      // Play notif sound 2 seconds after the 2nd screen appears
      if (notifSoundTimer) clearTimeout(notifSoundTimer);
      notifSoundTimer = setTimeout(() => {
        const stillOnNotif =
          notifScreen.classList.contains("active") &&
          !openScreen.classList.contains("active");
        if (stillOnNotif) playNotif();
      }, 90);

      mainScreen.classList.add("hidden");
      notifScreen.classList.add("active");
      openScreen.classList.remove("active");

      if (okayBtn) okayBtn.classList.remove("show");
      if (okayTimer) clearTimeout(okayTimer);
    }

    function showOpenMessage() {
      // Click sound when "tap to open..." is pressed
      playClick();
      setTimeout(playNotif, 70);

    
      notifScreen.classList.remove("active");
      openScreen.classList.add("active");
    
      // If user moved on quickly, cancel pending notif sound
      if (notifSoundTimer) {
        clearTimeout(notifSoundTimer);
        notifSoundTimer = null;
      }
    
      if (okayBtn) {
        okayBtn.classList.remove("show");
        if (okayTimer) clearTimeout(okayTimer);
    
        okayTimer = setTimeout(() => {
          okayBtn.classList.add("show");
        }, 2000);
      }
    }
    

    if (playButton) playButton.addEventListener("click", showNotif);
    if (openTrigger) openTrigger.addEventListener("click", showOpenMessage);
    if (okayBtn) okayBtn.addEventListener("click", playClick);


  }

  // Wire up whichever UI is currently visible
  wireUI(getActiveUI());
});
