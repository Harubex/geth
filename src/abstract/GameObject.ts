/**
 * Abstract parent for all in game objects.
 */
export default abstract class GameObject<T extends RoomObject> {

    /**
     * A reference to this object's in game entity.
     */
    protected get instance(): T {
        return Game.getObjectById((this._instance as any).id);
    }

    private _instance: T;

    /**
     * Construct a new GameObject from the specified instance and name.
     *
     * @param instance A reference to this object's in game entity.
     */
    public constructor(instance: T) {
        if (!instance) {
            throw new Error(`A game object with the name ${name} doesn't exist.`);
        }
        this._instance = instance;
    }
}
