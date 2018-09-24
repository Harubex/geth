import LivingObject from "abstract/LivingObject";
import Carry from "util/Carry";
import EnergySource from "entity/EnergySource";
import { contains } from "lodash";

export default class Creeper extends LivingObject<Creep> {

    /**
     * The current carry for this creep.
     */
    public get carry(): Carry {
        return new Carry(this.instance.carry, this.instance.carryCapacity);
    }

    public get room(): Room {
        return this.instance.room;
    }

    public get position(): RoomPosition {
        return this.instance.pos;
    }

    constructor(creep: Creep, memory?: CreepMemory) {
        super(creep);
        if (memory) {
            creep.memory = memory;
        }
    }

    public run(): void {
        const creep = this.instance;
        const source = EnergySource.nearest(this);
        if (creep.carry.energy < creep.carryCapacity) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            const spawn = this.findNearestStructure(STRUCTURE_SPAWN) as StructureSpawn;
            if (spawn !== null && spawn.energy < spawn.energyCapacity) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            } else {
                const controller = this.findNearestStructure(STRUCTURE_CONTROLLER) as StructureController;
                if (controller !== null && creep.transfer(controller, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
            }
        }
    }

    private findNearestStructure(...structureTypes: StructureConstant[]): AnyStructure {
        return this.instance.pos.findClosestByPath(FIND_STRUCTURES as FIND_STRUCTURES, {
            filter: (structure: AnyStructure) => contains(structureTypes, structure.structureType)
        });
    }
}
