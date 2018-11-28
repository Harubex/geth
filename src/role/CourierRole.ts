import Role from "abstract/Role";
import Creeper from "entity/Creeper";
import Debug from "util/Debug";
import EnergySource from "entity/EnergySource";

const debug = new Debug("role/courier");

export default class CourierRole extends Role {

    private creep: Creeper;

    constructor(creep: Creeper) {
        super();
        this.creep = creep;
    }

    public run(): void {
        if (this.creep.carry.current.energy === 0) {
            const source = this.creep.position.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: (resource: Resource | Source) => resource instanceof Source
            });
            if (source.resourceType !== RESOURCE_ENERGY) {
                debug.error("Unable to filter non-energy sources.");
            }
            if (this.creep.pickup(source) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source);
            }
        }
    }
}
