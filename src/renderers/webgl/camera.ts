import { Matrix4 } from '../../math/matrix4.js'
import { Vector2 } from '../../math/vector2.js'

export class Camera {
	private projectionMatrix: Matrix4 = new Matrix4()
	public position: Vector2 = { x: 0, y: 0 }
	private left: number = 0
	private right: number = 0
	private top: number = 0
	private bottom: number = 0

	public recalculate(scale: number, width: number, height: number): void {
		const invScale: number = 1.0 / scale

		const halfWidth: number = width * 0.5
		const halfHeight: number = height * 0.5
		this.left = (this.position.x - halfWidth) * invScale
		this.right = (this.position.x + halfWidth) * invScale
		this.top = (this.position.y - halfHeight) * invScale
		this.bottom = (this.position.y + halfHeight) * invScale

		this.projectionMatrix.ortho(this.left, this.right, this.top, this.bottom, 0.0, 1.0)
	}

	public getProjectionMatrixValues = (): Float32Array => this.projectionMatrix.getValues()
}
