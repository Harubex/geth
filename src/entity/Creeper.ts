import LivingObject from "abstract/LivingObject";
import Carry from "util/Carry";
import EnergySource from "entity/EnergySource";
import Debug from "util/Debug";
import { contains } from "lodash";

const debug = new Debug("creeper");

export default class Creeper extends LivingObject<Creep> {

    public get name(): string {
        return this.instance.name;
    }

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

    private get controllerTransfer(): boolean {
        const memory = this.instance.memory as { controllerTransfer: boolean };
        if (memory.controllerTransfer === undefined) {
            memory.controllerTransfer = false;
        }
        return memory.controllerTransfer;
    }

    private set controllerTransfer(value: boolean) {
        (this.instance.memory as { controllerTransfer: boolean }).controllerTransfer = value;
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
            if (!this.controllerTransfer && spawn !== null && spawn.energy < spawn.energyCapacity) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            } else {
                const controller = this.findNearestStructure(STRUCTURE_CONTROLLER) as StructureController;
                debug.info(`Controller position: (${controller.pos.x}, ${controller.pos.y}).`);
                this.controllerTransfer = true;
                if (controller !== null) {
                    const xferRes = creep.transfer(controller, RESOURCE_ENERGY);
                    if (xferRes === ERR_NOT_IN_RANGE) {
                        creep.moveTo(controller);
                    } else if (xferRes === ERR_NOT_ENOUGH_ENERGY) {
                        this.controllerTransfer = false;
                    }
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
