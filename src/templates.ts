// @ts-ignore
import "../main.scss";
import { Theme, Player, BoardSize } from "./main";

export function startPageTemplate() {
  return `<main class="start-page">
        <section class="start-page__content">
            <img class="start-page__watermark" src="/assets/icons/stadia_controller.png" alt="">

            <div class="start-page__text">
                <p class="start-page__kicker">It’s play time.</p>
                <h1 class="start-page__headline">Ready to play?</h1>
            </div>

            <button id="startBtn" class="btn start-page__btn" type="button" data-action="settingPage">
<!--                <img class="start-page__btn-icon" src="/assets/icons/stadia_controller_btn.png" alt="">-->
                <span class="start-page__btn-label">Play</span>
<!--                <span class="start-page__btn-arrow"></span>-->
            </button>
        </section>
    </main>`;
}

export function settingPageTemplate() {
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
) {
  return `<main class="game-page game-page--${theme}">
      <section class="game-page__content">
        <header class="game-page__header">
          <div class="game-page__player">
            <p>Blue <span>0</span></p>
            <p>Orange <span>0</span></p>
          </div>
          <div class="game-page__current-player">
            Current player:
            <span
              ><img src="assets/icons/label_${theme}_${player}_player.png" alt="Player ${player}"
            /></span>
          </div>
          <button
            class="btn game-page__btn"
            popovertarget="exitGameDialog"
            popovertargetaction="toggle"
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
            <button
              class="game-page__dialog-btn"
              popovertarget="exitGameDialog"
              popovertargetaction="hide"
            >
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

export function getCardTemplate(index: number) {
  return `<div class="game-page__card--initial">
            <div class="game-page__card" data-index="${index}">
              <div class="game-page__card--front"></div>
              <div class="game-page__card--back"></div>
            </div>
          </div>`;
}
