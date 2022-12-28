import { InputUI } from './inputUI.js'
import { Canvas2dRenderer } from './renderers/canvas2d/canvas2dRenderer.js'
import { Renderer } from './renderers/renderer.js'
import { WebGLRenderer } from './renderers/webgl/webglRenderer.js'
import { TileTextureDataLoader } from './tileTextureDataLoader.js'

export let renderer: Renderer

function onWindowResize(): void {
	const width: number = Math.trunc(window.visualViewport?.width || window.innerWidth)
	const height: number = Math.trunc(window.visualViewport?.height || window.innerHeight)

	renderer.onResize(width, height)
}

function init(): void {
	TileTextureDataLoader.init()

	try {
		// renderer = new Canvas2dRenderer()
		renderer = new WebGLRenderer()
	} catch (err: any) {
		console.error(`Falling back to Canvas2dRenderer, ${err}`)
		renderer = new Canvas2dRenderer()
	}

	InputUI.init()

	onWindowResize()

	requestAnimationFrame(animationFrame)
}

function animationFrame(time: DOMHighResTimeStamp): void {
	renderer.clear()
	renderer.render(time)

	requestAnimationFrame(animationFrame)
}

window.addEventListener('resize', onWindowResize)
init()
