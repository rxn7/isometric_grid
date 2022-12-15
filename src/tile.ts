import { Graphics } from './graphics.js'
import { Vector2 } from './math/vector2.js'
import { Texture } from './texture.js'

export namespace Tile {
	export const tileTexture: Texture = new Texture('img/tile.png', onTextureLoad)
	export let tileTextureSize: number
	export let halfTileTextureSize: number
	export let scale: number = 3
	export let waveAnimationSpeed: number = 100

	function onTextureLoad(): void {
		tileTextureSize = tileTexture.image.width
		halfTileTextureSize = tileTextureSize * 0.5
	}

	function gridToScreen(x: number, y: number): Vector2 {
		return {
			x: x * halfTileTextureSize + y * -halfTileTextureSize - halfTileTextureSize,
			y: x * 0.5 * halfTileTextureSize + y * 0.5 * halfTileTextureSize,
		}
	}

	export function drawTiles(rows: number, columns: number, time: DOMHighResTimeStamp): void {
		const halfScreenWidth: number = Graphics.canvas.clientWidth * 0.5
		for (let i: number = 0; i < rows; ++i) {
			for (let j: number = 0; j < columns; ++j) {
				const { x, y } = gridToScreen(i, j)
				const yOffset: number = Math.cos(time * (1 / waveAnimationSpeed) + (j + i) * 0.5) * 10
				Graphics.ctx.drawImage(tileTexture.image, x * scale + halfScreenWidth, (y + yOffset) * scale, tileTextureSize * scale, tileTextureSize * scale)
			}
		}
	}

	window.addEventListener('wheel', (ev: WheelEvent) => {
		if (ev.deltaY < 0) scale *= 1.1
		else if (ev.deltaY > 0) scale *= 0.9
	})
}
