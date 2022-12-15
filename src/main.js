import { Graphics } from './graphics.js';
import { InputUI } from './inputUI.js';
import { TileRenderer } from './tileRenderer.js';
function onWindowResize() {
    const width = Math.trunc(window.visualViewport?.width || window.innerWidth);
    const height = Math.trunc(window.visualViewport?.height || window.innerHeight);
    Graphics.canvas.width = width;
    Graphics.canvas.height = height;
    Graphics.ctx.imageSmoothingEnabled = false;
}
function init() {
    InputUI.init();
    Graphics.init();
    onWindowResize();
    requestAnimationFrame(animationFrame);
}
function animationFrame(time) {
    requestAnimationFrame(animationFrame);
    if (!TileRenderer.tileTexture.IsLoaded)
        return;
    Graphics.clear();
    TileRenderer.drawTiles(time);
}
init();
window.addEventListener('resize', onWindowResize);
