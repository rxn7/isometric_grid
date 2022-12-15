export namespace Graphics {
	export const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
	export const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D

	export function init(): void {
		if (!ctx) throw new Error('Failed to get canvas context')
	}

	export function clear(): void {
		ctx.fillStyle = `rgb(255, 255, 255)`
		ctx.fillRect(0.0, 0.0, canvas.clientWidth, canvas.clientHeight)
	}
}
