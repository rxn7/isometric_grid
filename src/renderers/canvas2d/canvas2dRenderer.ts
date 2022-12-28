import { AnimationType } from '../../animationType.js'
import { Vector2 } from '../../math/vector2.js'
import { Renderer } from '../renderer.js'

export class Canvas2dRenderer extends Renderer {
	private tileImage: HTMLImageElement = new Image()
	private ctx: CanvasRenderingContext2D
	private animationType: AnimationType = AnimationType.VERTICAL_WAVE

	constructor() {
		super()
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
		if (!this.ctx) throw new Error('Failed to get Canvas2D rendering context')
		this.setupCanvas()
	}

	public override setAnimationData(speed: number, amplitude: number, animationTypeIdx: number): void {
		super.setAnimationData(speed, amplitude, animationTypeIdx)
		this.animationType = Object.values(AnimationType)[animationTypeIdx]
	}

	public override setTexture(image: HTMLImageElement): void {
		this.tileImage = image
	}

	public override clear(): void {
		this.ctx.fillStyle = 'skyblue'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}

	public override render(time: DOMHighResTimeStamp): void {
		this.ctx.save()
		this.ctx.translate(
			(this.canvas.clientWidth + (this.columns * Renderer.halfTileTextureSize - this.rows * Renderer.halfTileTextureSize) * this.scale) * 0.5,
			(this.canvas.clientHeight - (this.columns * Renderer.quarterTileTextureSize + this.rows * Renderer.quarterTileTextureSize) * this.scale) * 0.5
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

	protected getAnimationOffset(time: DOMHighResTimeStamp, i: number, j: number): Vector2 {
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
					y: Math.cos(time * this.animationSpeed * 0.01 + (j + 1) * (i + 1) * 0.5) * this.animationAmplitude,
					x: Math.sin(time * this.animationSpeed * 0.01 + (j + 1) * (i + 1) * 0.5) * this.animationAmplitude,
				}

			default:
				return { x: 0, y: 0 }
		}
	}

	public override onResize(width: number, height: number): void {
		super.onResize(width, height)
		this.ctx.imageSmoothingEnabled = false
	}
}
