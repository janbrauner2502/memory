// @ts-ignore
import "../main.scss";
import { startPageTemplate, settingPageTemplate } from "./templates";

let body = document.querySelector("body") as HTMLElement;
let gameSetting: {
  theme:string,
  player:string,
  boardSize:string
} = {
  theme: "",
  player: "",
  boardSize: ""
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
  let selectedTheme = themeInput?.value as Theme | undefined;
  let selectedPlayer = document.querySelector<HTMLInputElement>('input[name="player"]:checked')?.value as Player | undefined;
  let selectedBoardSize = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked')?.value as BoardSize | undefined;

  if(selectedTheme) {
    gameSetting.theme = selectedTheme;
    const gameDetails = document.querySelector(".setting-page__game-details > p:nth-of-type(1)") as HTMLElement;
    const separator = document.querySelector(".setting-page__game-details > .setting-page__seperator:nth-of-type(1)") as HTMLElement;
    if(gameDetails && separator) {
      gameDetails.textContent = themeInput?.nextElementSibling?.textContent || "";
      separator.classList.add("setting-page__seperator--checked");
    }
  }

  if(selectedPlayer) {
    gameSetting.player = selectedPlayer;
    const gameDetails = document.querySelector(".setting-page__game-details > p:nth-of-type(2)") as HTMLElement;
    const separator = document.querySelector(".setting-page__game-details > .setting-page__seperator:nth-of-type(2)")  as HTMLElement;
    if(gameDetails && separator) {
      gameDetails.textContent = `${gameSetting.player.charAt(0).toUpperCase() + gameSetting.player.slice(1)} player`;
      separator.classList.add("setting-page__seperator--checked");
    }
  }

  if(selectedBoardSize) {
    gameSetting.boardSize = selectedBoardSize;
    const gameDetails = document.querySelector(".setting-page__game-details > p:nth-of-type(3)") as HTMLElement;
    const separator = document.querySelector(".setting-page__game-details > .setting-page__seperator:nth-of-type(2)")  as HTMLElement;
    if(gameDetails && separator) {
      gameDetails.textContent = `${gameSetting.boardSize} cards`;
      separator.classList.add("setting-page__seperator--checked");
    }
  }

  if(selectedTheme && selectedPlayer && selectedBoardSize) {
    const startBtn = document.querySelector(".setting-page__btn") as HTMLElement;
    if (!startBtn) return;
    startBtn.removeAttribute('disabled');
  }

}


document.addEventListener("click", (event:MouseEvent) => {
  changePage(event)
  prepareGame(event)
})

document.addEventListener("DOMContentLoaded", () => {
  body.innerHTML = startPageTemplate();
});