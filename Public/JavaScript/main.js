console.log("main.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  const mainScreen = document.querySelector(".screen-main");
  const messageScreen = document.querySelector(".screen-message");

  const playButton = document.querySelector(".play-button");
  const openTrigger = document.querySelector(".open-trigger");

  if (!mainScreen || !messageScreen) return;

  function goToMessageScreen() {
    mainScreen.classList.add("hidden");
    messageScreen.classList.add("active");
  }

  if (playButton) {
    playButton.addEventListener("click", goToMessageScreen);
  }

  if (openTrigger) {
    openTrigger.addEventListener("click", goToMessageScreen);
  }
});
