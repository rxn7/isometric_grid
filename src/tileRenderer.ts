import { Graphics } from './graphics.js'
import { Vector2 } from './math/vector2.js'

export namespace TileRenderer {
	export let tileImage: HTMLImageElement

	export const maxScale: number = 5
	export const autoZoomScalePaddingPercentage: number = 0.1
	export const tileTextureSize: number = 32
	export const halfTileTextureSize: number = tileTextureSize * 0.5
	export const quarterTileTextureSize: number = tileTextureSize * 0.25

	export let scale: number = 1
	export let waveAnimationSpeed: number = 1
	export let waveAnimationAmplitude: number = 10
	export let columns: number = 10
	export let rows: number = 10

	export function setTexture(image: HTMLImageElement): void {
		tileImage = image
	}

	function gridToScreen(x: number, y: number): Vector2 {
		return {
			x: x * halfTileTextureSize - y * halfTileTextureSize - halfTileTextureSize,
			y: x * quarterTileTextureSize + y * quarterTileTextureSize - quarterTileTextureSize,
		}
	}

	export function getTotalSize(): Vector2 {
		return {
			x: columns * halfTileTextureSize + rows * halfTileTextureSize,
			y: columns * quarterTileTextureSize + rows * quarterTileTextureSize,
		}
	}

	export function drawTiles(time: DOMHighResTimeStamp): void {
		if (!tileImage) return

		const centerOffset: Vector2 = {
			x: (Graphics.canvas.clientWidth + (columns * halfTileTextureSize - rows * halfTileTextureSize) * scale) * 0.5,
			y: (Graphics.canvas.clientHeight - (columns * quarterTileTextureSize + rows * quarterTileTextureSize) * scale) * 0.5,
		}

		for (let i: number = 0; i < rows; ++i) {
			for (let j: number = 0; j < columns; ++j) {
				const { x, y } = gridToScreen(i, j)
				const animationOffset: number = waveAnimationSpeed === 0 ? 0 : Math.cos(time * waveAnimationSpeed * 0.01 + (j + i) * 0.5) * waveAnimationAmplitude
				Graphics.ctx.drawImage(tileImage, x * scale + centerOffset.x, (y + animationOffset) * scale + centerOffset.y, tileTextureSize * scale, tileTextureSize * scale)
			}
		}
	}

	export function updateScale(): void {
		const totalSize: Vector2 = getTotalSize()
		const widthAspect: number = totalSize.x / Graphics.canvas.width
		const heightAspect: number = totalSize.y / Graphics.canvas.height
		const fitPaddingMultiplier: number = 1.0 - autoZoomScalePaddingPercentage

		if (widthAspect > heightAspect) {
			scale = (1 / widthAspect) * fitPaddingMultiplier
		} else {
			scale = (1 / heightAspect) * fitPaddingMultiplier
		}

		if (scale > maxScale) scale = maxScale
	}

	window.addEventListener('resize', updateScale)
}
