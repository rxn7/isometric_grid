import { StringHelper } from './helpers/stringHelper.js'
import { TileRenderer } from './tileRenderer.js'
import { TileTextureData } from './tileTextureData.js'
import { TileTextureDataLoader } from './tileTextureDataLoader.js'

export namespace InputUI {
	const columnsInput: HTMLInputElement = document.getElementById('columns-input') as HTMLInputElement
	const rowsInput: HTMLInputElement = document.getElementById('rows-input') as HTMLInputElement
	const animationSpeedInput: HTMLInputElement = document.getElementById('animation-speed-input') as HTMLInputElement
	const animationAmplitudeInput: HTMLInputElement = document.getElementById('animation-amplitude-input') as HTMLInputElement
	const textureSelect: HTMLSelectElement = document.getElementById('texture-select') as HTMLSelectElement

	export function init() {
		onSizeInputChange()
	}

	export function onSizeInputChange(): void {
		TileRenderer.columns = parseInt(columnsInput.value)
		TileRenderer.rows = parseInt(rowsInput.value)
		TileRenderer.updateScale()
	}

	export function addTextureSelectOption(textureData: TileTextureData): void {
		const optionElement: HTMLOptionElement = document.createElement('option')
		optionElement.value = textureData.path
		optionElement.style.backgroundColor = textureData.cssColor
		optionElement.text = StringHelper.stripExtension(StringHelper.basename(textureData.path))
		textureSelect.appendChild(optionElement)
	}

	export function selectTexture(idx: number): void {
		textureSelect.selectedIndex = idx
		onTextureSelect()
	}

	function onTextureSelect(): void {
		const textureData: TileTextureData = TileTextureDataLoader.textures[textureSelect.selectedIndex]
		textureSelect.style.backgroundColor = textureData.cssColor
		TileRenderer.setTexture(textureData.image)
	}

	columnsInput.addEventListener('change', onSizeInputChange)
	rowsInput.addEventListener('change', onSizeInputChange)
	animationSpeedInput.addEventListener('input', () => (TileRenderer.waveAnimationSpeed = parseFloat(animationSpeedInput.value)))
	animationAmplitudeInput.addEventListener('input', () => (TileRenderer.waveAnimationAmplitude = parseFloat(animationAmplitudeInput.value)))
	textureSelect.addEventListener('change', onTextureSelect)
}
