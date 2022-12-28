export class ShaderProgram {
	protected program: WebGLProgram
	protected computeShader?: WebGLShader
	protected vertexShader: WebGLShader
	protected fragmentShader: WebGLShader

	constructor(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string, computeSrc?: string) {
		this.program = gl.createProgram() as WebGLProgram

		this.fragmentShader = this.createShader(gl, fragSrc, gl.FRAGMENT_SHADER)
		this.vertexShader = this.createShader(gl, vertSrc, gl.VERTEX_SHADER)

		gl.linkProgram(this.program)
		const infoLog: string | null = gl.getProgramInfoLog(this.program)
		if (infoLog && infoLog.length > 0) throw new Error(infoLog)

		gl.validateProgram(this.program)
	}

	private createShader(gl: WebGL2RenderingContext, src: string, type: number): WebGLShader {
		const shader = gl.createShader(type) as WebGLShader
		gl.shaderSource(shader, src)

		gl.compileShader(shader)
		const infoLog: string | null = gl.getShaderInfoLog(shader)
		if (infoLog && infoLog.length > 0) throw new Error(infoLog)

		gl.attachShader(this.program, shader)
		return shader
	}

	public getUniformLocation = (gl: WebGL2RenderingContext, name: string): WebGLUniformLocation => gl.getUniformLocation(this.program, name) as WebGLUniformLocation
	public unbind = (gl: WebGL2RenderingContext): void => gl.useProgram(null)
	public bind = (gl: WebGL2RenderingContext): void => gl.useProgram(this.program)

	public getFragmentShader = (): WebGLShader => this.fragmentShader
	public getVertexShader = (): WebGLShader => this.vertexShader
	public getProgram = (): WebGLProgram => this.program
}
