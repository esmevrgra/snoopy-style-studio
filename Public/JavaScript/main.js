// public/javascript/main.js

document.addEventListener("DOMContentLoaded", () => {
  const DESKTOP_BP = 768;

  // ---------- Scene scale (DESKTOP) ----------
  const DESIGN_W = 5920;
  const DESIGN_H = 2900;

  function applySceneScale() {
    const scene = document.querySelector(".scene");
    if (!scene) return;

    const isMobile = window.innerWidth <= DESKTOP_BP;

    if (isMobile) {
      // let mobile CSS handle layout; remove scale var so it can't interfere
      scene.style.removeProperty("--scale");
      return;
    }

    const scale = Math.min(
      1,
      window.innerWidth / DESIGN_W,
      window.innerHeight / DESIGN_H
    );

    scene.style.setProperty("--scale", String(scale));
  }

  applySceneScale();
  window.addEventListener("resize", applySceneScale);

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
      el.currentTime = 0;
      return el.play().then(() => true).catch(() => false);
    }
    catch (_)
    {
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
  const unlockMusic = () => {
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
  const gameScreen = ui.querySelector(".screen-game");

  const playButton = ui.querySelector(".play-button");
  const openTrigger = ui.querySelector(".open-trigger");
  const okayBtn = ui.querySelector(".okay-btn");

  // Exit + Reset elements (image + text)
  const exitBtnImg = ui.querySelector(".exit-btn");
  const exitBtnText = ui.querySelector(".exit");
  const resetBtnImg = ui.querySelector(".reset-btn");
  const resetBtnText = ui.querySelector(".reset");

  if (!mainScreen || !notifScreen || !openScreen) return;

  let okayTimer = null;
  let notifSoundTimer = null;

  function showNotif() {
    playClick();
    playMusic();

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
    playClick();
    setTimeout(playNotif, 70);

    notifScreen.classList.remove("active");
    openScreen.classList.add("active");

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

  function showGameScreen() {
    document.body.classList.add("game-mode");
    if (!gameScreen) return;

    mainScreen.classList.add("hidden");
    notifScreen.classList.remove("active");
    openScreen.classList.remove("active");

    gameScreen.classList.add("active");
  }

  // ✅ GO BACK TO FIRST PAGE (main screen)
  function goHome() {
    document.body.classList.remove("game-mode");

    if (gameScreen) gameScreen.classList.remove("active");

    mainScreen.classList.remove("hidden");
    notifScreen.classList.remove("active");
    openScreen.classList.remove("active");

    if (okayBtn) okayBtn.classList.remove("show");
    if (okayTimer) clearTimeout(okayTimer);
  }

  // wire clicks
  if (playButton) playButton.addEventListener("click", showNotif);
  if (openTrigger) openTrigger.addEventListener("click", showOpenMessage);

  if (okayBtn) {
    okayBtn.addEventListener("click", () => {
      playClick();
      showGameScreen();
    });
  }

  // ✅ exit button: image + text
  if (exitBtnImg) exitBtnImg.addEventListener("click", () => {
    playClick();
    goHome();
  });

  if (exitBtnText) exitBtnText.addEventListener("click", () => {
    playClick();
    goHome();
  });

  // optional: ensure game starts hidden
  if (gameScreen) gameScreen.classList.remove("active");
}


  // Wire up whichever UI is currently visible
  wireUI(getActiveUI());
});
