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

  //GO BACK to main screen
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

    // ---------- Asset carousels (6 circles, 3 items each) ----------
  function setupCarousels() {
    const slots = [
      {
        // Circle 1 (hat)
        itemEl: ui.querySelector(".santa-hat"),
        prevEl: ui.querySelector(".t1-1"),
        nextEl: ui.querySelector(".t1-2"),
        items: [
          "/assets/clothes/santa-hat.png",
          "/assets/clothes/my-melo.png",
          "/assets/clothes/snorlax.png",
        ],
      },
      {
        // Circle 2 (sweater/top)
        itemEl: ui.querySelector(".red-sweat"),
        prevEl: ui.querySelector(".t2-1"),
        nextEl: ui.querySelector(".t2-2"),
        items: [
          "/assets/clothes/red-sweat.png",
          "/assets/clothes/pink-sweat.png",
          "/assets/clothes/purple-sweat.png",
        ],
      },
      {
        // Circle 3 (jacket)
        itemEl: ui.querySelector(".red-jack"),
        prevEl: ui.querySelector(".t3-1"),
        nextEl: ui.querySelector(".t3-2"),
        items: [
          "/assets/clothes/red-jack.png",
          "/assets/clothes/black-jack.png",
          "/assets/clothes/purple-jack.png",
        ],
      },
      {
        // Circle 4 (glasses)
        itemEl: ui.querySelector(".goggles"),
        prevEl: ui.querySelector(".t4-1"),
        nextEl: ui.querySelector(".t4-2"),
        items: [
          "/assets/clothes/goggles.png",
          "/assets/clothes/pink-ear.png",
          "/assets/clothes/teddy.png",
        ],
      },
      {
        // Circle 5 (mittens)
        itemEl: ui.querySelector(".red-hand"),
        prevEl: ui.querySelector(".t5-1"),
        nextEl: ui.querySelector(".t5-2"),
        items: [
          "/assets/clothes/red-hand.png",
          "/assets/clothes/glasses.png",
          "/assets/clothes/purple-hand.png",
        ],
      },
      {
        // Circle 6 (plush)
        itemEl: ui.querySelector(".gingerbread"),
        prevEl: ui.querySelector(".t6-1"),
        nextEl: ui.querySelector(".t6-2"),
        items: [
          "/assets/clothes/gingerbread-plush.png",
          "/assets/clothes/black-beanie.png",
          "/assets/clothes/purple-snowboard.png",
        ],
      },
    ];

    slots.forEach((slot) => {
      if (!slot.itemEl || !slot.prevEl || !slot.nextEl) return;

      let i = 0;
      slot.itemEl.src = slot.items[i];

      slot.prevEl.addEventListener("click", () => {
        playClick();
        i = (i - 1 + slot.items.length) % slot.items.length;
        slot.itemEl.src = slot.items[i];
      });

      slot.nextEl.addEventListener("click", () => {
        playClick();
        i = (i + 1) % slot.items.length;
        slot.itemEl.src = slot.items[i];
      });
    });
  }

  setupCarousels();


}


  // Wire up whichever UI is currently visible
  wireUI(getActiveUI());
});
