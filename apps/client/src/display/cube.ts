import { Matrix4x4, NewMatrix4x4, MatrixMultiply, Vector3 } from '@libs/shared';
import { Displayable, Uniforms } from './display';

export class CubeDisplay implements Displayable {
  position: Vector3;
  rotation: Vector3;
  size: Vector3;
  private vao: WebGLVertexArrayObject | null = null;

  private colour: Vector3;

  constructor(position: Vector3, size: Vector3, colour?: Vector3) {
    this.position = position;
    this.rotation = [0, 0, 0];
    this.size = size;
    this.colour = colour || [0.2, 0.7, 1.0];
  }

  init(gl: WebGL2RenderingContext): void {
    const vertices = new Float32Array([
      // Front face
      0, 0, this.size[2],
      this.size[0], 0, this.size[2],
      this.size[0], this.size[1], this.size[2],
      0, this.size[1], this.size[2],
      // Back face
      0, 0, 0,
      this.size[0], 0, 0,
      this.size[0], this.size[1], 0,
      0, this.size[1], 0,
      // Top face
      0, this.size[1], 0,
      this.size[0], this.size[1], 0,
      this.size[0], this.size[1], this.size[2],
      0, this.size[1], this.size[2],
      // Bottom face
      0, 0, 0,
      this.size[0], 0, 0,
      this.size[0], 0, this.size[2],
      0, 0, this.size[2],
      // Right face
      this.size[0], 0, 0,
      this.size[0], this.size[1], 0,
      this.size[0], this.size[1], this.size[2],
      this.size[0], 0, this.size[2],
      // Left face
      0, 0, 0,
      0, this.size[1], 0,
      0, this.size[1], this.size[2],
      0, 0, this.size[2],
    ]);

    const indices = new Uint16Array([
      // Front face
      0,
      1,
      2,
      0,
      2,
      3,
      // Back face
      4,
      5,
      6,
      4,
      6,
      7,
      // Top face
      8,
      9,
      10,
      8,
      10,
      11,
      // Bottom face
      12,
      13,
      14,
      12,
      14,
      15,
      // Right face
      16,
      17,
      18,
      16,
      18,
      19,
      // Left face
      20,
      21,
      22,
      20,
      22,
      23,
    ]);

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0);
    gl.enableVertexAttribArray(0);
    gl.bindVertexArray(null);
  }

  draw(gl: WebGL2RenderingContext, uniforms: Uniforms): void {
    if (!this.vao) {
      throw new Error('Cube not initialized');
    }

    gl.bindVertexArray(this.vao);

    const modelMatrix = this.getModelMatrix();
    gl.uniformMatrix4fv(uniforms.uModel, false, modelMatrix);

    gl.uniform3fv(uniforms.uColour, this.colour);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }

  getModelMatrix(): Matrix4x4 {
    const [tx, ty, tz] = this.position;
    const [rx, ry, rz] = this.rotation;

    // Rotation X
    const cx = Math.cos(-ry);
    const sx = Math.sin(-ry);
    const rotX = NewMatrix4x4([
      1,
      0,
      0,
      0,
      0,
      cx,
      sx,
      0,
      0,
      -sx,
      cx,
      0,
      0,
      0,
      0,
      1,
    ]);

    // Rotation Y
    const cy = Math.cos(rx);
    const sy = Math.sin(rx);
    const rotY = NewMatrix4x4([
      cy,
      0,
      -sy,
      0,
      0,
      1,
      0,
      0,
      sy,
      0,
      cy,
      0,
      0,
      0,
      0,
      1,
    ]);

    // Rotation Z
    const cz = Math.cos(-rz);
    const sz = Math.sin(-rz);
    const rotZ = NewMatrix4x4([
      cz,
      sz,
      0,
      0,
      -sz,
      cz,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
    ]);

    // Translation
    const trans = NewMatrix4x4([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      tx,
      ty,
      tz,
      1,
    ]);

    // Apply rotation around the object's position
    return MatrixMultiply(rotZ, MatrixMultiply(rotX, MatrixMultiply(rotY, trans)))
  }
}
