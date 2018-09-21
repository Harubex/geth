import LivingObject from "abstract/LivingObject";
import "util/Traveler";

export default class Creeper extends LivingObject<Creep> {

    constructor(creep: Creep, memory?: CreepMemory) {
        super(creep);
    }

    public run(): void {
        const creep = this.instance;
        if (creep.carry.energy < creep.carryCapacity) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.travelTo(sources[0], {ignoreCreeps: false});
            }
        }
        else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN
                    ) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(targets[0], {ignoreCreeps: false});
                }
            }
        }
    }
}
