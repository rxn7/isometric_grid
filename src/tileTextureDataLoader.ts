import { InputUI } from './inputUI.js'
import { TileTextureData } from './tileTextureData.js'

export namespace TileTextureDataLoader {
	const paths: string[] = ['img/tiles/purple.png', 'img/tiles/brown.png', 'img/tiles/steel.png', 'img/tiles/red.png', 'img/tiles/green.png', 'img/tiles/blue.png']
	const cssColorPixelIndex: number = 424

	export let textures: TileTextureData[] = []

	export function init(): void {
		const canvas: HTMLCanvasElement = document.createElement('canvas')
		const ctx: CanvasRenderingContext2D = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D

		paths.forEach(path => {
			initTextureData(path, canvas, ctx)
		})
	}

	export function readCssColor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): string {
		const pixels = ctx?.getImageData(0, 0, canvas.width, canvas.height).data
		const r = pixels[cssColorPixelIndex]
		const g = pixels[cssColorPixelIndex + 1]
		const b = pixels[cssColorPixelIndex + 2]

		return `rgb(${r},${g},${b})`
	}

	export function initTextureData(path: string, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
		let data: TileTextureData = {
			cssColor: '#fff',
			path: path,
			image: new Image(),
		}

		data.image.onload = () => {
			canvas.width = data.image.width
			canvas.height = data.image.height

			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(data.image, 0, 0, canvas.width, canvas.height)

			data.cssColor = readCssColor(canvas, ctx)

			InputUI.addTextureSelectOption(data)

			textures.push(data)
			if (textures.length === 1) InputUI.selectTexture(0)
		}

		data.image.src = path
	}
}
