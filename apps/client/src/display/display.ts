import { Matrix4x4, NewPerspectiveMatrix, Vector3 } from "@libs/shared";
import { Camera } from "./camera"

export type Uniforms = {
    uModel: WebGLUniformLocation | null
    uView: WebGLUniformLocation | null
    uProjection: WebGLUniformLocation | null
    uColour: WebGLUniformLocation | null
}

export interface Displayable {
    position: Vector3
    rotation: Vector3

    init(gl: WebGL2RenderingContext): void
    draw(gl: WebGL2RenderingContext, uniforms: Uniforms): void
    getModelMatrix(): Matrix4x4
}

export class DisplayManager {
    gl: WebGL2RenderingContext

    private uModel: WebGLUniformLocation | null
    private uView: WebGLUniformLocation | null
    private uProjection: WebGLUniformLocation | null
    private uColour: WebGLUniformLocation | null
    private program: WebGLProgram

    constructor(canvas: HTMLCanvasElement) {
        const gl = canvas.getContext("webgl2")
        if (gl === null) {
            throw new Error("WebGL2 not supported")
        }
        this.gl = gl

        // Shaders
        const vsSource = `#version 300 es
            in vec3 aPosition;
            uniform vec3 uColour;
            out vec3 vColour;
            uniform mat4 uModel;
            uniform mat4 uView;
            uniform mat4 uProjection;
            void main() {
                gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
                vColour = uColour;
            }
        `
        const fsSource = `#version 300 es
            precision mediump float;
            out vec4 FragColor;
            in vec3 vColour;
            void main() {
                FragColor = vec4(vColour, 1.0);
            }
        `

        this.program = this.createProgram(gl, vsSource, fsSource)
        gl.useProgram(this.program)
        this.uModel = gl.getUniformLocation(this.program, "uModel")
        this.uView = gl.getUniformLocation(this.program, "uView")
        this.uProjection = gl.getUniformLocation(this.program, "uProjection")
        this.uColour = gl.getUniformLocation(this.program, "uColour")

        // Projection matrix
        const proj = NewPerspectiveMatrix(Math.PI / 3, canvas.width / canvas.height, 0.1, 100.0)
        gl.uniformMatrix4fv(this.uProjection, false, proj)
    }

    render(displayables: Displayable[], camera: Camera): void {
        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.clearColor(0.1, 0.1, 0.1, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        const view = camera.getViewMatrix()
        this.gl.uniformMatrix4fv(this.uView, false, view)

        displayables.forEach(displayable => {
            displayable.draw(this.gl, { 
                uModel: this.uModel, uView: this.uView, uProjection: this.uProjection, uColour: this.uColour 
            })
        })
    }

    private createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
        const shader = gl.createShader(type)!
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader) || "Shader compile error")
        }
        return shader
    }

    private createProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string): WebGLProgram {
        const vs = this.createShader(gl, gl.VERTEX_SHADER, vsSource)
        const fs = this.createShader(gl, gl.FRAGMENT_SHADER, fsSource)
        const program = gl.createProgram()!
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program) || "Program link error")
        }
        return program
    }
}
