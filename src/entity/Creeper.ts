import LivingObject from "abstract/LivingObject";
import Carry from "util/Carry";
import { contains } from "lodash";
import Role from "abstract/Role";
import HarvesterRole from "role/HarvesterRole";
import Event from "util/Event";
import EventType from "util/EventType";
import Debug from "util/Debug";

const debug = new Debug("creeper");

export interface CreeperMemory extends CreepMemory {
    role: string;
    depositing: boolean;
}

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

    public get memory(): CreeperMemory {
        return this.instance.memory as CreeperMemory;
    }

    public set memory(value: CreeperMemory) {
        (this.instance.memory as CreeperMemory) = value;
    }

    private role: Role;

    constructor(creep: Creep, memory?: CreeperMemory) {
        super(creep);
        if (memory) {
            creep.memory = memory;
        }
        this.role = new HarvesterRole(this);
    }

    public run(): void {
        this.role.run();
        if (this.instance.ticksToLive <= 1) {
            Event.dispatch(EventType.creepDead, this);
        }
    }

    public harvest(source: Source | Mineral<MineralConstant>): CreepHarvestReturnCode {
        return this.instance.harvest(source);
    }

    public unload(resource: ResourceConstant, amount?: number): CreepDropCode {
        const carry = this.carry;
        if (!amount || amount > carry.capacity) {
            amount = carry.current[resource];
        }
        return this.instance.drop(resource, amount);
    }

    public pickup(target: Resource<ResourceConstant>): CreepActionReturnCode | ERR_FULL {
        return this.instance.pickup(target);
    }

    public transfer(target: Creep | Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode {
        return this.instance.transfer(target, resourceType, amount);
    }

    public moveTo(position: RoomPosition | { pos: RoomPosition }, options?: MoveToOpts) {
        return this.instance.moveTo(position, options);
    }

    public findNearestStructure(...structureTypes: StructureConstant[]): AnyStructure {
        return this.instance.pos.findClosestByPath(FIND_STRUCTURES as FIND_STRUCTURES, {
            filter: (structure: AnyStructure) => contains(structureTypes, structure.structureType)
        });
    }
}

export type CreepDropCode = OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES;
export type CreepHarvestReturnCode = CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES;
