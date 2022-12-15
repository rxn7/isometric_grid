import { Graphics } from './graphics.js';
import { Texture } from './texture.js';
export var Tile;
(function (Tile) {
    Tile.tileTexture = new Texture('img/tile.png', onTextureLoad);
    Tile.scale = 3;
    Tile.waveAnimationSpeed = 100;
    function onTextureLoad() {
        Tile.tileTextureSize = Tile.tileTexture.image.width;
        Tile.halfTileTextureSize = Tile.tileTextureSize * 0.5;
    }
    function gridToScreen(x, y) {
        return {
            x: x * Tile.halfTileTextureSize + y * -Tile.halfTileTextureSize - Tile.halfTileTextureSize,
            y: x * 0.5 * Tile.halfTileTextureSize + y * 0.5 * Tile.halfTileTextureSize,
        };
    }
    function drawTiles(rows, columns, time) {
        const halfScreenWidth = Graphics.canvas.clientWidth * 0.5;
        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < columns; ++j) {
                const { x, y } = gridToScreen(i, j);
                const yOffset = Math.cos(time * (1 / Tile.waveAnimationSpeed) + (j + i) * 0.5) * 10;
                Graphics.ctx.drawImage(Tile.tileTexture.image, x * Tile.scale + halfScreenWidth, (y + yOffset) * Tile.scale, Tile.tileTextureSize * Tile.scale, Tile.tileTextureSize * Tile.scale);
            }
        }
    }
    Tile.drawTiles = drawTiles;
    window.addEventListener('wheel', (ev) => {
        if (ev.deltaY < 0)
            Tile.scale *= 1.1;
        else if (ev.deltaY > 0)
            Tile.scale *= 0.9;
    });
})(Tile || (Tile = {}));
