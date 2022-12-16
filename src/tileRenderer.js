import { Graphics } from './graphics.js';
export var TileRenderer;
(function (TileRenderer) {
    TileRenderer.maxScale = 5;
    TileRenderer.autoZoomScalePaddingPercentage = 0.1;
    TileRenderer.tileTextureSize = 32;
    TileRenderer.halfTileTextureSize = TileRenderer.tileTextureSize * 0.5;
    TileRenderer.quarterTileTextureSize = TileRenderer.tileTextureSize * 0.25;
    TileRenderer.scale = 1;
    TileRenderer.waveAnimationSpeed = 1;
    TileRenderer.waveAnimationAmplitude = 10;
    TileRenderer.columns = 10;
    TileRenderer.rows = 10;
    function setTexture(image) {
        TileRenderer.tileImage = image;
    }
    TileRenderer.setTexture = setTexture;
    function gridToScreen(x, y) {
        return {
            x: x * TileRenderer.halfTileTextureSize + y * -TileRenderer.halfTileTextureSize - TileRenderer.halfTileTextureSize,
            y: x * TileRenderer.quarterTileTextureSize + y * TileRenderer.quarterTileTextureSize - TileRenderer.quarterTileTextureSize,
        };
    }
    function getTotalSize() {
        return {
            x: TileRenderer.columns * TileRenderer.halfTileTextureSize + TileRenderer.rows * TileRenderer.halfTileTextureSize,
            y: TileRenderer.columns * 0.5 * TileRenderer.halfTileTextureSize + TileRenderer.rows * 0.5 * TileRenderer.halfTileTextureSize,
        };
    }
    TileRenderer.getTotalSize = getTotalSize;
    function drawTiles(time) {
        if (!TileRenderer.tileImage)
            return;
        const centerOffset = {
            x: (Graphics.canvas.clientWidth + (TileRenderer.columns * TileRenderer.halfTileTextureSize + TileRenderer.rows * -TileRenderer.halfTileTextureSize) * TileRenderer.scale) * 0.5,
            y: (Graphics.canvas.clientHeight - (TileRenderer.columns * 0.5 * TileRenderer.halfTileTextureSize + TileRenderer.rows * 0.5 * TileRenderer.halfTileTextureSize) * TileRenderer.scale) * 0.5,
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
    function updateScale() {
        const totalSize = getTotalSize();
        console.log(totalSize);
        const fitPadding = 1.0 - TileRenderer.autoZoomScalePaddingPercentage;
        if (Graphics.canvas.width - totalSize.x > Graphics.canvas.height - totalSize.y) {
            const widthAspect = totalSize.x / Graphics.canvas.width;
            TileRenderer.scale = (1 / widthAspect) * fitPadding;
        }
        else {
            const heightAspect = totalSize.y / Graphics.canvas.height;
            TileRenderer.scale = (1 / heightAspect) * fitPadding;
        }
        if (TileRenderer.scale > TileRenderer.maxScale)
            TileRenderer.scale = TileRenderer.maxScale;
    }
    TileRenderer.updateScale = updateScale;
})(TileRenderer || (TileRenderer = {}));
