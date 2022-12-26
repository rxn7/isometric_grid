import { Renderer } from '../renderer.js'

export class WebGLRenderer extends Renderer {
	constructor() {
		super()
		throw new Error("This browser doesn't support WebGL!")
	}
}
