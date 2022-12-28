import { ShaderProgram } from '../shaderProgram.js'

const isometricGridVertexShader: string = /*glsl*/ `#version 300 es
    precision lowp float;

    layout(location=0) in vec2 aPos;
    layout(location=1) in vec2 aTexCoord;

    const float tileTextureSize = 32.0;
    const float halfTileTextureSize = tileTextureSize / 2.0;
    const float quarterTileTextureSize = tileTextureSize / 4.0;

    out vec2 TexCoord;

    uniform float uAnimationSpeed;
    uniform float uAnimationAmplitude;
    uniform int uAnimationType;
    uniform float uScale;
    uniform int uColumns;
    uniform int uRows;
    uniform int uTime;
    uniform mat4 uProjectionMatrix;

    vec2 verticalWaveAnimationOffset(int i, int j) {
        return vec2(
            0,
            cos(float(uTime) * uAnimationSpeed * 0.01 + float(i + j) * 0.5) * uAnimationAmplitude
        );
    }

    vec2 horizontalWaveAnimationOffset(int i, int j) {
        return vec2(
            cos(float(uTime) * uAnimationSpeed * 0.01 + float(i + j) * 0.5) * uAnimationAmplitude,
            0
        );
    }

    vec2 spiralAnimationOffset(int i, int j) {
        float value = float(uTime) * uAnimationSpeed * 0.01 + float(i + j) * 0.5;
        return vec2(
            cos(value) * uAnimationAmplitude,
            sin(value) * uAnimationAmplitude
        );
    }

    vec2 shakeAnimationOffset(int i, int j) {
        float value = float(uTime) * uAnimationSpeed * 0.01 + float(i + j) * float(i + 1) * 0.5;
        return vec2(
            cos(value) * uAnimationAmplitude,
            sin(value) * uAnimationAmplitude
        );
    }

    void main() {
        int i = uColumns - (gl_InstanceID % uColumns);
        int j = uRows - (gl_InstanceID / uColumns);

        vec2 animationOffset = vec2(0,0);
        if(uAnimationType == 0)
            animationOffset = verticalWaveAnimationOffset(i, j);
        else if(uAnimationType == 1)
            animationOffset = horizontalWaveAnimationOffset(i, j);
        else if(uAnimationType == 2)
            animationOffset = spiralAnimationOffset(i, j);
        else if(uAnimationType == 3)
            animationOffset = shakeAnimationOffset(i, j);

        vec2 position = vec2(
            uScale * (float(-i) * halfTileTextureSize - float(-j) * halfTileTextureSize - halfTileTextureSize + animationOffset.x + aPos.x),
            uScale * (float(-i) * quarterTileTextureSize + float(-j) * quarterTileTextureSize - quarterTileTextureSize + animationOffset.y + aPos.y)
        );

        gl_Position = uProjectionMatrix * vec4(position, 0.0, 1.0);
        TexCoord = aTexCoord;
    }
`

const isometricGridFragmentShader: string = /*glsl*/ `#version 300 es
    precision lowp float;

    out vec4 FragColor;

    in vec2 TexCoord;
    uniform sampler2D Texture;

    void main() {
        FragColor = texture(Texture, TexCoord);
    }
`

export class IsometricGridShaderProgram extends ShaderProgram {
	public uniforms = {
		projection: 0 as WebGLUniformLocation,
		columns: 0 as WebGLUniformLocation,
		rows: 0 as WebGLUniformLocation,
		scale: 0 as WebGLUniformLocation,
		time: 0 as WebGLUniformLocation,
		animationSpeed: 0 as WebGLUniformLocation,
		animationAmplitude: 0 as WebGLUniformLocation,
		animationType: 0 as WebGLUniformLocation,
	}

	constructor(gl: WebGL2RenderingContext) {
		super(gl, isometricGridVertexShader, isometricGridFragmentShader)

		this.uniforms.projection = this.getUniformLocation(gl, 'uProjectionMatrix')
		this.uniforms.columns = this.getUniformLocation(gl, 'uColumns')
		this.uniforms.rows = this.getUniformLocation(gl, 'uRows')
		this.uniforms.scale = this.getUniformLocation(gl, 'uScale')
		this.uniforms.animationSpeed = this.getUniformLocation(gl, 'uAnimationSpeed')
		this.uniforms.animationAmplitude = this.getUniformLocation(gl, 'uAnimationAmplitude')
		this.uniforms.animationType = this.getUniformLocation(gl, 'uAnimationType')
		this.uniforms.time = this.getUniformLocation(gl, 'uTime')
	}
}
