import { StringHelper } from './helpers/stringHelper.js';
import { Texture } from './texture.js';
import { TileRenderer } from './tileRenderer.js';
export var InputUI;
(function (InputUI) {
    const columnsInput = document.getElementById('columns-input');
    const rowsInput = document.getElementById('rows-input');
    const animationSpeedInput = document.getElementById('animation-speed-input');
    const animationAmplitudeInput = document.getElementById('animation-amplitude-input');
    const textureSelect = document.getElementById('texture-select');
    function init() {
        initTextureSelectOptions();
        onSizeInputChange();
    }
    InputUI.init = init;
    function onSizeInputChange() {
        TileRenderer.columns = parseInt(columnsInput.value);
        TileRenderer.rows = parseInt(rowsInput.value);
    }
    InputUI.onSizeInputChange = onSizeInputChange;
    function initTextureSelectOptions() {
        textureSelect.replaceChildren();
        TileRenderer.texturePaths.forEach(path => {
            const optionElement = document.createElement('option');
            optionElement.value = path;
            optionElement.text = StringHelper.stripExtension(StringHelper.basename(path));
            textureSelect.appendChild(optionElement);
        });
    }
    columnsInput.addEventListener('change', onSizeInputChange);
    rowsInput.addEventListener('change', onSizeInputChange);
    animationSpeedInput.addEventListener('input', () => (TileRenderer.waveAnimationSpeed = parseFloat(animationSpeedInput.value)));
    animationAmplitudeInput.addEventListener('input', () => (TileRenderer.waveAnimationAmplitude = parseFloat(animationAmplitudeInput.value)));
    textureSelect.addEventListener('change', () => {
        TileRenderer.tileTexture = new Texture(textureSelect.selectedOptions[0].value);
    });
})(InputUI || (InputUI = {}));
