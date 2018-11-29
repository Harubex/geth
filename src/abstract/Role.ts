import Runnable from "interface/Runnable";
import Creeper from "entity/Creeper";
import Debug from "util/Debug";

const debug = new Debug("role");

/**
 * Superclass for all roles - various tasks given to creep.
 */
export default abstract class Role implements Runnable {
    protected creep: Creeper;

    protected constructor(creep: Creeper) {
        this.creep = creep;
    }

    /**
     * Encapsulates the logic necessary to execute this role.
     * @param creep The creep performing this role.
     */
    public abstract run(): void;

    protected swapRole(newRole: string) {
        debug.info(`Swapping role from ${this.creep.memory.role} to ${newRole}.`);
        this.creep.memory.role = newRole;
    }
}
