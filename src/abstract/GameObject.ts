export interface IdentifiableRoomObject extends RoomObject {
    /**
     * A unique object identifier. You can use Game.getObjectById method to retrieve an object instance by its id.
     */
    id: string;
}

/**
 * Abstract parent for all in game objects.
 */
export default abstract class GameObject<T extends IdentifiableRoomObject> {

    /**
     * A reference to this object's in game entity.
     */
    protected get instance(): T {
<<<<<<< HEAD
        return Game.getObjectById<T>(this.id);
=======
        return Game.getObjectById((this._instance as any).id);
>>>>>>> 5799ae9272031bbd68dc9b0ab5ba8927654685b3
    }

    private id: string;

    /**
     * Construct a new GameObject from the specified instance and name.
     *
     * @param instance A reference to this object's in game entity.
     */
    public constructor(instance: T) {
        if (!instance) {
            throw new Error(`A game object with the name ${name} doesn't exist.`);
        }
        this.id = instance.id;
    }
}
