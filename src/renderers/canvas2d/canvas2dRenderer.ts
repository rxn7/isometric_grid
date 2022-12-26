import { AnimationType } from '../../animationType.js'
import { Vector2 } from '../../math/vector2.js'
import { Renderer } from '../renderer.js'

export class Canvas2dRenderer extends Renderer {
	private tileImage: HTMLImageElement = new Image()
	private ctx: CanvasRenderingContext2D

	static maxScale: number = 5
	static autoZoomScalePaddingPercentage: number = 0.1

	constructor() {
		super()
		this.ctx = Renderer.canvas.getContext('2d') as CanvasRenderingContext2D
		if (!this.ctx) throw new Error('Failed to get Canvas2D rendering context')
	}

	public override setTexture(image: HTMLImageElement): void {
		this.tileImage = image
	}

	private gridToScreen(i: number, j: number): Vector2 {
		return {
			x: i * Renderer.halfTileTextureSize - j * Renderer.halfTileTextureSize - Renderer.halfTileTextureSize,
			y: i * Renderer.quarterTileTextureSize + j * Renderer.quarterTileTextureSize - Renderer.quarterTileTextureSize,
		}
	}

	private getTotalSize(): Vector2 {
		return {
			x: this.columns * Renderer.halfTileTextureSize + this.rows * Renderer.halfTileTextureSize,
			y: this.columns * Renderer.quarterTileTextureSize + this.rows * Renderer.quarterTileTextureSize,
		}
	}

	private getAnimationOffset(time: DOMHighResTimeStamp, i: number, j: number): Vector2 {
		if (this.animationAmplitude === 0) return { x: 0, y: 0 }

		switch (this.animationType) {
			case AnimationType.VERTICAL_WAVE:
				return {
					x: 0,
					y: Math.cos(time * this.animationSpeed * 0.01 + (j + i) * 0.5) * this.animationAmplitude,
				}

			case AnimationType.HORIZONTAL_WAVE:
				return {
					x: Math.cos(time * this.animationSpeed * 0.01 + (j + i) * 0.5) * this.animationAmplitude,
					y: 0,
				}

			case AnimationType.SPIRAL:
				return {
					x: Math.cos(time * this.animationSpeed * 0.01 + (j + i) * 0.5) * this.animationAmplitude,
					y: Math.sin(time * this.animationSpeed * 0.01 + (j + i) * 0.5) * this.animationAmplitude,
				}

			case AnimationType.SHAKE:
				return {
					x: Math.sin(time * this.animationSpeed * 0.01 + (j + 1) * (i + 1) * 0.5) * this.animationAmplitude,
					y: Math.cos(time * this.animationSpeed * 0.01 + (j + 1) * (i + 1) * 0.5) * this.animationAmplitude,
				}

			default:
				return { x: 0, y: 0 }
		}
	}

	public override clear(): void {
		this.ctx.fillStyle = 'skyblue'
		this.ctx.fillRect(0, 0, Renderer.canvas.width, Renderer.canvas.height)
	}

	public override render(time: DOMHighResTimeStamp): void {
		this.ctx.save()
		this.ctx.translate(
			(Renderer.canvas.clientWidth + (this.columns * Renderer.halfTileTextureSize - this.rows * Renderer.halfTileTextureSize) * this.scale) * 0.5,
			(Renderer.canvas.clientHeight - (this.columns * Renderer.quarterTileTextureSize + this.rows * Renderer.quarterTileTextureSize) * this.scale) * 0.5
		)
		this.ctx.scale(this.scale, this.scale)

		for (let i: number = 0; i < this.rows; ++i) {
			for (let j: number = 0; j < this.columns; ++j) {
				const { x, y } = this.gridToScreen(i, j)
				const animationOffset: Vector2 = this.getAnimationOffset(time, i, j)
				this.ctx.drawImage(this.tileImage, (x + animationOffset.x) | 0, (y + animationOffset.y) | 0)
			}
		}

		this.ctx.restore()
	}

	public override recalculateScale(): void {
		const totalSize: Vector2 = this.getTotalSize()
		const widthAspect: number = totalSize.x / window.innerWidth
		const heightAspect: number = totalSize.y / window.innerHeight
		const fitPaddingMultiplier: number = 1.0 - Canvas2dRenderer.autoZoomScalePaddingPercentage

		if (widthAspect > heightAspect) this.scale = (1 / widthAspect) * fitPaddingMultiplier
		else this.scale = (1 / heightAspect) * fitPaddingMultiplier

		if (this.scale > Canvas2dRenderer.maxScale) this.scale = Canvas2dRenderer.maxScale

		this.ctx.imageSmoothingEnabled = false
	}
}
