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
let playerScore: PlayerScore;
let finalScore: number;

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
type PlayerScore = { blue: number; orange: number };

/**
 * Finds the clicked button and passes it on to the page change logic.
 * Clicks outside of a `.btn` element are ignored.
 *
 * @param event - The click event from the document.
 */
function changePage(event: MouseEvent): void {
  const button = (event.target as HTMLElement).closest(".btn") as HTMLElement;
  if (!button) return;

  actionButtonCase(button);
}

/**
 * Runs the action stored in the button's `data-action` attribute.
 * Shows the matching page, and `startGame` starts a new game.
 * Buttons without `data-action` do nothing.
 *
 * @param button - The clicked button.
 */
function actionButtonCase(button: HTMLElement): void {
  const action = button.dataset.action as BtnType | undefined;
  if (!action) return;
  switch (action) {
    case "settingPage":
      body.innerHTML = settingPageTemplate();
      break;
    case "startGame":
      buildGameBoard();
      break;
    case "exitGame":
      body.innerHTML = settingPageTemplate();
      break;
    default:
      body.innerHTML = startPageTemplate();
  }
}

/**
 * Resets the score, shows the game page with the saved settings and sets the starting player.
 * Blocks clicks and scrolling on `body` until `initCardBoard` has finished showing the cards.
 */
function buildGameBoard() {
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
}

/**
 * Reads the checked inputs on the settings page and saves them after a click on an input.
 * Then checks whether the start button can be enabled.
 *
 * @param event - The click event from the document.
 */
function prepareGame(event: MouseEvent): void {
  const input = (event.target as HTMLElement).closest("input") as HTMLElement;
  if (!input) return;
  let themeInputElement = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
  let playerInputElement = document.querySelector<HTMLInputElement>('input[name="player"]:checked');
  let boardSizeInputElement = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked');
  inputTheme(themeInputElement);
  inputPlayer(playerInputElement);
  inputBoardSize(boardSizeInputElement);

  setStartGameButtonAbleAndShuffleCards(
    themeInputElement,
    playerInputElement,
    boardSizeInputElement,
  );
}

/**
 * Saves the selected theme and shows its name in the game details.
 *
 * @param themeInput - The checked theme input, or `null` if none is checked.
 */
function inputTheme(themeInput: HTMLInputElement | null): void {
  if (themeInput) {
    gameSetting.theme = themeInput.value as Theme;
    setGameSetting(1, 1, themeInput.nextElementSibling?.textContent ?? "");
  }
}

/**
 * Saves the selected starting player and shows the choice in the game details.
 *
 * @param playerInput - The checked player input, or `null` if none is checked.
 */
function inputPlayer(playerInput: HTMLInputElement | null): void {
  if (playerInput) {
    gameSetting.player = playerInput.value as Player;
    setGameSetting(
      2,
      2,
      `${playerInput.nextElementSibling?.textContent ?? ""} Player`,
    );
  }
}

/**
 * Saves the selected board size and shows it in the game details.
 *
 * @param boardSizeInput - The checked board size input, or `null` if none is checked.
 */
function inputBoardSize(boardSizeInput: HTMLInputElement | null): void {
  if (boardSizeInput) {
    gameSetting.boardSize = boardSizeInput.value as BoardSize;
    setGameSetting(
      3,
      2,
      `Board size ${boardSizeInput.nextElementSibling?.textContent ?? ""}`,
    );
  }
}

/**
 * Enables the start button once theme, player and board size are all selected.
 * Also creates the shuffled card motives for the selected board size.
 *
 * @param themeInput - The checked theme input, or `null` if none is checked.
 * @param playerInput - The checked player input, or `null` if none is checked.
 * @param boardSizeInput - The checked board size input, or `null` if none is checked.
 */
function setStartGameButtonAbleAndShuffleCards(themeInput: HTMLInputElement | null, playerInput: HTMLInputElement | null, boardSizeInput: HTMLInputElement | null): void {
  if (themeInput && playerInput && boardSizeInput) {
    const startBtn = document.querySelector(
      ".setting-page__btn",
    ) as HTMLElement;
    if (!startBtn) return;
    setShuffleCardMotiveArray(gameSetting.boardSize);
    startBtn.removeAttribute("disabled");
  }
}

/**
 * Creates all cards on the board.
 * Removes the inline styles from `body` once the cards have finished appearing,
 * which makes the page clickable again.
 *
 * @param boardSize - The number of cards to create.
 */
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

/**
 * Picks random, different motives from 1 to 18, doubles them into pairs and
 * shuffles the result into `cardMotivesArray`.
 *
 * @param boardSize - The selected board size, which sets the number of pairs.
 */
function setShuffleCardMotiveArray(boardSize: BoardSize): void {
  cardMotivesArray = [];

  while (cardMotivesArray.length < Number(boardSize) / 2) {
    const number = Math.floor(Math.random() * 18) + 1;
    if (cardMotivesArray.indexOf(number) === -1) cardMotivesArray.push(number);
  }

  cardMotivesArray = cardMotivesArray.concat(cardMotivesArray);
  cardMotivesArray.sort(() => Math.random() - 0.5);
}

/**
 * Writes a selected setting into the game details and marks a separator line as checked.
 *
 * @param indexP - The position of the paragraph among the `p` elements, starting at 1.
 * @param indexDiv - The position of the separator among the `div` elements, starting at 1.
 * @param labelName - The text to show in the paragraph.
 */
function setGameSetting(indexP: number, indexDiv: number, labelName: string): void {
  const gameDetails = document.querySelector(`.setting-page__game-details > p:nth-of-type(${indexP})`) as HTMLElement;
  const separator = document.querySelector(`.setting-page__game-details > div:nth-of-type(${indexDiv})`) as HTMLElement;
  if (gameDetails && separator) {
    gameDetails.textContent = labelName;
    separator.classList.add("setting-page__seperator--checked");
  }
}

/**
 * Turns over the clicked card, shows its motive and adds it to the comparison.
 * Clicks outside of a card or on an already flipped card are ignored.
 *
 * @param event - The click event from the document.
 */
function flipCard(event: MouseEvent): void {
  const card = (event.target as HTMLDivElement).closest("div.game-page__card") as HTMLDivElement;
  if (!card || card.classList.contains("is-flipped")) return;

  let cardIndex: number = Number(card.dataset.index);
  setMotiveOnCard(cardIndex);
  compareCards(cardMotivesArray[cardIndex]);
  card.classList.add("is-flipped");
}

/**
 * Finds the game page elements, stores the flipped card's motive number
 * and starts the check for a pair.
 *
 * @param index - The motive number of the flipped card, not its position on the board.
 */
function compareCards(index: number): void {
  let blueScore = document.querySelector(`.game-page__player > p:nth-child(1) > span`) as HTMLElement;
  let orangeScore = document.querySelector(`.game-page__player > p:nth-child(2) > span`) as HTMLElement;
  const currentPlayerDiv = document.querySelector(".game-page__current-player") as HTMLElement;
  const currentPlayerSpan = currentPlayerDiv?.firstElementChild;
  const sectionElement: HTMLElement = document.querySelector("section:nth-child(2)") as HTMLElement;

  if (!sectionElement || !currentPlayerSpan) return;
  compareCardsArray.push(index);
  checkMatchCards(blueScore, orangeScore, sectionElement, currentPlayerSpan);
}

/**
 * Compares the two stored motive numbers once two cards are flipped.
 * A pair adds a point, otherwise the cards are turned back. Then the stored numbers are cleared.
 *
 * @param blueScore - The element that shows the blue player's score.
 * @param orangeScore - The element that shows the orange player's score.
 * @param sectionElement - The board section.
 * @param currentPlayerSpan - The element that shows the current player.
 */
function checkMatchCards(blueScore: HTMLElement, orangeScore: HTMLElement, sectionElement: HTMLElement, currentPlayerSpan: Element): void {
  if (compareCardsArray.length == 2) {
    if (compareCardsArray[0] === compareCardsArray[1]) {
      countPlayerScore(blueScore, orangeScore);
    } else {
      flipCardsBack(sectionElement, currentPlayerSpan);
    }
    compareCardsArray = [];
  }
}

/**
 * Marks the found pair, gives the current player one point, updates
 * the score display and checks whether the game is over.
 *
 * @param blueScore - The element that shows the blue player's score.
 * @param orangeScore - The element that shows the orange player's score.
 */
function countPlayerScore(blueScore: HTMLElement, orangeScore: HTMLElement): void {
  matchedCards(compareCardsArray[0], compareCardsArray[1]);
  playerScore[currentPlayer] += 1;
  blueScore.textContent = `${playerScore.blue}`;
  orangeScore.textContent = `${playerScore.orange}`;
  checkGameEnd();
}

/**
 * Blocks clicks on the board and turns unmatched cards back after 1.5 seconds.
 * When the turn animation ends, it removes the motives and allows clicks again.
 * The current player changes immediately.
 *
 * @param sectionElement - The board section.
 * @param currentPlayerSpan - The element that shows the current player.
 */
function flipCardsBack(sectionElement: HTMLElement, currentPlayerSpan: Element): void {
  sectionElement.style.pointerEvents = "none";
  setTimeout((): void => {
    let flippedCards = document.querySelectorAll("div:not(.match) >.is-flipped");
    flippedCards.forEach((card) => {
      card.classList.remove("is-flipped");
      card.addEventListener("transitionend", (): void => {
          card.lastElementChild!.innerHTML = "";
          sectionElement.removeAttribute("style");
          }, { once: true },);
    });
  }, 1500);
  changeCurrentPlayer(currentPlayerSpan);
}

/**
 * Switches to the other player and updates the current player display.
 *
 * @param currentPlayerSpan - The element that shows the current player.
 */
function changeCurrentPlayer(currentPlayerSpan: Element): void {
  if (currentPlayer === "blue") {
    currentPlayer = "orange";
  } else {
    currentPlayer = "blue";
  }
  currentPlayerSpan.innerHTML = getTemplateCurrentPlayer(
    gameSetting.theme,
    currentPlayer,
  );
}

/**
 * Checks whether all pairs have been found.
 * If so, shows the end game page after 2 seconds and the result 2 seconds later.
 */
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

/**
 * Fades out the game over display, removes it when its animation ends and adds the result.
 */
function showEndGameResult(): void {
  const endGameContent = document.querySelector(".endgame-page__content");
  const endGameGameOver = document.querySelector(".endgame-page__gameover");
  if (!endGameContent || !endGameGameOver) return;

  endGameGameOver.classList.add("endgame-page__gameover--hidden");
  endGameGameOver.addEventListener("animationend", (): void => {
    endGameGameOver.remove();
  });
  endGameContent.insertAdjacentHTML("beforeend", getEndGameResultTemplate());
}

/**
 * Selects the result template based on the final score.
 *
 * @returns The HTML for the draw, or for the blue or orange winner.
 */
function getEndGameResultTemplate(): string {
  if (playerScore.blue === playerScore.orange) {
    return getEndGameContentDrawTemplate(gameSetting.theme);
  }
  if (playerScore.blue > playerScore.orange) {
    return getEndGameContentWinnerTemplate(gameSetting.theme, "blue");
  }
  return getEndGameContentWinnerTemplate(gameSetting.theme, "orange");
}

/**
 * Finds both cards of a pair by their motive number and adds the `match` class to their parents.
 *
 * @param card1 - The motive number of the first card.
 * @param card2 - The motive number of the second card.
 */
function matchedCards(card1: number, card2: number): void {
  let firstCardIndex = cardMotivesArray.indexOf(card1);
  let secondCardIndex = cardMotivesArray.indexOf(card2, firstCardIndex + 1);
  let firstCard = document.querySelector(`div.game-page__card[data-index="${firstCardIndex}"]`) as HTMLElement;
  let secondCard = document.querySelector(`div.game-page__card[data-index="${secondCardIndex}"]`) as HTMLElement;
  if (firstCard && secondCard) {
    firstCard.parentElement?.classList.add("match");
    secondCard.parentElement?.classList.add("match");
  }
}

/**
 * Inserts the motive image for the current theme into the back side of a card.
 *
 * @param index - The position of the card on the board, starting at 0.
 */
function setMotiveOnCard(index: number): void {
  let setMotive = document.querySelector(`div.game-page__card[data-index="${index}"]`) as HTMLElement;
  if (!setMotive) return;
  let cardBackSide = setMotive.lastElementChild as HTMLElement;
  cardBackSide.innerHTML = `<img src="./assets/card-picture/${gameSetting.theme}/card-${cardMotivesArray[index]}.png" alt="Card motive ${cardMotivesArray[index]}">`;
}

document.addEventListener("click", (event: MouseEvent): void => {
  changePage(event);
  prepareGame(event);
  flipCard(event);
});

document.addEventListener("DOMContentLoaded", (): void => {
  body.innerHTML = startPageTemplate();
});
