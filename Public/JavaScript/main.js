document.addEventListener("DOMContentLoaded", () => {
  const mainScreen = document.querySelector(".screen-main");
  const notifScreen = document.querySelector(".screen-message");
  const openScreen = document.querySelector(".screen-message-open");

  const playButton = document.querySelector(".play-button");
  const openTrigger = document.querySelector(".open-trigger");
  const okayBtn = document.querySelector(".okay-btn");

  let okayTimer = null;

  function showNotif() {
    mainScreen.classList.add("hidden");
    notifScreen.classList.add("active");
    openScreen.classList.remove("active");

    // reset okay button whenever we leave open screen
    if (okayBtn) okayBtn.classList.remove("show");
    if (okayTimer) clearTimeout(okayTimer);
  }

  function showOpenMessage() {
    notifScreen.classList.remove("active");
    openScreen.classList.add("active");

    // hide first, then reveal after 6 seconds
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
});
