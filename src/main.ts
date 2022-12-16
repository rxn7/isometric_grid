import { Graphics } from './graphics.js'
import { InputUI } from './inputUI.js'
import { TileRenderer } from './tileRenderer.js'
import { TileTextureDataLoader } from './tileTextureDataLoader.js'

function onWindowResize(): void {
	const width: number = Math.trunc(window.visualViewport?.width || window.innerWidth)
	const height: number = Math.trunc(window.visualViewport?.height || window.innerHeight)

	Graphics.canvas.width = width
	Graphics.canvas.height = height

	Graphics.ctx.imageSmoothingEnabled = false
}

function init(): void {
	TileTextureDataLoader.init()
	InputUI.init()
	Graphics.init()

	onWindowResize()
	TileRenderer.updateScale()

	requestAnimationFrame(animationFrame)
}

function animationFrame(time: DOMHighResTimeStamp): void {
	requestAnimationFrame(animationFrame)
	Graphics.clear()

	TileRenderer.drawTiles(time)
}

init()
window.addEventListener('resize', onWindowResize)
