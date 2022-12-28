import { AnimationType } from '../animationType.js'
import { Vector2 } from '../math/vector2.js'

export abstract class Renderer {
	protected canvas: HTMLCanvasElement

	public rows: number = 10
	public columns: number = 10

	public scale: number = 1
	public animationSpeed: number = 1
	public animationAmplitude: number = 10

	static maxScale: number = 5
	static autoZoomScalePaddingPercentage: number = 0.1
	static tileTextureSize: number = 32
	static halfTileTextureSize: number = this.tileTextureSize * 0.5
	static quarterTileTextureSize: number = this.tileTextureSize * 0.25

	protected constructor() {
		this.canvas = document.createElement('canvas')
	}

	public clear(): void {}
	public render(time: DOMHighResTimeStamp): void {}

	public recalculateScale(): void {
		const totalSize: Vector2 = this.getTotalSize()
		const widthAspect: number = totalSize.x / window.innerWidth
		const heightAspect: number = totalSize.y / window.innerHeight
		const fitPaddingMultiplier: number = 1.0 - Renderer.autoZoomScalePaddingPercentage

		if (widthAspect > heightAspect) this.scale = (1 / widthAspect) * fitPaddingMultiplier
		else this.scale = (1 / heightAspect) * fitPaddingMultiplier

		if (this.scale > Renderer.maxScale) this.scale = Renderer.maxScale
	}

	public setTexture(image: HTMLImageElement): void {}

	public setupCanvas(): void {
		document.body.appendChild(this.canvas)
	}

	public destroyCanvas(): void {
		document.removeChild(this.canvas)
	}

	public onResize(width: number, height: number): void {
		this.canvas.width = width
		this.canvas.height = height

		this.recalculateScale()
	}

	public setColumnsAndRows(columns: number, rows: number): void {
		this.columns = columns
		this.rows = rows
		this.recalculateScale()
	}

	public setAnimationData(speed: number, amplitude: number, animationTypeIdx: number): void {
		this.animationSpeed = speed
		this.animationAmplitude = amplitude
	}
	protected gridToScreen(i: number, j: number): Vector2 {
		return {
			x: i * Renderer.halfTileTextureSize - j * Renderer.halfTileTextureSize - Renderer.halfTileTextureSize,
			y: i * Renderer.quarterTileTextureSize + j * Renderer.quarterTileTextureSize - Renderer.quarterTileTextureSize,
		}
	}

	protected getTotalSize(): Vector2 {
		return {
			x: this.columns * Renderer.halfTileTextureSize + this.rows * Renderer.halfTileTextureSize,
			y: this.columns * Renderer.quarterTileTextureSize + this.rows * Renderer.quarterTileTextureSize,
		}
	}
}
