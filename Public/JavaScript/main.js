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
  const bgm = document.getElementById("bgm");
  const notifSfx = document.getElementById("notifSfx");
  const clickSfx = document.getElementById("clickSfx");

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

    // Exit + Reset (image + text)
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

    // GO BACK to main screen
    function goHome() {
      document.body.classList.remove("game-mode");

      if (gameScreen) gameScreen.classList.remove("active");

      mainScreen.classList.remove("hidden");
      notifScreen.classList.remove("active");
      openScreen.classList.remove("active");

      if (okayBtn) okayBtn.classList.remove("show");
      if (okayTimer) clearTimeout(okayTimer);
    }

    // ---------- Asset carousels + wearing ----------
    // Returns a "resetAll()" function we can call from Reset button
    function setupCarousels() {
      const slots = [
        {
          // Circle 1 (hat)
          itemEl: ui.querySelector(".santa-hat"),
          prevEl: ui.querySelector(".t1-1"),
          nextEl: ui.querySelector(".t1-2"),
          clickEl: ui.querySelector(".c1"),
          wearEl: ui.querySelector(".wear-1"),

          names: ["santa-hat", "my-melo", "snorlax"],
          items: [
            "/assets/clothes/santa-hat.png",
            "/assets/clothes/my-melo.png",
            "/assets/clothes/snorlax.png",
          ],
          wearing: [
            "/assets/clothes/wearing/santa-hat-wearing.png",
            "/assets/clothes/wearing/melo-wear.png",
            "/assets/clothes/wearing/snor-wear.png",
          ],
        },
        {
          // Circle 2 (sweater)
          itemEl: ui.querySelector(".red-sweat"),
          prevEl: ui.querySelector(".t2-1"),
          nextEl: ui.querySelector(".t2-2"),
          clickEl: ui.querySelector(".c2"),
          wearEl: ui.querySelector(".wear-2"),

          names: ["red-sweat", "pink-sweat", "purple-sweat"],
          items: [
            "/assets/clothes/red-sweat.png",
            "/assets/clothes/pink-sweat.png",
            "/assets/clothes/purple-sweat.png",
          ],
          wearing: [
            "/assets/clothes/wearing/red-sweat-wear.png",
            "/assets/clothes/wearing/pink-sweat-wear.png",
            "/assets/clothes/wearing/purple-sweat-wear.png",
          ],
        },
        {
          // Circle 3 (jacket)
          itemEl: ui.querySelector(".red-jack"),
          prevEl: ui.querySelector(".t3-1"),
          nextEl: ui.querySelector(".t3-2"),
          clickEl: ui.querySelector(".c3"),
          wearEl: ui.querySelector(".wear-3"),

          names: ["red-jack", "black-jack", "purple-jack"],
          items: [
            "/assets/clothes/red-jack.png",
            "/assets/clothes/black-jack.png",
            "/assets/clothes/purple-jack.png",
          ],
          wearing: [
            "/assets/clothes/wearing/red-jack-wear.png",
            "/assets/clothes/wearing/black-jack-wear.png",
            "/assets/clothes/wearing/purple-jack-wear.png",
          ],
        },
        {
          // Circle 4 (goggles / ear muffs / teddy)
          itemEl: ui.querySelector(".goggles"),
          prevEl: ui.querySelector(".t4-1"),
          nextEl: ui.querySelector(".t4-2"),
          clickEl: ui.querySelector(".c4"),
          wearEl: ui.querySelector(".wear-4"),

          names: ["goggles", "pink-ear", "teddy"],
          items: [
            "/assets/clothes/goggles.png",
            "/assets/clothes/pink-ear.png",
            "/assets/clothes/teddy.png",
          ],
          wearing: [
            "/assets/clothes/wearing/googles-wearing.png",
            "/assets/clothes/wearing/pink-ear-wear.png",
            "/assets/clothes/wearing/teddy-wear.png",
          ],
        },
        {
          // Circle 5 (mittens / glasses / purple muffs)
          itemEl: ui.querySelector(".red-hand"),
          prevEl: ui.querySelector(".t5-1"),
          nextEl: ui.querySelector(".t5-2"),
          clickEl: ui.querySelector(".c5"),
          wearEl: ui.querySelector(".wear-5"),

          names: ["red-hand", "glasses", "purple-hand"],
          items: [
            "/assets/clothes/red-hand.png",
            "/assets/clothes/glasses.png",
            "/assets/clothes/purple-hand.png",
          ],
          wearing: [
            "/assets/clothes/wearing/red-muff-wear.png",
            "/assets/clothes/wearing/glasses-wear.png",
            "/assets/clothes/wearing/purple-muffs-wear.png",
          ],
        },
        {
          // Circle 6 (plush / beanie / snowboard)
          itemEl: ui.querySelector(".gingerbread"),
          prevEl: ui.querySelector(".t6-1"),
          nextEl: ui.querySelector(".t6-2"),
          clickEl: ui.querySelector(".c6"),
          wearEl: ui.querySelector(".wear-6"),

          names: ["gingerbread", "black-beanie", "purple-snowboard"],
          items: [
            "/assets/clothes/gingerbread-plush.png",
            "/assets/clothes/black-beanie.png",
            "/assets/clothes/purple-snowboard.png",
          ],
          wearing: [
            "/assets/clothes/wearing/ginger-wear.png",
            "/assets/clothes/wearing/black-beanie-wearing.png",
            "/assets/clothes/wearing/purple-snow-wear.png",
          ],
        },
      ];

      // Keep indices so Reset can return to the first item in each slot
      const indices = new Map();

      function render(slot) {
        const i = indices.get(slot) ?? 0;
        slot.itemEl.src = slot.items[i];

        // For your per-item CSS tweaks (like you did with santa-hat[data-item="my-melo"])
        if (slot.names) slot.itemEl.dataset.item = slot.names[i];
      }

      function applyToSnoopy(slot) {
        if (!slot.wearEl) return;
        const i = indices.get(slot) ?? 0;

        slot.wearEl.src = slot.wearing[i];
        slot.wearEl.classList.add("show");

        // Optional: lets you do wear-layer CSS tweaks later:
        // .wear-1[data-item="my-melo"] { ... }
        if (slot.names) slot.wearEl.dataset.item = slot.names[i];
      }

      slots.forEach((slot) => {
        if (!slot.itemEl || !slot.prevEl || !slot.nextEl) return;

        indices.set(slot, 0);
        render(slot);

        slot.prevEl.addEventListener("click", () => {
          playClick();
          const i = indices.get(slot) ?? 0;
          indices.set(slot, (i - 1 + slot.items.length) % slot.items.length);
          render(slot);
        });

        slot.nextEl.addEventListener("click", () => {
          playClick();
          const i = indices.get(slot) ?? 0;
          indices.set(slot, (i + 1) % slot.items.length);
          render(slot);
        });

        // Click circle to apply
        if (slot.clickEl) {
          slot.clickEl.addEventListener("click", () => {
            playClick();
            applyToSnoopy(slot);
          });
        }

        // Optional: also allow clicking the item to apply
        slot.itemEl.addEventListener("click", () => {
          playClick();
          applyToSnoopy(slot);
        });
      });

      // Reset function: return previews to first item + clear Snoopy layers
      function resetAll() {
        slots.forEach((slot) => {
          if (!slot.itemEl) return;
          indices.set(slot, 0);
          render(slot);

          if (slot.wearEl) {
            slot.wearEl.src = "";
            slot.wearEl.classList.remove("show");
            slot.wearEl.removeAttribute("data-item");
          }
        });
      }

      return resetAll;
    }

    const resetAll = setupCarousels();

    // ---------- Wire clicks ----------
    if (playButton) playButton.addEventListener("click", showNotif);
    if (openTrigger) openTrigger.addEventListener("click", showOpenMessage);

    if (okayBtn) {
      okayBtn.addEventListener("click", () => {
        playClick();
        showGameScreen();
      });
    }

    if (exitBtnImg) {
      exitBtnImg.addEventListener("click", () => {
        playClick();
        goHome();
      });
    }

    if (exitBtnText) {
      exitBtnText.addEventListener("click", () => {
        playClick();
        goHome();
      });
    }

    // Reset (image + text)
    if (resetBtnImg) {
      resetBtnImg.addEventListener("click", () => {
        playClick();
        if (typeof resetAll === "function") resetAll();
      });
    }

    if (resetBtnText) {
      resetBtnText.addEventListener("click", () => {
        playClick();
        if (typeof resetAll === "function") resetAll();
      });
    }

    // Ensure game starts hidden
    if (gameScreen) gameScreen.classList.remove("active");
  }

  wireUI(getActiveUI());
});
