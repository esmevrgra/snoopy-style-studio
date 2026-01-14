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

  // ---------- Audio ----------
  const bgm = document.getElementById("bgm");
  const notifSfx = document.getElementById("notifSfx");
  const clickSfx = document.getElementById("clickSfx");

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

  playMusic();

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

  function alreadyWired(ui) {
    return ui && ui.dataset && ui.dataset.wired === "1";
  }
  function markWired(ui) {
    if (ui && ui.dataset) ui.dataset.wired = "1";
  }

  function wireUI(ui) {
    if (!ui || alreadyWired(ui)) return;

    const mainScreen = ui.querySelector(".screen-main");
    const notifScreen = ui.querySelector(".screen-message");
    const openScreen = ui.querySelector(".screen-message-open");
    const gameScreen = ui.querySelector(".screen-game");

    const playButton = ui.querySelector(".play-button");
    const openTrigger = ui.querySelector(".open-trigger");
    const okayBtn = ui.querySelector(".okay-btn");

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

    function goHome() {
      document.body.classList.remove("game-mode");

      if (gameScreen) gameScreen.classList.remove("active");

      mainScreen.classList.remove("hidden");
      notifScreen.classList.remove("active");
      openScreen.classList.remove("active");

      if (okayBtn) okayBtn.classList.remove("show");
      if (okayTimer) clearTimeout(okayTimer);
    }

    // ---------- Carousels + Wearing ----------
    function setupCarousels() {
      const slots = [
        {
          // Slot 1 (hat)
          itemEl: ui.querySelector(".santa-hat"),
          prevEl: ui.querySelector(".t1-1"),
          nextEl: ui.querySelector(".t1-2"),
          applyEl: ui.querySelector(".c1"),
          wearEl: ui.querySelector(".wear-1"),
          names: ["santa-hat", "my-melo", "snorlax"],
          previewSrc: [
            "/assets/clothes/santa-hat.png",
            "/assets/clothes/my-melo.png",
            "/assets/clothes/snorlax.png",
          ],
          wearSrc: [
            "/assets/clothes/wearing/santa-hat-wear.png",
            "/assets/clothes/wearing/melo-wear.png",
            "/assets/clothes/wearing/snor-wear.png",
          ],
        },
        {
          // Slot 2 (sweater)
          itemEl: ui.querySelector(".red-sweat"),
          prevEl: ui.querySelector(".t2-1"),
          nextEl: ui.querySelector(".t2-2"),
          applyEl: ui.querySelector(".c2"),
          wearEl: ui.querySelector(".wear-2"),
          names: ["red-sweat", "pink-sweat", "purple-sweat"],
          previewSrc: [
            "/assets/clothes/red-sweat.png",
            "/assets/clothes/pink-sweat.png",
            "/assets/clothes/purple-sweat.png",
          ],
          wearSrc: [
            "/assets/clothes/wearing/red-sweat-wear.png",
            "/assets/clothes/wearing/pink-sweat-wear.png",
            "/assets/clothes/wearing/purple-sweat-wear.png",
          ],
        },
        {
          // Slot 3 (jacket)
          itemEl: ui.querySelector(".red-jack"),
          prevEl: ui.querySelector(".t3-1"),
          nextEl: ui.querySelector(".t3-2"),
          applyEl: ui.querySelector(".c3"),
          wearEl: ui.querySelector(".wear-3"),
          names: ["red-jack", "black-jack", "purple-jack"],
          previewSrc: [
            "/assets/clothes/red-jack.png",
            "/assets/clothes/black-jack.png",
            "/assets/clothes/purple-jack.png",
          ],
          wearSrc: [
            "/assets/clothes/wearing/red-jack-wear.png",
            "/assets/clothes/wearing/black-jack-wear.png",
            "/assets/clothes/wearing/purple-jack-wear.png",
          ],
        },
        {
          // Slot 4 (goggles / ears)
          itemEl: ui.querySelector(".goggles"),
          prevEl: ui.querySelector(".t4-1"),
          nextEl: ui.querySelector(".t4-2"),
          applyEl: ui.querySelector(".c4"),
          wearEl: ui.querySelector(".wear-4"),
          names: ["goggles", "pink-ear", "teddy"],
          previewSrc: [
            "/assets/clothes/goggles.png",
            "/assets/clothes/pink-ear.png",
            "/assets/clothes/teddy.png",
          ],
          wearSrc: [
            "/assets/clothes/wearing/googles-wear.png",
            "/assets/clothes/wearing/pink-ear-wear.png",
            "/assets/clothes/wearing/teddy-wear.png",
          ],
        },
        {
          // Slot 5 (hands / glasses)
          itemEl: ui.querySelector(".red-hand"),
          prevEl: ui.querySelector(".t5-1"),
          nextEl: ui.querySelector(".t5-2"),
          applyEl: ui.querySelector(".c5"),
          wearEl: ui.querySelector(".wear-5"),
          names: ["red-hand", "glasses", "purple-hand"],
          previewSrc: [
            "/assets/clothes/red-hand.png",
            "/assets/clothes/glasses.png",
            "/assets/clothes/purple-hand.png",
          ],
          wearSrc: [
            "/assets/clothes/wearing/red-muff-wear.png",
            "/assets/clothes/wearing/glasses-wear.png",
            "/assets/clothes/wearing/purple-muffs-wear.png",
          ],
        },
        {
          // Slot 6 (plush / beanie / snowboard)
          itemEl: ui.querySelector(".gingerbread"),
          prevEl: ui.querySelector(".t6-1"),
          nextEl: ui.querySelector(".t6-2"),
          applyEl: ui.querySelector(".c6"),
          wearEl: ui.querySelector(".wear-6"),
          names: ["gingerbread", "black-beanie", "purple-snowboard"],
          previewSrc: [
            "/assets/clothes/gingerbread-plush.png",
            "/assets/clothes/black-beanie.png",
            "/assets/clothes/purple-snowboard.png",
          ],
          wearSrc: [
            "/assets/clothes/wearing/ginger-wear.png",
            "/assets/clothes/wearing/black-beanie-wearing.png",
            "/assets/clothes/wearing/purple-snow-wear.png",
          ],
        },
      ];

      // 1) Only ONE headwear item at a time
      const HEADWEAR_ITEMS = new Set([
        "santa-hat",
        "my-melo",
        "snorlax",
        "pink-ear",
        "black-beanie",
      ]);

      // 2) Sweaters & jackets mutually exclusive (only one outerwear total)
      const OUTERWEAR_ITEMS = new Set([
        "red-sweat",
        "pink-sweat",
        "purple-sweat",
        "red-jack",
        "black-jack",
        "purple-jack",
      ]);

      // 3) my-melo/snorlax mutually exclusive with gingerbread plush
      // (If my-melo or snorlax is equipped, remove gingerbread; if gingerbread equipped, remove my-melo/snorlax)
      const MELO_SNOR_VS_GINGER = new Set([
        "my-melo",
        "snorlax",
        "gingerbread",
      ]);

      // 4) goggles and glasses mutually exclusive
      const GOGGLES_VS_GLASSES = new Set([
        "goggles",
        "glasses",
      ]);

      const idx = new Map();

      function setPreview(slot) {
        const i = idx.get(slot) ?? 0;
        if (slot.itemEl) slot.itemEl.src = slot.previewSrc[i];
        if (slot.itemEl && slot.names) slot.itemEl.dataset.item = slot.names[i];
      }

      function clearWear(slot) {
        if (!slot?.wearEl) return;
        slot.wearEl.classList.remove("show");
        slot.wearEl.removeAttribute("data-item");
        slot.wearEl.removeAttribute("src");
      }

      function removeOtherInSet(currentWearEl, setOfNames) {
        slots.forEach((s) => {
          if (!s.wearEl) return;
          if (s.wearEl === currentWearEl) return;

          const wornName = s.wearEl.dataset.item;
          if (s.wearEl.classList.contains("show") && setOfNames.has(wornName)) {
            clearWear(s);
          }
        });
      }

      function toggleWear(slot) {
        const i = idx.get(slot) ?? 0;
        if (!slot.wearEl) return;

        const itemName = slot.names?.[i];
        const itemSrc = slot.wearSrc?.[i];
        if (!itemName || !itemSrc) return;

        const isAlreadyWorn =
          slot.wearEl.classList.contains("show") &&
          slot.wearEl.dataset.item === itemName;

        // click same item again -> remove it
        if (isAlreadyWorn) {
          clearWear(slot);
          return;
        }

        // A) Headwear replaces other headwear
        if (HEADWEAR_ITEMS.has(itemName)) {
          removeOtherInSet(slot.wearEl, HEADWEAR_ITEMS);
        }

        // B) Sweater/jacket replaces other outerwear
        if (OUTERWEAR_ITEMS.has(itemName)) {
          removeOtherInSet(slot.wearEl, OUTERWEAR_ITEMS);
        }

        // C) my-melo/snorlax <-> gingerbread mutually exclusive
        if (MELO_SNOR_VS_GINGER.has(itemName)) {
          removeOtherInSet(slot.wearEl, MELO_SNOR_VS_GINGER);
        }

        // D) goggles <-> glasses mutually exclusive
        if (GOGGLES_VS_GLASSES.has(itemName)) {
          removeOtherInSet(slot.wearEl, GOGGLES_VS_GLASSES);
        }

        // Equip selected item
        slot.wearEl.src = itemSrc;
        slot.wearEl.dataset.item = itemName;
        slot.wearEl.classList.add("show");
      }

      function resetAll() {
        slots.forEach((slot) => {
          idx.set(slot, 0);
          setPreview(slot);
          clearWear(slot);
        });
      }

      // init + listeners
      slots.forEach((slot) => {
        if (!slot.itemEl || !slot.prevEl || !slot.nextEl) return;

        idx.set(slot, 0);
        setPreview(slot);

        slot.prevEl.addEventListener("click", () => {
          playClick();
          const i = idx.get(slot) ?? 0;
          idx.set(slot, (i - 1 + slot.previewSrc.length) % slot.previewSrc.length);
          setPreview(slot);
        });

        slot.nextEl.addEventListener("click", () => {
          playClick();
          const i = idx.get(slot) ?? 0;
          idx.set(slot, (i + 1) % slot.previewSrc.length);
          setPreview(slot);
        });

        // Apply / toggle by clicking the circle icon
        if (slot.applyEl) {
          slot.applyEl.addEventListener("click", () => {
            playClick();
            toggleWear(slot);
          });
        }
      });

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

    if (gameScreen) gameScreen.classList.remove("active");

    markWired(ui);
  }

  // Wire initial
  wireUI(getActiveUI());

  // If you resize across breakpoint, wire the other UI once
  let lastIsMobile = window.innerWidth <= DESKTOP_BP;
  window.addEventListener("resize", () => {
    const nowIsMobile = window.innerWidth <= DESKTOP_BP;
    if (nowIsMobile !== lastIsMobile) {
      wireUI(getActiveUI());
      lastIsMobile = nowIsMobile;
    }
  });
});
