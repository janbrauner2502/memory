# Memory

A memory card game for two players, built with TypeScript and SCSS. It is made for desktop screens.

## How to play

1. Choose a theme, the starting player and a board size.
2. Flip two cards per turn.
3. A matching pair earns a point and the player goes again. If the cards do not match, they turn back and the other player takes over.
4. When all pairs are found, the player with more points wins. Equal points end in a draw.

## Options

- **Themes:** Code vibes, Gaming, DA projects, Food
- **Players:** Blue, Orange
- **Board sizes:** 16, 24 or 36 cards

## Getting started

You need Node 24. Older versions such as Node 18 do not work with the installed Sass version.

```bash
npm install
npm run dev
```

## Project structure

```text
memory/
├── public/assets/
│   ├── card-picture/    card motives for each theme
│   ├── confetti/        confetti for the winner page
│   ├── font/            self-hosted fonts
│   ├── icons/           icons and labels
│   └── img/             one image per theme
├── scss/
│   ├── abstracts/       variables and mixins
│   ├── base/            fonts and reset
│   ├── components/      button and confetti
│   ├── pages/           start, setting, game and endgame page
│   └── themes/          vibe, gaming, project and food
├── src/
│   ├── main.ts          game logic
│   └── templates.ts     HTML templates for all pages
├── index.html
└── main.scss            collects all styles
```
