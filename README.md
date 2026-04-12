## Fifteen Puzzle

This is a toy project implementing the 15-puzzle using TypeScript, React, SVG, and CSS animations. You can try it at my [GitHub Pages](https://nnerik.github.io/fifteen-puzzle/ "Fifteen Puzzle").

### Development

This project uses [mise](https://mise.jdx.dev/) for tool versions and pnpm for dependencies.

```sh
mise install
pnpm install
pnpm dev
```

Useful scripts:

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
pnpm check
pnpm build
pnpm preview
```

### Deployment

The app is published to GitHub Pages from the `gh-pages` branch. The source of truth is `master`.

To publish the current version:

```sh
mise install
pnpm install
pnpm check
pnpm run deploy
```

`pnpm run deploy` runs `pnpm build` automatically through the `predeploy` script, then publishes the generated `dist` directory to `gh-pages` using the `gh-pages` package. The `dist` directory is ignored on `master` and should not be committed there.
