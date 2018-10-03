import GameObject from "abstract/GameObject";
import Hittable from "interface/Hittable";
import Runnable from "interface/Runnable";
import Hitpoints from "util/Hitpoints";

export interface LivingObjectType extends RoomObject {
    hits: number;
    hitsMax: number;
}

/**
 * Abstract parent for all living in game objects (things that can run, things that can die).
 */
export default abstract class LivingObject<T extends LivingObjectType, U = void, V = void> extends GameObject<T> implements Hittable, Runnable<U, V> {

    /**
     * A structure containing life totals and metrics for this entity.
     */
    public get hp(): Hitpoints {
        return new Hitpoints(this.instance.hits, this.instance.hitsMax);
    }

    /**
     * The action to take for the current game tick.
     */
    public abstract run(arg: U): V;
}
