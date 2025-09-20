import { Actor, Matrix4x4, NewLookAtMatrix, NewVector3, VectorAdd } from '@libs/shared';

export interface Camera {
    getViewMatrix(): Matrix4x4
}

export class DefaultCamera implements Camera {
    getViewMatrix(): Matrix4x4 {
        return NewLookAtMatrix(NewVector3([0, 2, 10]), NewVector3([0, 0, -1]), NewVector3([0, 1, 0]))
    }
}

export class ActorFPSCamera implements Camera {
    private actor: Actor

    constructor(actor: Actor) {
        this.actor = actor
    }

    getViewMatrix(): Matrix4x4 {
        let forward = NewVector3([0, 0, 0])
        if (this.actor.rotation) {
            const [yaw, pitch] = this.actor.rotation
            forward = NewVector3([
                Math.cos(pitch) * Math.sin(yaw),
                Math.sin(pitch),
                Math.cos(pitch) * Math.cos(yaw)
            ])
        }
        const viewPosition = VectorAdd(this.actor.position, this.actor.size ? [this.actor.size[0] / 2, this.actor.size[1], this.actor.size[2] / 2] : [0.5, 1, 0.5])
        const centre = VectorAdd(viewPosition, forward)
        const up = NewVector3([0, 1, 0])
        return NewLookAtMatrix(viewPosition, centre, up)
    }
}

