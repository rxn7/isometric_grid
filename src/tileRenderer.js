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
            x: x * TileRenderer.halfTileTextureSize - y * TileRenderer.halfTileTextureSize - TileRenderer.halfTileTextureSize,
            y: x * TileRenderer.quarterTileTextureSize + y * TileRenderer.quarterTileTextureSize - TileRenderer.quarterTileTextureSize,
        };
    }
    function getTotalSize() {
        return {
            x: TileRenderer.columns * TileRenderer.halfTileTextureSize + TileRenderer.rows * TileRenderer.halfTileTextureSize,
            y: TileRenderer.columns * TileRenderer.quarterTileTextureSize + TileRenderer.rows * TileRenderer.quarterTileTextureSize,
        };
    }
    TileRenderer.getTotalSize = getTotalSize;
    function calculateAnimationOffset(time, i, j) {
        if (TileRenderer.waveAnimationAmplitude === 0 || TileRenderer.waveAnimationAmplitude === 0)
            return 0;
        return Math.cos(time * TileRenderer.waveAnimationSpeed * 0.01 + (j + i) * 0.5) * TileRenderer.waveAnimationAmplitude;
    }
    function drawTiles(time) {
        if (!TileRenderer.tileImage)
            return;
        const centerOffset = {
            x: (Graphics.canvas.clientWidth + (TileRenderer.columns * TileRenderer.halfTileTextureSize - TileRenderer.rows * TileRenderer.halfTileTextureSize) * TileRenderer.scale) * 0.5,
            y: (Graphics.canvas.clientHeight - (TileRenderer.columns * TileRenderer.quarterTileTextureSize + TileRenderer.rows * TileRenderer.quarterTileTextureSize) * TileRenderer.scale) * 0.5,
        };
        for (let i = 0; i < TileRenderer.rows; ++i) {
            for (let j = 0; j < TileRenderer.columns; ++j) {
                const { x, y } = gridToScreen(i, j);
                const animationOffset = calculateAnimationOffset(time, i, j);
                Graphics.ctx.drawImage(TileRenderer.tileImage, x * TileRenderer.scale + centerOffset.x, (y + animationOffset) * TileRenderer.scale + centerOffset.y, TileRenderer.tileTextureSize * TileRenderer.scale, TileRenderer.tileTextureSize * TileRenderer.scale);
            }
        }
    }
    TileRenderer.drawTiles = drawTiles;
    function updateScale() {
        const totalSize = getTotalSize();
        const widthAspect = totalSize.x / Graphics.canvas.width;
        const heightAspect = totalSize.y / Graphics.canvas.height;
        const fitPaddingMultiplier = 1.0 - TileRenderer.autoZoomScalePaddingPercentage;
        if (widthAspect > heightAspect) {
            TileRenderer.scale = (1 / widthAspect) * fitPaddingMultiplier;
        }
        else {
            TileRenderer.scale = (1 / heightAspect) * fitPaddingMultiplier;
        }
        if (TileRenderer.scale > TileRenderer.maxScale)
            TileRenderer.scale = TileRenderer.maxScale;
    }
    TileRenderer.updateScale = updateScale;
    window.addEventListener('resize', updateScale);
})(TileRenderer || (TileRenderer = {}));
