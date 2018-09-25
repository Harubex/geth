import Runnable from "interface/Runnable";
import Creeper from "entity/Creeper";

/**
 * Superclass for all roles - various tasks given to creep.
 */
export default abstract class Role implements Runnable {

    /**
     * Encapsulates the logic necessary to execute this role.
     * @param creep The creep performing this role.
     */
    public abstract run(): void;
}
