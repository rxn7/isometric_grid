export namespace Graphics {
	export const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
	export const ctx: CanvasRenderingContext2D = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D

	export function init(): void {
		if (!ctx) throw new Error('Failed to get canvas context')
		ctx.save()
	}

	export function clear(): void {
		ctx.fillStyle = 'skyblue'
		ctx.fillRect(0, 0, canvas.width, canvas.height)
	}
}
