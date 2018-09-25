import Role from "abstract/Role";
import Creeper from "entity/Creeper";
import Debug from "util/Debug";
import EnergySource from "entity/EnergySource";

const debug = new Debug("role/gatherer");

export default class GathererRole extends Role {

    private creep: Creeper;

    constructor(creep: Creeper) {
        super();
        this.creep = creep;
    }

    public run(): void {
        const source = EnergySource.nearest(this.creep);
        if (!this.creep.carry.full) {
            if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source);
            }
        }
        else {
            const spawn = this.creep.findNearestStructure(STRUCTURE_SPAWN) as StructureSpawn;
            if (!this.creep.memory.depositing && spawn !== null && spawn.energy < spawn.energyCapacity) {
                if (this.creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(spawn);
                }
            } else {
                const controller = this.creep.findNearestStructure(STRUCTURE_CONTROLLER) as StructureController;
                debug.info(`Controller position: (${controller.pos.x}, ${controller.pos.y}).`);
                this.creep.memory.depositing = true;
                if (controller !== null) {
                    const xferRes = this.creep.transfer(controller, RESOURCE_ENERGY);
                    if (xferRes === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(controller);
                    } else if (xferRes === ERR_NOT_ENOUGH_ENERGY) {
                        this.creep.memory.depositing = false;
                    }
                }
            }
        }
    }
}
