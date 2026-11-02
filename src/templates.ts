// @ts-ignore
import "../main.scss";
import { Theme, Player, BoardSize } from "./main";

export function startPageTemplate(): string {
  return `<main class="start-page">
        <section class="start-page__content">
            <img class="start-page__watermark" src="/assets/icons/stadia_controller.png" alt="">
            <div class="start-page__text">
                <p class="start-page__kicker">It’s play time.</p>
                <h1 class="start-page__headline">Ready to play?</h1>
            </div>
            <button id="startBtn" class="btn start-page__btn" type="button" data-action="settingPage">
                <span class="start-page__btn-label">Play</span>
            </button>
        </section>
    </main>`;
}

export function settingPageTemplate(): string {
  return `<main class="setting-page">
        <section class="setting-page__content">
            <div class="setting-page__headline">
                <h1 class="setting-page__title">Settings</h1>
            </div>
            <div class="setting-page__game-settings">
                <div class="setting-page__group">
                    <h2 class="setting-page__group-title setting-page__group-title--themes">Game theme</h2>
                    <label class="setting-page__group-label"><input type="radio" name="theme" value="vibe"/><p>Code vibes theme</p></label>
                    <label class="setting-page__group-label"><input type="radio" name="theme" value="gaming"/><p>Gaming theme</p></label>
                    <label class="setting-page__group-label"><input type="radio" name="theme" value="da-project"/><p>DA projects theme</p></label>
                    <label class="setting-page__group-label"><input type="radio" name="theme" value="food"/><p>Food theme</p></label>
                </div>
                <div class="setting-page__group">
                    <h2 class="setting-page__group-title setting-page__group-title--player">Choose player</h2>
                    <label class="setting-page__group-label"><input type="radio" name="player" value="blue"/><p>Blue</p></label>
                    <label class="setting-page__group-label"><input type="radio" name="player" value="orange"/><p>Orange</p></label>
                </div>
                <div class="setting-page__group">
                    <h2 class="setting-page__group-title setting-page__group-title--board-size">Board size</h2>
                    <label class="setting-page__group-label"><input type="radio" name="board-size" value="16"/><p>16 cards</p></label>
                    <label class="setting-page__group-label"><input type="radio" name="board-size" value="24"/><p>24 cards</p></label>
                    <label class="setting-page__group-label"><input type="radio" name="board-size" value="36"/><p>36 cards</p></label>
                </div>
                <aside>
                    <div class="setting-page__board-preview"></div>
                    <section class="setting-page__game-details">
                        <p>Game theme</p>
                        <div class="setting-page__seperator"></div>
                        <p>Player</p>
                        <div class="setting-page__seperator"></div>
                        <p>Board size</p>
                        <button class="btn setting-page__btn" type="button" data-action="startGame" disabled>Start</button>
                    </section>

                </aside>
            </div>
        </section>
    </main>`;
}

export function gamePageTemplate(
  theme: Theme,
  player: Player,
  boardSize: BoardSize,
  blueScore: number,
  orangeScore: number,
): string {
  return `<main class="game-page game-page--${theme}">
      <section class="game-page__content">
        <header class="game-page__header">
          <div class="game-page__player">
            <p>${theme === "vibe" ? "Blue" : ""} <span>${blueScore}</span></p>
            <p>${theme === "vibe" ? "Orange" : ""} <span>${orangeScore}</span></p>
          </div>
          <div class="game-page__current-player">
            Current player:
            <span
              ><img src="assets/icons/label_${theme}_${player}_${theme === "vibe" ? "" : "current-"}player.png" alt="Player ${player}"
            /></span>
          </div>
          <button
            class="btn game-page__btn"
            popovertarget="exitGameDialog"
            popovertargetaction="show"
          >
            Exit game
          </button>
        </header>
        <section class="game-page__board game-page__board--${boardSize}">
        </section>
        <dialog popover class="game-page__dialog" id="exitGameDialog">
          <p class="game-page__dialog-text">
            Are you sure you want to quit the game?
          </p>
          <div class="game-page__dialog-btn-wrapper">
            <button class="game-page__dialog-btn" popovertarget="exitGameDialog" popovertargetaction="hide" type="button">
              Back to game
            </button>
            <button class="btn game-page__dialog-btn" type="button" data-action="exitGame">
              Exit game
            </button>
          </div>
        </dialog>
      </section>
    </main>`;
}

export function getCardTemplate(index: number): string {
  return `<div class="game-page__card--initial">
            <div class="game-page__card" data-index="${index}">
              <div class="game-page__card--front"></div>
              <div class="game-page__card--back"></div>
            </div>
          </div>`;
}

export function getTemplateCurrentPlayer(theme: Theme, player: Player) {
  return `<img src="assets/icons/label_${theme}_${player}_${theme === "vibe" ? "" : "current-"}player.png" alt="Player ${player}">`;
}

export function getEndGameTemplate(
  theme: Theme,
  blueScore: number,
  orangeScore: number,
): string {
  return `
<main class="endgame-page endgame-page--${theme}">
    <section class="endgame-page__content">
        <div class="endgame-page__gameover">
            <div class="endgame-page__header">
                <p><span>${theme === "vibe" ? "Game over" : "GAME OVER"}</span></p>
            </div>
            <div class="endgame-page__finalscore">
                <p>Final score</p>
                <div class="endgame-page__playerscore">
                    <p>${theme === "vibe" ? "Blue " : ""}<span>${blueScore}</span></p>
                    <p>${theme === "vibe" ? "Orange " : ""}<span>${orangeScore}</span></p>
                </div>
            </div>
        </div>
    </section>
</main>`;
}

export function getEndGameContentWinnerTemplate(
  theme: Theme,
  player: Player,
): string {
  return `
        <div class="endgame-page__result">
            <header class="confetti confetti--${theme === "vibe" ? "vibe" : "done"}">${getWinnerHeaderTemplate()}</header>
            <div class="endgame-page__winner">
                <div class="endgame-page__winner-header">
                    <p>The winner is</p>
                    <p class="endgame-page__player" data-color="${player}">${theme === "vibe" ? `${player.toUpperCase()} PLAYER` : `${player.charAt(0).toUpperCase() + player.slice(1)} Player`}</p>
                </div>
                <img src="./assets/card-picture/${theme}/winner${theme === "gaming" ? "" : `-${player}`}.png" alt="Winner icon">
                <button class="btn endgame-page__btn" type="button" data-action="default">${theme === "vibe" ? "Back to start" : "Home"}</button>
            </div>
        </div>`;
}

export function getEndGameContentDrawTemplate(theme: Theme): string {
  return `
        <div class="endgame-page__result">
            <div class="endgame-page__draw">
                <div class="endgame-page__header">
                    <p>It's a</p>
                    <p><span>${theme === "vibe" ? "Draw" : ""}</span></p>
                </div>
                <img src="./assets/card-picture/${theme}/winner-draw.png" alt="">
                <button class="btn endgame-page__btn" type="button" data-action="default">${theme === "vibe" ? "Back to start" : "Home"}</button>
            </div>
        </div>`;
}

export function getWinnerHeaderTemplate(): string {
  return `<div class="confetti__piece confetti__piece--1">
              <div class="confetti__shape confetti__shape--1"></div>
          </div>
          <div class="confetti__piece confetti__piece--2">
              <div class="confetti__shape confetti__shape--2"></div>
          </div>
          <div class="confetti__piece confetti__piece--3">
              <div class="confetti__shape confetti__shape--3"></div>
          </div>
          <div class="confetti__piece confetti__piece--4">
              <div class="confetti__shape confetti__shape--4"></div>
          </div>
          <div class="confetti__piece confetti__piece--5">
              <div class="confetti__shape confetti__shape--5"></div>
          </div>
          <div class="confetti__piece confetti__piece--6">
              <div class="confetti__shape confetti__shape--6"></div>
          </div>
          <div class="confetti__piece confetti__piece--7">
              <div class="confetti__shape confetti__shape--7"></div>
          </div>
          <div class="confetti__piece confetti__piece--8">
              <div class="confetti__shape confetti__shape--8"></div>
          </div>
          <div class="confetti__piece confetti__piece--9">
              <div class="confetti__shape confetti__shape--9"></div>
          </div>`;
}
