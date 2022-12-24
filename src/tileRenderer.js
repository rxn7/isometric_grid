import { AnimationType } from './animationType.js';
import { Graphics } from './graphics.js';
export var TileRenderer;
(function (TileRenderer) {
    TileRenderer.maxScale = 5;
    TileRenderer.autoZoomScalePaddingPercentage = 0.1;
    TileRenderer.tileTextureSize = 32;
    TileRenderer.halfTileTextureSize = TileRenderer.tileTextureSize * 0.5;
    TileRenderer.quarterTileTextureSize = TileRenderer.tileTextureSize * 0.25;
    TileRenderer.scale = 1;
    TileRenderer.animationType = AnimationType.VERTICAL_WAVE;
    TileRenderer.animationSpeed = 1;
    TileRenderer.animationAmplitude = 10;
    TileRenderer.columns = 10;
    TileRenderer.rows = 10;
    function setTexture(image) {
        TileRenderer.tileImage = image;
    }
    TileRenderer.setTexture = setTexture;
    function gridToScreen(i, j) {
        return {
            x: i * TileRenderer.halfTileTextureSize - j * TileRenderer.halfTileTextureSize - TileRenderer.halfTileTextureSize,
            y: i * TileRenderer.quarterTileTextureSize + j * TileRenderer.quarterTileTextureSize - TileRenderer.quarterTileTextureSize,
        };
    }
    function getTotalSize() {
        return {
            x: TileRenderer.columns * TileRenderer.halfTileTextureSize + TileRenderer.rows * TileRenderer.halfTileTextureSize,
            y: TileRenderer.columns * TileRenderer.quarterTileTextureSize + TileRenderer.rows * TileRenderer.quarterTileTextureSize,
        };
    }
    function getAnimationOffset(time, i, j) {
        if (TileRenderer.animationAmplitude === 0)
            return { x: 0, y: 0 };
        switch (TileRenderer.animationType) {
            case AnimationType.VERTICAL_WAVE:
                return {
                    x: 0,
                    y: Math.cos(time * TileRenderer.animationSpeed * 0.01 + (j + i) * 0.5) * TileRenderer.animationAmplitude,
                };
            case AnimationType.HORIZONTAL_WAVE:
                return {
                    x: Math.cos(time * TileRenderer.animationSpeed * 0.01 + (j + i) * 0.5) * TileRenderer.animationAmplitude,
                    y: 0,
                };
            case AnimationType.SPIRAL:
                return {
                    x: Math.cos(time * TileRenderer.animationSpeed * 0.01 + (j + i) * 0.5) * TileRenderer.animationAmplitude,
                    y: Math.sin(time * TileRenderer.animationSpeed * 0.01 + (j + i) * 0.5) * TileRenderer.animationAmplitude,
                };
            case AnimationType.SHAKE:
                return {
                    x: Math.sin(time * TileRenderer.animationSpeed * 0.01 + (j + 1) * (i + 1) * 0.5) * TileRenderer.animationAmplitude,
                    y: Math.cos(time * TileRenderer.animationSpeed * 0.01 + (j + 1) * (i + 1) * 0.5) * TileRenderer.animationAmplitude,
                };
            default:
                return { x: 0, y: 0 };
        }
    }
    function drawTiles(time) {
        if (!TileRenderer.tileImage)
            return;
        Graphics.ctx.save();
        Graphics.ctx.translate((Graphics.canvas.clientWidth + (TileRenderer.columns * TileRenderer.halfTileTextureSize - TileRenderer.rows * TileRenderer.halfTileTextureSize) * TileRenderer.scale) * 0.5, (Graphics.canvas.clientHeight - (TileRenderer.columns * TileRenderer.quarterTileTextureSize + TileRenderer.rows * TileRenderer.quarterTileTextureSize) * TileRenderer.scale) * 0.5);
        Graphics.ctx.scale(TileRenderer.scale, TileRenderer.scale);
        for (let i = 0; i < TileRenderer.rows; ++i) {
            for (let j = 0; j < TileRenderer.columns; ++j) {
                const { x, y } = gridToScreen(i, j);
                const animationOffset = getAnimationOffset(time, i, j);
                Graphics.ctx.drawImage(TileRenderer.tileImage, (x + animationOffset.x) | 0, (y + animationOffset.y) | 0);
            }
        }
        Graphics.ctx.restore();
    }
    TileRenderer.drawTiles = drawTiles;
    function recalculateScale() {
        const totalSize = getTotalSize();
        const widthAspect = totalSize.x / window.innerWidth;
        const heightAspect = totalSize.y / window.innerHeight;
        const fitPaddingMultiplier = 1.0 - TileRenderer.autoZoomScalePaddingPercentage;
        if (widthAspect > heightAspect)
            TileRenderer.scale = (1 / widthAspect) * fitPaddingMultiplier;
        else
            TileRenderer.scale = (1 / heightAspect) * fitPaddingMultiplier;
        if (TileRenderer.scale > TileRenderer.maxScale)
            TileRenderer.scale = TileRenderer.maxScale;
    }
    TileRenderer.recalculateScale = recalculateScale;
    window.addEventListener('resize', recalculateScale);
})(TileRenderer || (TileRenderer = {}));
