export namespace Graphics {
	export const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
	export const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D

	export function init(): void {
		if (!ctx) throw new Error('Failed to get canvas context')
	}

	export function clear(): void {
		ctx.clearRect(0.0, 0.0, canvas.clientWidth, canvas.clientHeight)
	}
}
