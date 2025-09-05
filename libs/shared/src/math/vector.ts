export type Vector3 = [number, number, number]

export type Vector2 = [number, number]

export function NewVector3(values: number[]): Vector3 {
    if (values.length !== 3) {
        throw new Error('Invalid vector3')
    }
    return [values[0], values[1], values[2]]
}

export function VectorAdd(a: Vector3, b: Vector3): Vector3 {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

export function VectorSub(a: Vector3, b: Vector3): Vector3 {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function VectorNormalize(v: Vector3): Vector3 {
    const len = Math.hypot(v[0], v[1], v[2])
    return [v[0] / len, v[1] / len, v[2] / len]
}

export function VectorDot(a: Vector3, b: Vector3): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

export function VectorCross(a: Vector3, b: Vector3): Vector3 {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ]
}