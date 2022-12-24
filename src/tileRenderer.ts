import { AnimationType } from './animationType.js'
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
	export let animationType: AnimationType = AnimationType.VERTICAL_WAVE
	export let animationSpeed: number = 1
	export let animationAmplitude: number = 10
	export let columns: number = 10
	export let rows: number = 10

	export function setTexture(image: HTMLImageElement): void {
		tileImage = image
	}

	function gridToScreen(i: number, j: number): Vector2 {
		return {
			x: i * halfTileTextureSize - j * halfTileTextureSize - halfTileTextureSize,
			y: i * quarterTileTextureSize + j * quarterTileTextureSize - quarterTileTextureSize,
		}
	}

	function getTotalSize(): Vector2 {
		return {
			x: columns * halfTileTextureSize + rows * halfTileTextureSize,
			y: columns * quarterTileTextureSize + rows * quarterTileTextureSize,
		}
	}

	function getAnimationOffset(time: DOMHighResTimeStamp, i: number, j: number): Vector2 {
		if (animationAmplitude === 0) return { x: 0, y: 0 }

		switch (animationType) {
			case AnimationType.VERTICAL_WAVE:
				return {
					x: 0,
					y: Math.cos(time * animationSpeed * 0.01 + (j + i) * 0.5) * animationAmplitude,
				}

			case AnimationType.HORIZONTAL_WAVE:
				return {
					x: Math.cos(time * animationSpeed * 0.01 + (j + i) * 0.5) * animationAmplitude,
					y: 0,
				}

			case AnimationType.SPIRAL:
				return {
					x: Math.cos(time * animationSpeed * 0.01 + (j + i) * 0.5) * animationAmplitude,
					y: Math.sin(time * animationSpeed * 0.01 + (j + i) * 0.5) * animationAmplitude,
				}

			case AnimationType.SHAKE:
				return {
					x: Math.sin(time * animationSpeed * 0.01 + (j + 1) * (i + 1) * 0.5) * animationAmplitude,
					y: Math.cos(time * animationSpeed * 0.01 + (j + 1) * (i + 1) * 0.5) * animationAmplitude,
				}

			default:
				return { x: 0, y: 0 }
		}
	}

	export function drawTiles(time: DOMHighResTimeStamp): void {
		if (!tileImage) return

		Graphics.ctx.save()
		Graphics.ctx.translate(
			(Graphics.canvas.clientWidth + (columns * halfTileTextureSize - rows * halfTileTextureSize) * scale) * 0.5,
			(Graphics.canvas.clientHeight - (columns * quarterTileTextureSize + rows * quarterTileTextureSize) * scale) * 0.5
		)
		Graphics.ctx.scale(scale, scale)

		for (let i: number = 0; i < rows; ++i) {
			for (let j: number = 0; j < columns; ++j) {
				const { x, y } = gridToScreen(i, j)
				const animationOffset: Vector2 = getAnimationOffset(time, i, j)
				Graphics.ctx.drawImage(tileImage, (x + animationOffset.x) | 0, (y + animationOffset.y) | 0)
			}
		}

		Graphics.ctx.restore()
	}

	export function recalculateScale(): void {
		const totalSize: Vector2 = getTotalSize()
		const widthAspect: number = totalSize.x / window.innerWidth
		const heightAspect: number = totalSize.y / window.innerHeight
		const fitPaddingMultiplier: number = 1.0 - autoZoomScalePaddingPercentage

		if (widthAspect > heightAspect) scale = (1 / widthAspect) * fitPaddingMultiplier
		else scale = (1 / heightAspect) * fitPaddingMultiplier

		if (scale > maxScale) scale = maxScale
	}

	window.addEventListener('resize', recalculateScale)
}
