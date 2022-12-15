import { StringHelper } from './helpers/stringHelper.js'
import { Texture } from './texture.js'
import { TileRenderer } from './tileRenderer.js'

export namespace InputUI {
	const columnsInput: HTMLInputElement = document.getElementById('columns-input') as HTMLInputElement
	const rowsInput: HTMLInputElement = document.getElementById('rows-input') as HTMLInputElement
	const animationSpeedInput: HTMLInputElement = document.getElementById('animation-speed-input') as HTMLInputElement
	const textureSelect: HTMLSelectElement = document.getElementById('texture-select') as HTMLSelectElement

	export function init() {
		initTextureSelectOptions()
		onSizeInputChange()
	}

	export function onSizeInputChange(): void {
		TileRenderer.columns = parseInt(columnsInput.value)
		TileRenderer.rows = parseInt(rowsInput.value)
	}

	function initTextureSelectOptions(): void {
		textureSelect.replaceChildren()
		TileRenderer.texturePaths.forEach(path => {
			const optionElement: HTMLOptionElement = document.createElement('option')
			optionElement.value = path
			optionElement.text = StringHelper.stripExtension(StringHelper.basename(path))
			textureSelect.appendChild(optionElement)
		})
	}

	columnsInput.addEventListener('change', onSizeInputChange)
	rowsInput.addEventListener('change', onSizeInputChange)
	animationSpeedInput.addEventListener('input', () => (TileRenderer.waveAnimationSpeed = parseFloat(animationSpeedInput.value)))
	textureSelect.addEventListener('change', () => {
		TileRenderer.tileTexture = new Texture(textureSelect.selectedOptions[0].value)
	})
}
