import { Camera } from './camera.js'
import { Renderer } from '../renderer.js'
import { IsometricGridShaderProgram } from './shaders/isometricGridShader.js'

export class WebGLRenderer extends Renderer {
	private gl: WebGL2RenderingContext
	private indexBuffer: WebGLBuffer
	private vertexBuffer: WebGLBuffer
	private shader: IsometricGridShaderProgram
	private texture: WebGLTexture
	private camera: Camera

	constructor() {
		super()
		this.gl = this.canvas.getContext('webgl2') as WebGL2RenderingContext

		if (!this.gl) {
			throw new Error("This browser doesn't support WebGL2!")
		}

		this.shader = new IsometricGridShaderProgram(this.gl)
		this.shader.bind(this.gl)

		this.vertexBuffer = this.gl.createBuffer() as WebGLBuffer
		this.indexBuffer = this.gl.createBuffer() as WebGLBuffer
		this.texture = this.gl.createTexture() as WebGLTexture
		this.camera = new Camera()

		this.gl.enable(this.gl.BLEND)
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)

		this.setupBuffer()
		this.setupCanvas()
	}

	private setupBuffer(): void {
		// prettier-ignore
		const vertices: Float32Array = new Float32Array([
			-Renderer.halfTileTextureSize, Renderer.halfTileTextureSize, 0, 1,
			-Renderer.halfTileTextureSize, -Renderer.halfTileTextureSize, 0, 0,
			Renderer.halfTileTextureSize, -Renderer.halfTileTextureSize, 1, 0,
			Renderer.halfTileTextureSize, Renderer.halfTileTextureSize, 1, 1
		])
		const indices: Uint8Array = new Uint8Array([3, 2, 1, 3, 1, 0])

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW)

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)

		const stride: number = 4 * Float32Array.BYTES_PER_ELEMENT

		// Position
		this.gl.enableVertexAttribArray(0)
		this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, stride, 0)

		// UV
		this.gl.enableVertexAttribArray(1)
		this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT)
	}

	public override clear(): void {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)
	}

	public override render(time: DOMHighResTimeStamp): void {
		this.gl.uniform1i(this.shader.uniforms.time, time)
		this.gl.drawElementsInstanced(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_BYTE, 0, this.rows * this.columns)
	}

	public override setTexture(image: HTMLImageElement): void {
		this.gl.activeTexture(this.gl.TEXTURE0)
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST_MIPMAP_NEAREST)
		this.gl.generateMipmap(this.gl.TEXTURE_2D)
	}

	public override onResize(width: number, height: number): void {
		super.onResize(width, height)
		this.gl.viewport(0, 0, width, height)
	}

	public override recalculateScale(): void {
		super.recalculateScale()
		this.gl.uniform1f(this.shader.uniforms.scale, this.scale)
		this.camera.recalculate(this.scale, this.canvas.width, this.canvas.height)
		this.gl.uniformMatrix4fv(this.shader.uniforms.projection, false, this.camera.getProjectionMatrixValues())
	}

	public override setColumnsAndRows(rows: number, columns: number): void {
		super.setColumnsAndRows(columns, rows)
		this.gl.uniform1i(this.shader.uniforms.columns, this.columns)
		this.gl.uniform1i(this.shader.uniforms.rows, this.rows)
	}

	public override setAnimationData(speed: number, amplitude: number, animationTypeIdx: number): void {
		super.setAnimationData(speed, amplitude, animationTypeIdx)
		this.gl.uniform1f(this.shader.uniforms.animationSpeed, speed)
		this.gl.uniform1f(this.shader.uniforms.animationAmplitude, amplitude)

		if (this.animationSpeed != 0) {
			this.gl.uniform1i(this.shader.uniforms.animationType, animationTypeIdx)
		} else {
			this.gl.uniform1i(this.shader.uniforms.animationType, -1)
		}
	}
}
