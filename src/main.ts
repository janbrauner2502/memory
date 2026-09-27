// @ts-ignore
import "../main.scss";
import { startPage, settingPage } from "./templates";

let Btn = document.querySelector("button") as HTMLElement;
let body = document.querySelector("body") as HTMLElement;
type btnType = "settingPage" | "startGame" | "exitGame";
type Theme = "vibe" | "gaming" | "da-project" | "food";


document.addEventListener("click", (event:MouseEvent) => {
  const button= (event.target as HTMLElement).closest('.btn') as HTMLElement;
  if(!button) return;

  const action = button.dataset.action as btnType | undefined;
  if (!action) return;

  switch (action) {
    case "settingPage":
      body.innerHTML = settingPage();
      break;
    case "startGame":
      console.log("Start game clicked");
      break;
    case "exitGame":
      console.log("Exit game clicked");
      break;
    default:
      console.log("Unknown action:", action);
  }
})


// Btn.addEventListener("click", () => {
//   if(!startBtn) return;
//   console.log("Start button clicked");
//   window.location.href = 'settingPage.html';
// });

document.addEventListener("DOMContentLoaded", () => {
  body.innerHTML = startPage();
});