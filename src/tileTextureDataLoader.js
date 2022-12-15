import { InputUI } from './inputUI.js';
export var TileTextureDataLoader;
(function (TileTextureDataLoader) {
    const paths = ['img/tiles/purple.png', 'img/tiles/brown.png', 'img/tiles/steel.png', 'img/tiles/red.png', 'img/tiles/green.png', 'img/tiles/blue.png'];
    const cssColorPixelIndex = 424;
    TileTextureDataLoader.textures = [];
    function init() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        paths.forEach(path => {
            initTextureData(path, canvas, ctx);
        });
    }
    TileTextureDataLoader.init = init;
    function readCssColor(canvas, ctx) {
        const pixels = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
        const r = pixels[cssColorPixelIndex];
        const g = pixels[cssColorPixelIndex + 1];
        const b = pixels[cssColorPixelIndex + 2];
        return `rgb(${r},${g},${b})`;
    }
    TileTextureDataLoader.readCssColor = readCssColor;
    function initTextureData(path, canvas, ctx) {
        let data = {
            cssColor: '#fff',
            path: path,
            image: new Image(),
        };
        data.image.onload = () => {
            canvas.width = data.image.width;
            canvas.height = data.image.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(data.image, 0, 0, canvas.width, canvas.height);
            data.cssColor = readCssColor(canvas, ctx);
            InputUI.addTextureSelectOption(data);
            TileTextureDataLoader.textures.push(data);
            if (TileTextureDataLoader.textures.length === 1)
                InputUI.selectTexture(0);
        };
        data.image.src = path;
    }
    TileTextureDataLoader.initTextureData = initTextureData;
})(TileTextureDataLoader || (TileTextureDataLoader = {}));
