import Role from "abstract/Role";
import Creeper from "entity/Creeper";
import Debug from "util/Debug";
import EnergySource from "entity/EnergySource";

const debug = new Debug("role/harvester");

export default class HarvesterRole extends Role {

    private creep: Creeper;

    constructor(creep: Creeper) {
        super();
        this.creep = creep;
    }

    public run(): void {
        const source = EnergySource.nearest(this.creep);
        // Just idle and wait for regen if empty.
        if (source.energy > 0) {
            if (!this.creep.carry.full) {
                if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(source);
                }
            } else {
                this.creep.unload(RESOURCE_ENERGY);
            }
        }
    }
}
