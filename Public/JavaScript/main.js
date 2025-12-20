console.log("main.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  const mainScreen = document.querySelector(".screen-main");
  const notifScreen = document.querySelector(".screen-message");
  const openScreen = document.querySelector(".screen-message-open");

  const playButton = document.querySelector(".play-button");
  const openTrigger = document.querySelector(".open-trigger");

  if (!mainScreen || !notifScreen || !openScreen) return;

  function showNotif() {
    mainScreen.classList.add("hidden");
    notifScreen.classList.add("active");
    openScreen.classList.remove("active");
  }

  function showOpenMessage() {
    notifScreen.classList.remove("active");
    openScreen.classList.add("active");
  }

  // MAIN → NOTIFICATION
  if (playButton) {
    playButton.addEventListener("click", showNotif);
  }

  // NOTIFICATION → OPENED MESSAGE
  if (openTrigger) {
    openTrigger.addEventListener("click", showOpenMessage);
  }
});
