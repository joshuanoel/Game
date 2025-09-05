import { ClientGame } from './game';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const client = new ClientGame(canvas);

let lastTime = performance.now();
const tick = function (now: number) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  client.tick(dt);
  requestAnimationFrame(tick);
};
tick(lastTime);
