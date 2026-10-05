// @ts-ignore
import "../main.scss";
import { startPageTemplate, settingPageTemplate } from "./templates";

let body = document.querySelector("body") as HTMLElement;
let gameSetting: {
  theme:Theme,
  player:Player,
  boardSize:BoardSize
} = {
  theme: "vibe",
  player: "blue",
  boardSize: "16"
};
type BtnType = "settingPage" | "startGame" | "exitGame";
type Theme = "vibe" | "gaming" | "da-project" | "food";
type Player = "blue" | "orange";
type BoardSize = "16" | "24" | "36";


function changePage(event:MouseEvent):void {
  const button= (event.target as HTMLElement).closest('.btn') as HTMLElement;
  if(!button) return;

  const action = button.dataset.action as BtnType | undefined;
  if (!action) return;

  switch (action) {
    case "settingPage":
      body.innerHTML = settingPageTemplate();
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
}

function prepareGame(event:MouseEvent):void {
  const input= (event.target as HTMLElement).closest('input') as HTMLElement;
  if(!input) return;
  let themeInput = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
  let playerInput = document.querySelector<HTMLInputElement>('input[name="player"]:checked');
  let boardSizeInput = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked');

  if(themeInput) {
    gameSetting.theme = themeInput.value as Theme;
    setGameSetting(1, 1, themeInput.nextElementSibling?.textContent ?? "");
  }

  if(playerInput) {
    gameSetting.player = playerInput.value as Player;
    setGameSetting(2, 2, `${playerInput.nextElementSibling?.textContent ?? ""} Player`);
  }

  if(boardSizeInput) {
    gameSetting.boardSize = boardSizeInput.value as BoardSize;
    setGameSetting(3, 2, `Board size ${boardSizeInput.nextElementSibling?.textContent ?? ""}`);
  }

  if(themeInput && playerInput && boardSizeInput) {
    const startBtn = document.querySelector(".setting-page__btn") as HTMLElement;
    if (!startBtn) return;
    startBtn.removeAttribute('disabled');
  }
}

function setGameSetting(indexP:number, indexDiv:number, labelName:string):void {
    const gameDetails = document.querySelector(`.setting-page__game-details > p:nth-of-type(${indexP})`) as HTMLElement;
    const separator = document.querySelector(`.setting-page__game-details > div:nth-of-type(${indexDiv})`) as HTMLElement;
    if(gameDetails && separator) {
      gameDetails.textContent =  labelName;
      separator.classList.add("setting-page__seperator--checked");
    }
}


document.addEventListener("click", (event:MouseEvent) => {
  changePage(event)
  prepareGame(event)
})

// document.addEventListener("DOMContentLoaded", () => {
//   body.innerHTML = startPageTemplate();
// });