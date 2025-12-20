document.addEventListener("DOMContentLoaded", () => {
  const DESKTOP_BP = 768;

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

    function showNotif() {
      mainScreen.classList.add("hidden");
      notifScreen.classList.add("active");
      openScreen.classList.remove("active");

      if (okayBtn) okayBtn.classList.remove("show");
      if (okayTimer) clearTimeout(okayTimer);
    }

    function showOpenMessage() {
      notifScreen.classList.remove("active");
      openScreen.classList.add("active");

      if (okayBtn) {
        okayBtn.classList.remove("show");
        if (okayTimer) clearTimeout(okayTimer);
        okayTimer = setTimeout(() => {
          okayBtn.classList.add("show");
        }, 3000);
      }
    }

    if (playButton) playButton.addEventListener("click", showNotif);
    if (openTrigger) openTrigger.addEventListener("click", showOpenMessage);
  }

  // wire up whichever UI is currently visible
  wireUI(getActiveUI());
});
