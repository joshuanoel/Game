import { Vector2 } from "@libs/shared"

export class InputManager {
    private keysPressed: Set<string>

    private mouseMovement: Vector2 = [0, 0]
    private sensitivity: number = 0.002

    private canvas: HTMLCanvasElement

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas

        canvas.addEventListener("click", () => canvas.requestPointerLock())

        window.addEventListener("mousemove", (e) => this.onMouseMove(e))

        this.keysPressed = new Set()
        window.addEventListener("keydown", (e) => this.onKeyDown(e))
        window.addEventListener("keyup", (e) => this.onKeyUp(e))
    }

    private onKeyDown(event: KeyboardEvent) {
        const key = event.code
        if (!this.keysPressed.has(key)) {
            this.keysPressed.add(key)
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        const key = event.code
        if (this.keysPressed.has(key)) {
            this.keysPressed.delete(key)
        }
    }

    private onMouseMove(event: MouseEvent) {
        if (document.pointerLockElement === this.canvas) {
            this.mouseMovement[0] += -event.movementX * this.sensitivity
            this.mouseMovement[1] += -event.movementY * this.sensitivity
        }
    }

    isKeyPressed(key: string): boolean {
        return this.keysPressed.has(key)
    }

    getMouseMovement(): Vector2 {
        const movement = [...this.mouseMovement] as Vector2
        this.mouseMovement = [0, 0]
        return movement
    }
}