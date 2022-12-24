import { AnimationType } from './animationType.js';
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
    const animationTypeSelect = document.getElementById('animation-type-select');
    function init() {
        initAnimationTypeSelect();
        onSizeInputChange();
    }
    InputUI.init = init;
    function onSizeInputChange() {
        TileRenderer.columns = parseInt(columnsInput.value);
        TileRenderer.rows = parseInt(rowsInput.value);
        TileRenderer.recalculateScale();
    }
    function initAnimationTypeSelect() {
        const animationCount = Object.keys(AnimationType).length;
        for (let i = 0; i < animationCount; ++i) {
            const optionElement = document.createElement('option');
            optionElement.value = i.toString();
            optionElement.text = Object.values(AnimationType)[i];
            animationTypeSelect.appendChild(optionElement);
        }
    }
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
    function onAnimationSelect() {
        const animationTypeStr = Object.keys(AnimationType)[animationTypeSelect.selectedIndex];
        const animationType = AnimationType[animationTypeStr];
        TileRenderer.animationType = animationType;
    }
    columnsInput.addEventListener('change', onSizeInputChange);
    columnsInput.addEventListener('input', onSizeInputChange);
    rowsInput.addEventListener('change', onSizeInputChange);
    rowsInput.addEventListener('input', onSizeInputChange);
    animationSpeedInput.addEventListener('input', () => (TileRenderer.animationSpeed = parseFloat(animationSpeedInput.value)));
    animationAmplitudeInput.addEventListener('input', () => (TileRenderer.animationAmplitude = parseFloat(animationAmplitudeInput.value)));
    textureSelect.addEventListener('change', onTextureSelect);
    animationTypeSelect.addEventListener('change', onAnimationSelect);
})(InputUI || (InputUI = {}));
