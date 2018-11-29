import Role from "abstract/Role";
import Creeper, { CreeperMemory } from "entity/Creeper";
import Debug from "util/Debug";
import EnergySource from "entity/EnergySource";

const debug = new Debug("role/harvester");

export default class Harvester extends Role {

    constructor(creep: Creeper) {
        super(creep);
    }

    public run(): void {
        const source = EnergySource.nearest(this.creep);
        if (!source) {
            this.swapRole("courier");
        } else if (source.energy > 0) { // Just idle and wait for regen if empty.
            if (!this.creep.carry.full) {
                if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(source);
                }
            } else {
                this.creep.unload(RESOURCE_ENERGY);
            }
        }
    }

    private creepsOfRole(role: string) {
        return Object.keys(Game.creeps).reduce((total, name) => {
            const creep = Game.creeps[name];
            if (creep && (creep.memory as CreeperMemory).role === role) {
                total++;
            }
            return total;
        }, 0);
    }
}
