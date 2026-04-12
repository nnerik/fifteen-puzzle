# Agent Notes

- Use `mise exec -- pnpm <script>` so Node and pnpm match `.mise.toml`.
- Run `mise exec -- pnpm check` before handing off changes.
- The board uses a tile-to-position representation: `state[tile]` is the current board position for that tile, and tile `0` is the blank.
- Keep `dist` generated only for deploys. Do not commit it on `master`.
- Deployment publishes the built `dist` directory to the `gh-pages` branch through `pnpm run deploy`.
