# Lantern Barge

Webcam boxing in the browser. Play with your fists in front of a camera, or with the keyboard
(F/J straights, D/K hooks, Space to guard). Hand tracking runs locally; video never leaves the device.

## Run locally

```sh
npm run serve          # http://127.0.0.1:8000 (serves the source tree)
```

No install needed to play: the game is static ES modules and loads three.js and MediaPipe from a CDN.

## Build for deployment

```sh
npm install
npm run build          # writes dist/: minified app.js, worker, index.html, styles.css
```

`dist/` is the deployable artifact; it is what `projects.mohitranka.com/boxing/` serves.
The source stays in this private repo.

## Test

```sh
npm install
npx playwright install chromium
npm test               # boot, keyboard match, training HUD
```

## Layout

- `index.html`, `styles.css` — shell and HUD styling
- `src/main.js` — boot and loop
- `src/game/` — rules, opponent AI, phases, training
- `src/input/` — keyboard, camera, hand tracking, calibration, coach
- `src/view/` — renderer, HUD, ring, opponent model, audio
- `src/shared/` — constants, clock, features, career
- `scripts/build.mjs` — esbuild bundle for deployment
- `tools/serve.py` — local static server
