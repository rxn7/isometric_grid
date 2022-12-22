import { StringHelper } from './helpers/stringHelper.js';
import { TileRenderer } from './tileRenderer.js';
import { TileTextureDataLoader } from './tileTextureDataLoader.js';
export var InputUI;
(function (InputUI) {
    const columnsInput = document.getElementById('columns-input');
    const rowsInput = document.getElementById('rows-input');
    const animationSpeedInput = document.getElementById('animation-speed-input');
    const animationAmplitudeInput = document.getElementById('animation-amplitude-input');
    const textureSelect = document.getElementById('texture-select');
    function init() {
        onSizeInputChange();
    }
    InputUI.init = init;
    function onSizeInputChange() {
        TileRenderer.columns = parseInt(columnsInput.value);
        TileRenderer.rows = parseInt(rowsInput.value);
        TileRenderer.updateScale();
    }
    InputUI.onSizeInputChange = onSizeInputChange;
    function addTextureSelectOption(textureData) {
        const optionElement = document.createElement('option');
        optionElement.value = textureData.path;
        optionElement.style.backgroundColor = textureData.cssColor;
        optionElement.text = StringHelper.stripExtension(StringHelper.basename(textureData.path));
        textureSelect.appendChild(optionElement);
    }
    InputUI.addTextureSelectOption = addTextureSelectOption;
    function selectTexture(idx) {
        textureSelect.selectedIndex = idx;
        onTextureSelect();
    }
    InputUI.selectTexture = selectTexture;
    function onTextureSelect() {
        const textureData = TileTextureDataLoader.textures[textureSelect.selectedIndex];
        textureSelect.style.backgroundColor = textureData.cssColor;
        TileRenderer.setTexture(textureData.image);
    }
    columnsInput.addEventListener('change', onSizeInputChange);
    columnsInput.addEventListener('input', onSizeInputChange);
    rowsInput.addEventListener('change', onSizeInputChange);
    rowsInput.addEventListener('input', onSizeInputChange);
    animationSpeedInput.addEventListener('input', () => (TileRenderer.waveAnimationSpeed = parseFloat(animationSpeedInput.value)));
    animationAmplitudeInput.addEventListener('input', () => (TileRenderer.waveAnimationAmplitude = parseFloat(animationAmplitudeInput.value)));
    textureSelect.addEventListener('change', onTextureSelect);
})(InputUI || (InputUI = {}));
