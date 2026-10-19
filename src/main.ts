// @ts-ignore
import "../main.scss";
import {
  startPageTemplate,
  settingPageTemplate,
  gamePageTemplate,
  getCardTemplate,
} from "./templates";

let body = document.querySelector("body") as HTMLElement;
let gameSetting: {
  theme: Theme;
  player: Player;
  boardSize: BoardSize;
} = {
  theme: "vibe",
  player: "blue",
  boardSize: "16",
};

let cardMotivesArray: number[] = [];
let compareCardsArray: number[] = [];

type BtnType = "settingPage" | "startGame" | "exitGame";
export type Theme = "vibe" | "gaming" | "da-project" | "food";
export type Player = "blue" | "orange";
export type BoardSize = "16" | "24" | "36";

function changePage(event: MouseEvent): void {
  const button = (event.target as HTMLElement).closest(".btn") as HTMLElement;
  if (!button) return;

  const action = button.dataset.action as BtnType | undefined;
  if (!action) return;

  switch (action) {
    case "settingPage":
      body.innerHTML = settingPageTemplate();
      break;
    case "startGame":
      body.style.pointerEvents = "none";
      body.innerHTML = gamePageTemplate(
        gameSetting.theme,
        gameSetting.player,
        gameSetting.boardSize,
      );
      initCardBoard(Number(gameSetting.boardSize));
      break;
    case "exitGame":
      body.innerHTML = settingPageTemplate();
      break;
    default:
  }
}

function prepareGame(event: MouseEvent): void {
  const input = (event.target as HTMLElement).closest("input") as HTMLElement;
  if (!input) return;
  let themeInput = document.querySelector<HTMLInputElement>(
    'input[name="theme"]:checked',
  );
  let playerInput = document.querySelector<HTMLInputElement>(
    'input[name="player"]:checked',
  );
  let boardSizeInput = document.querySelector<HTMLInputElement>(
    'input[name="board-size"]:checked',
  );

  if (themeInput) {
    gameSetting.theme = themeInput.value as Theme;
    setGameSetting(1, 1, themeInput.nextElementSibling?.textContent ?? "");
  }

  if (playerInput) {
    gameSetting.player = playerInput.value as Player;
    setGameSetting(
      2,
      2,
      `${playerInput.nextElementSibling?.textContent ?? ""} Player`,
    );
  }

  if (boardSizeInput) {
    gameSetting.boardSize = boardSizeInput.value as BoardSize;
    setGameSetting(
      3,
      2,
      `Board size ${boardSizeInput.nextElementSibling?.textContent ?? ""}`,
    );
  }

  if (themeInput && playerInput && boardSizeInput) {
    const startBtn = document.querySelector(
      ".setting-page__btn",
    ) as HTMLElement;
    if (!startBtn) return;
    setAndShuffleCardMotiveArray(gameSetting.boardSize);
    startBtn.removeAttribute("disabled");
  }
}

function initCardBoard(boardSize: number): void {
  let refCard = document.querySelector(".game-page__board") as HTMLElement;
  if (!refCard) return;
  refCard.innerHTML = "";
  for (let i = 0; i < boardSize; i++) {
    refCard.innerHTML += getCardTemplate(i);
  }
  setTimeout(
    () => {
      body.style.pointerEvents = "unset";
    },
    boardSize * 100 + 500,
  );
}

function setAndShuffleCardMotiveArray(boardSize: BoardSize): void {
  cardMotivesArray = [];
  for (let i = 1; i <= Number(boardSize) / 2; i++) {
    cardMotivesArray.push(i);
  }
  cardMotivesArray = cardMotivesArray.concat(cardMotivesArray);
  cardMotivesArray.sort(() => Math.random() - 0.5);
  console.log("Card motives array set:", cardMotivesArray);
}

function setGameSetting(
  indexP: number,
  indexDiv: number,
  labelName: string,
): void {
  const gameDetails = document.querySelector(
    `.setting-page__game-details > p:nth-of-type(${indexP})`,
  ) as HTMLElement;
  const separator = document.querySelector(
    `.setting-page__game-details > div:nth-of-type(${indexDiv})`,
  ) as HTMLElement;
  if (gameDetails && separator) {
    gameDetails.textContent = labelName;
    separator.classList.add("setting-page__seperator--checked");
  }
}

function flipCard(event: MouseEvent): void {
  const card = (event.target as HTMLDivElement).closest(
    "div.game-page__card",
  ) as HTMLDivElement;
  if (!card || card.classList.contains("is-flipped")) return;

  let cardIndex: number = Number(card.dataset.index);
  setMotiveOnCard(cardIndex);
  compareCards(cardMotivesArray[cardIndex]);
  card.classList.add("is-flipped");
}

function compareCards(index: number): void {
  let sectionElement = document.querySelector(
    "section:nth-child(2)",
  ) as HTMLElement;
  if (!sectionElement) return;
  compareCardsArray.push(index);

  if (compareCardsArray.length == 2) {
    if (compareCardsArray[0] === compareCardsArray[1]) {
      matchedCards(compareCardsArray[0], compareCardsArray[1]);
    } else {
      sectionElement.style.pointerEvents = "none";
      setTimeout(() => {
        let flippedCards = document.querySelectorAll(
          "div:not(.match) >.is-flipped",
        );
        sectionElement.style.pointerEvents = "unset";
        flippedCards.forEach((card) => {
          card.classList.remove("is-flipped");
        });
      }, 2000);
    }
    compareCardsArray = [];
  }
  return;
}

function matchedCards(card1: number, card2: number): void {
  let firstCardIndex = cardMotivesArray.indexOf(card1);
  let secondCardIndex = cardMotivesArray.indexOf(card2, firstCardIndex + 1);
  let firstCard = document.querySelector(
    `div.game-page__card[data-index="${firstCardIndex}"]`,
  ) as HTMLElement;
  let secondCard = document.querySelector(
    `div.game-page__card[data-index="${secondCardIndex}"]`,
  ) as HTMLElement;
  if (firstCard && secondCard) {
    firstCard.parentElement?.classList.add("match");
    secondCard.parentElement?.classList.add("match");
  }
}

function setMotiveOnCard(index: number): void {
  let setMotive = document.querySelector(
    `div.game-page__card[data-index="${index}"]`,
  ) as HTMLElement;
  if (!setMotive) return;
  let cardBackSide = setMotive.lastElementChild as HTMLElement;
  cardBackSide.style.backgroundImage = `url(../../assets/card-picture/${gameSetting.theme}/card-${cardMotivesArray[index]}-${gameSetting.theme}.png)`;
}

document.addEventListener("click", (event: MouseEvent): void => {
  changePage(event);
  prepareGame(event);
  flipCard(event);
});

document.addEventListener("DOMContentLoaded", (): void => {
  body.innerHTML = startPageTemplate();
});
