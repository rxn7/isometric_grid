import { Graphics } from './graphics.js'
import { Tile } from './tile.js'

function updateSize(): void {
	const width: number = Math.trunc(window.visualViewport?.width || window.innerWidth)
	const height: number = Math.trunc(window.visualViewport?.height || window.innerHeight)

	Graphics.canvas.width = width
	Graphics.canvas.height = height

	Graphics.ctx.imageSmoothingEnabled = false
}

function init(): void {
	updateSize()
	requestAnimationFrame(animationFrame)
}

function animationFrame(time: DOMHighResTimeStamp) {
	if (!Tile.tileTexture.IsLoaded) return

	Graphics.clear()
	Tile.drawTiles(20, 20, time)

	requestAnimationFrame(animationFrame)
}

init()
window.addEventListener('resize', updateSize)
