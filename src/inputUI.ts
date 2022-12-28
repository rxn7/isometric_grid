import { AnimationType } from './animationType.js'
import { StringHelper } from './helpers/stringHelper.js'
import { renderer } from './main.js'
import { TileTextureData } from './tileTextureData.js'
import { TileTextureDataLoader } from './tileTextureDataLoader.js'

export namespace InputUI {
	const columnsInput: HTMLInputElement = document.getElementById('columns-input') as HTMLInputElement
	const rowsInput: HTMLInputElement = document.getElementById('rows-input') as HTMLInputElement
	const animationSpeedInput: HTMLInputElement = document.getElementById('animation-speed-input') as HTMLInputElement
	const animationAmplitudeInput: HTMLInputElement = document.getElementById('animation-amplitude-input') as HTMLInputElement
	const textureSelect: HTMLSelectElement = document.getElementById('texture-select') as HTMLSelectElement
	const animationTypeSelect: HTMLSelectElement = document.getElementById('animation-type-select') as HTMLSelectElement

	export function init() {
		initAnimationTypeSelect()
		onSizeInputChange()
		onAnimationDataChange()
	}

	function initAnimationTypeSelect(): void {
		const animationCount: number = Object.keys(AnimationType).length
		for (let i: number = 0; i < animationCount; ++i) {
			const optionElement: HTMLOptionElement = document.createElement('option')
			optionElement.value = i.toString()
			optionElement.text = Object.values(AnimationType)[i]
			animationTypeSelect.appendChild(optionElement)
		}
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

	function onSizeInputChange(): void {
		const columns: number = parseInt(columnsInput.value)
		const rows: number = parseInt(rowsInput.value)
		renderer.setColumnsAndRows(columns, rows)
	}

	function onTextureSelect(): void {
		const textureData: TileTextureData = TileTextureDataLoader.textures[textureSelect.selectedIndex]
		textureSelect.style.backgroundColor = textureData.cssColor
		renderer.setTexture(textureData.image)
	}

	function onAnimationDataChange(): void {
		renderer.setAnimationData(parseFloat(animationSpeedInput.value), parseFloat(animationAmplitudeInput.value), animationTypeSelect.selectedIndex)
	}

	columnsInput.addEventListener('change', onSizeInputChange)
	columnsInput.addEventListener('input', onSizeInputChange)
	rowsInput.addEventListener('change', onSizeInputChange)
	rowsInput.addEventListener('input', onSizeInputChange)
	animationSpeedInput.addEventListener('input', onAnimationDataChange)
	animationAmplitudeInput.addEventListener('input', onAnimationDataChange)
	animationTypeSelect.addEventListener('change', onAnimationDataChange)
	textureSelect.addEventListener('change', onTextureSelect)
}
