import { AnimationType } from './animationType.js'
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
	const animationTypeSelect: HTMLSelectElement = document.getElementById('animation-type-select') as HTMLSelectElement

	export function init() {
		initAnimationTypeSelect()
		onSizeInputChange()
	}

	function onSizeInputChange(): void {
		TileRenderer.columns = parseInt(columnsInput.value)
		TileRenderer.rows = parseInt(rowsInput.value)
		TileRenderer.updateScale()
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

	function onTextureSelect(): void {
		const textureData: TileTextureData = TileTextureDataLoader.textures[textureSelect.selectedIndex]
		textureSelect.style.backgroundColor = textureData.cssColor
		TileRenderer.setTexture(textureData.image)
	}

	function onAnimationSelect(): void {
		const animationTypeStr: string = Object.keys(AnimationType)[animationTypeSelect.selectedIndex] as string
		const animationType: AnimationType = AnimationType[animationTypeStr as keyof typeof AnimationType]
		TileRenderer.animationType = animationType
	}

	columnsInput.addEventListener('change', onSizeInputChange)
	columnsInput.addEventListener('input', onSizeInputChange)
	rowsInput.addEventListener('change', onSizeInputChange)
	rowsInput.addEventListener('input', onSizeInputChange)
	animationSpeedInput.addEventListener('input', () => (TileRenderer.animationSpeed = parseFloat(animationSpeedInput.value)))
	animationAmplitudeInput.addEventListener('input', () => (TileRenderer.animationAmplitude = parseFloat(animationAmplitudeInput.value)))
	textureSelect.addEventListener('change', onTextureSelect)
	animationTypeSelect.addEventListener('change', onAnimationSelect)
}
