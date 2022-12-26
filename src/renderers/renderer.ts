import { AnimationType } from '../animationType.js'

export abstract class Renderer {
	static canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement

	public rows: number = 10
	public columns: number = 10

	public scale: number = 1
	public animationType: AnimationType = AnimationType.VERTICAL_WAVE
	public animationSpeed: number = 1
	public animationAmplitude: number = 10

	static tileTextureSize: number = 32
	static halfTileTextureSize: number = this.tileTextureSize * 0.5
	static quarterTileTextureSize: number = this.tileTextureSize * 0.25

	public clear(): void {}
	public render(time: DOMHighResTimeStamp): void {}
	public recalculateScale(): void {}
	public setTexture(image: HTMLImageElement): void {}
}
