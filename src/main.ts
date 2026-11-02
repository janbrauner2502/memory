import "../main.scss";
import {
  startPageTemplate,
  settingPageTemplate,
  gamePageTemplate,
  getCardTemplate,
  getTemplateCurrentPlayer,
  getEndGameTemplate,
  getEndGameContentWinnerTemplate,
  getEndGameContentDrawTemplate,
} from "./templates";

let body: HTMLElement = document.body;

let currentPlayer: Player;
let playerScore: { blue: number; orange: number };
let finalScore: number;
let failedAttempts: number;

let gameSetting: { theme: Theme; player: Player; boardSize: BoardSize } = {
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
      failedAttempts = 0;
      playerScore = { blue: 0, orange: 0 };
      body.style.pointerEvents = "none";
      body.style.overflow = "hidden";
      body.innerHTML = gamePageTemplate(
        gameSetting.theme,
        gameSetting.player,
        gameSetting.boardSize,
        playerScore.blue,
        playerScore.orange,
      );
      currentPlayer = gameSetting.player;
      initCardBoard(Number(gameSetting.boardSize));
      break;
    case "exitGame":
      body.innerHTML = settingPageTemplate();
      break;
    default:
      body.innerHTML = startPageTemplate();
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
      body.removeAttribute("style");
    },
    boardSize * 100 + 500,
  );
}

function setAndShuffleCardMotiveArray(boardSize: BoardSize): void {
  cardMotivesArray = [];

  while (cardMotivesArray.length < Number(boardSize) / 2) {
    const number = Math.floor(Math.random() * 18) + 1;
    if (cardMotivesArray.indexOf(number) === -1) cardMotivesArray.push(number);
  }

  cardMotivesArray = cardMotivesArray.concat(cardMotivesArray);
  cardMotivesArray.sort(() => Math.random() - 0.5);
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
  let blueScore = document.querySelector(
    `.game-page__player > p:nth-child(1) > span`,
  ) as HTMLElement;
  let orangeScore = document.querySelector(
    `.game-page__player > p:nth-child(2) > span`,
  ) as HTMLElement;
  const currentPlayerDiv = document.querySelector(
    ".game-page__current-player",
  ) as HTMLElement;
  const currentPlayerSpan = currentPlayerDiv?.firstElementChild;
  const sectionElement = document.querySelector(
    "section:nth-child(2)",
  ) as HTMLElement;
  if (!sectionElement || !currentPlayerSpan) return;
  compareCardsArray.push(index);

  if (compareCardsArray.length == 2) {
    if (compareCardsArray[0] === compareCardsArray[1]) {
      matchedCards(compareCardsArray[0], compareCardsArray[1]);
      playerScore[currentPlayer] += 1;
      blueScore.textContent = `${playerScore.blue}`;
      orangeScore.textContent = `${playerScore.orange}`;
      checkGameEnd();
    } else {
      failedAttempts += 1;
      sectionElement.style.pointerEvents = "none";
      setTimeout((): void => {
        let flippedCards = document.querySelectorAll(
          "div:not(.match) >.is-flipped",
        );
        sectionElement.removeAttribute("style");
        flippedCards.forEach((card) => {
          card.classList.remove("is-flipped");
        });
      }, 2000);
      if (failedAttempts === 3) {
        if (currentPlayer === "blue") {
          currentPlayer = "orange";
        } else {
          currentPlayer = "blue";
        }
        failedAttempts = 0;
        currentPlayerSpan.innerHTML = getTemplateCurrentPlayer(
          gameSetting.theme,
          currentPlayer,
        );
      }
    }
    compareCardsArray = [];
  }
  return;
}

function checkGameEnd(): void {
  finalScore = playerScore.blue + playerScore.orange;
  if (finalScore === Number(gameSetting.boardSize) / 2) {
    setTimeout((): void => {
      body.innerHTML = getEndGameTemplate(
        gameSetting.theme,
        playerScore.blue,
        playerScore.orange,
      );
      setTimeout((): void => {
        showEndGameResult();
      }, 2000);
    }, 2000);
  }
}

function showEndGameResult(): void {
  const endGameContent = document.querySelector(".endgame-page__content");
  const endGameGameover = document.querySelector(".endgame-page__gameover");
  if (!endGameContent || !endGameGameover) return;

  endGameGameover.classList.add("endgame-page__gameover--hidden");
  endGameGameover.addEventListener("animationend", (): void => {
    endGameGameover.remove();
  });
  endGameContent.insertAdjacentHTML("beforeend", getEndGameResultTemplate());
}

function getEndGameResultTemplate(): string {
  if (playerScore.blue === playerScore.orange) {
    return getEndGameContentDrawTemplate(gameSetting.theme);
  }
  if (playerScore.blue > playerScore.orange) {
    return getEndGameContentWinnerTemplate(gameSetting.theme, "blue");
  }
  return getEndGameContentWinnerTemplate(gameSetting.theme, "orange");
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
  // cardBackSide.innerHTML = `<img src="./assets/card-picture/${gameSetting.theme}/card-${cardMotivesArray[index]}.png" alt="Card motive ${cardMotivesArray[index]}">`;
  cardBackSide.style.backgroundImage = `url(../../assets/card-picture/${gameSetting.theme}/card-${cardMotivesArray[index]}.png)`;
}

document.addEventListener("click", (event: MouseEvent): void => {
  changePage(event);
  prepareGame(event);
  flipCard(event);
});

document.addEventListener("DOMContentLoaded", (): void => {
  body.innerHTML = startPageTemplate();
});
