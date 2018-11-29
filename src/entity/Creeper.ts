import LivingObject from "abstract/LivingObject";
import Carry from "util/Carry";
import { contains } from "lodash";
import Role from "abstract/Role";
import RoleType from "util/RoleType";
import Event from "util/Event";
import EventType from "util/EventType";
import Debug from "util/Debug";

const debug = new Debug("creeper");

export interface CreeperMemory extends CreepMemory {
    role: string;
    depositing?: boolean;

    sourceId?: string;
}

export default class Creeper extends LivingObject<Creep> {

    // #region Properties
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
        if (!this.instance.memory) {
            this.instance.memory = {};
            debug.warn(`Memory blank for creep with name ${this.instance!.name}`);
        }
        return this.instance.memory as CreeperMemory;
    }

    public set memory(value: CreeperMemory) {
        (this.instance.memory as CreeperMemory) = value;
    }

    private get role(): Role {
        return RoleType.table[this.memory.role](this);
    }

    // #endregion

    constructor(creep: Creep, memory?: CreeperMemory) {
        super(creep);
        memory = memory ? memory : Game.creeps[creep.name].memory as CreeperMemory;
        if (!memory.role) {
            memory.role = "harvester";
        }
        debug.info(`Setting creep role to ${memory.role}.`);
        creep.memory = memory;
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

    public withdraw(target: Structure<StructureConstant> | Tombstone, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode {
        return this.instance.withdraw(target, resourceType, amount);
    }

    public upgrade(target?: StructureController): ScreepsReturnCode {
        if (!target) {
            return this.upgrade(this.instance.room.controller);
        }
        return this.instance.upgradeController(target);
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
