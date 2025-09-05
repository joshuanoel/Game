import { Vector3, VectorCross, VectorDot, VectorNormalize, VectorSub } from "./vector"

export type Matrix4x4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number
]

export function NewMatrix4x4(values: number[]): Matrix4x4 {
    if (values.length !== 16) {
        throw new Error("Invalid matrix4x4 values");
    }
    return [
        values[0], values[1], values[2], values[3],
        values[4], values[5], values[6], values[7],
        values[8], values[9], values[10], values[11],
        values[12], values[13], values[14], values[15]
    ]
}

export function NewPerspectiveMatrix(fov: number, aspect: number, near: number, far: number): Matrix4x4 {
    const f = 1.0 / Math.tan(fov / 2)
    const nf = 1 / (near - far)
    return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * far * near) * nf, 0
    ]
}

export function NewLookAtMatrix(eye: Vector3, center: Vector3, up: Vector3): Matrix4x4 {
    const forward = VectorNormalize(VectorSub(center, eye))
    const right = VectorNormalize(VectorCross(forward, up))
    const trueUp = VectorCross(right, forward)
    return [
        right[0], trueUp[0], -forward[0], 0,
        right[1], trueUp[1], -forward[1], 0,
        right[2], trueUp[2], -forward[2], 0,
        -VectorDot(right, eye), -VectorDot(trueUp, eye), VectorDot(forward, eye), 1
    ]
}

export function MatrixMultiply(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
    const out = NewMatrix4x4(new Array(16).fill(0))
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            out[row*4 + col] =
                a[row*4 + 0] * b[0*4 + col] +
                a[row*4 + 1] * b[1*4 + col] +
                a[row*4 + 2] * b[2*4 + col] +
                a[row*4 + 3] * b[3*4 + col]
        }
    }
    return out
}