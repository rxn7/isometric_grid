import { Graphics } from './graphics.js';
export var TileRenderer;
(function (TileRenderer) {
    TileRenderer.scale = 3;
    TileRenderer.waveAnimationSpeed = 1;
    TileRenderer.waveAnimationAmplitude = 10;
    TileRenderer.columns = 10;
    TileRenderer.rows = 10;
    function setTexture(image) {
        TileRenderer.tileTextureSize = image.width;
        TileRenderer.halfTileTextureSize = TileRenderer.tileTextureSize * 0.5;
        TileRenderer.tileImage = image;
    }
    TileRenderer.setTexture = setTexture;
    function gridToScreen(x, y) {
        return {
            x: x * TileRenderer.halfTileTextureSize + y * -TileRenderer.halfTileTextureSize - TileRenderer.halfTileTextureSize,
            y: x * 0.5 * TileRenderer.halfTileTextureSize + y * 0.5 * TileRenderer.halfTileTextureSize,
        };
    }
    function drawTiles(time) {
        if (!TileRenderer.tileImage)
            return;
        const totalWidth = (TileRenderer.columns * TileRenderer.halfTileTextureSize + TileRenderer.rows * -TileRenderer.halfTileTextureSize - TileRenderer.halfTileTextureSize) * TileRenderer.scale;
        const totalHeight = (TileRenderer.columns * 0.5 * TileRenderer.halfTileTextureSize + TileRenderer.rows * 0.5 * TileRenderer.halfTileTextureSize) * TileRenderer.scale;
        const centerOffset = {
            x: (Graphics.canvas.clientWidth + totalWidth) * 0.5,
            y: (Graphics.canvas.clientHeight - totalHeight) * 0.5,
        };
        for (let i = 0; i < TileRenderer.rows; ++i) {
            for (let j = 0; j < TileRenderer.columns; ++j) {
                const { x, y } = gridToScreen(i, j);
                const animationOffset = TileRenderer.waveAnimationSpeed === 0 ? 0 : Math.cos(time * TileRenderer.waveAnimationSpeed * 0.01 + (j + i) * 0.5) * TileRenderer.waveAnimationAmplitude;
                Graphics.ctx.drawImage(TileRenderer.tileImage, x * TileRenderer.scale + centerOffset.x, (y + animationOffset) * TileRenderer.scale + centerOffset.y, TileRenderer.tileTextureSize * TileRenderer.scale, TileRenderer.tileTextureSize * TileRenderer.scale);
            }
        }
    }
    TileRenderer.drawTiles = drawTiles;
    window.addEventListener('wheel', (ev) => {
        if (ev.deltaY < 0)
            TileRenderer.scale *= 1.1;
        else if (ev.deltaY > 0)
            TileRenderer.scale *= 0.9;
    });
    window.addEventListener('touchmove', (ev) => { });
})(TileRenderer || (TileRenderer = {}));
