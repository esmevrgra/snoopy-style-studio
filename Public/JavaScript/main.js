console.log("main.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.querySelector(".play-button");
  const mainScreen = document.querySelector(".screen-main");
  const messageScreen = document.querySelector(".screen-message");

  if (!playButton || !mainScreen || !messageScreen) return;

  playButton.addEventListener("click", () => {
    mainScreen.classList.add("hidden");
    messageScreen.classList.add("active");
  });
});
