import { Graphics } from './graphics.js'
import { Vector2 } from './math/vector2.js'

export namespace TileRenderer {
	export let tileImage: HTMLImageElement
	export let tileTextureSize: number
	export let halfTileTextureSize: number
	export let scale: number = 3
	export let waveAnimationSpeed: number = 1
	export let waveAnimationAmplitude: number = 10
	export let columns: number = 10
	export let rows: number = 10

	export function setTexture(image: HTMLImageElement): void {
		tileTextureSize = image.width
		halfTileTextureSize = tileTextureSize * 0.5
		tileImage = image
	}

	function gridToScreen(x: number, y: number): Vector2 {
		return {
			x: x * halfTileTextureSize + y * -halfTileTextureSize - halfTileTextureSize,
			y: x * 0.5 * halfTileTextureSize + y * 0.5 * halfTileTextureSize,
		}
	}

	export function drawTiles(time: DOMHighResTimeStamp): void {
		if (!tileImage) return

		const totalWidth = (columns * halfTileTextureSize + rows * -halfTileTextureSize) * scale
		const totalHeight = (columns * 0.5 * halfTileTextureSize + rows * 0.5 * halfTileTextureSize) * scale

		const centerOffset: Vector2 = {
			x: (Graphics.canvas.clientWidth + totalWidth) * 0.5,
			y: (Graphics.canvas.clientHeight - totalHeight) * 0.5,
		}

		for (let i: number = 0; i < rows; ++i) {
			for (let j: number = 0; j < columns; ++j) {
				const { x, y } = gridToScreen(i, j)
				const animationOffset: number = waveAnimationSpeed === 0 ? 0 : Math.cos(time * waveAnimationSpeed * 0.01 + (j + i) * 0.5) * waveAnimationAmplitude
				Graphics.ctx.drawImage(tileImage, x * scale + centerOffset.x, (y + animationOffset) * scale + centerOffset.y, tileTextureSize * scale, tileTextureSize * scale)
			}
		}
	}

	window.addEventListener('wheel', (ev: WheelEvent) => {
		if (ev.deltaY < 0) scale *= 1.1
		else if (ev.deltaY > 0) scale *= 0.9
	})

	window.addEventListener('touchmove', (ev: TouchEvent) => {})
}
