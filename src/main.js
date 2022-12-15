import { Graphics } from './graphics.js';
import { Tile } from './tile.js';
function updateSize() {
    const width = Math.trunc(window.visualViewport?.width || window.innerWidth);
    const height = Math.trunc(window.visualViewport?.height || window.innerHeight);
    Graphics.canvas.width = width;
    Graphics.canvas.height = height;
    Graphics.ctx.imageSmoothingEnabled = false;
}
function init() {
    updateSize();
    requestAnimationFrame(animationFrame);
}
function animationFrame(time) {
    if (!Tile.tileTexture.IsLoaded)
        return;
    Graphics.clear();
    Tile.drawTiles(20, 20, time);
    requestAnimationFrame(animationFrame);
}
init();
window.addEventListener('resize', updateSize);
