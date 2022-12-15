import { Graphics } from './graphics.js'
import { InputUI } from './inputUI.js'
import { Texture } from './texture.js'
import { TileRenderer } from './tileRenderer.js'

function onWindowResize(): void {
	const width: number = Math.trunc(window.visualViewport?.width || window.innerWidth)
	const height: number = Math.trunc(window.visualViewport?.height || window.innerHeight)

	Graphics.canvas.width = width
	Graphics.canvas.height = height

	Graphics.ctx.imageSmoothingEnabled = false
}

function init(): void {
	Graphics.init()

	InputUI.onSizeInputChange()
	onWindowResize()

	requestAnimationFrame(animationFrame)
}

function animationFrame(time: DOMHighResTimeStamp) {
	if (!TileRenderer.tileTexture.IsLoaded) return

	Graphics.clear()
	TileRenderer.drawTiles(time)

	requestAnimationFrame(animationFrame)
}

init()
window.addEventListener('resize', onWindowResize)