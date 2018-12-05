import LivingObject from "abstract/LivingObject";
import Creeper, { CreeperMemory } from "entity/Creeper";
import Profile from "util/Profiler";
import Debug from "util/Debug";
import { sortBy, contains } from "lodash";
import Events from "util/Event";
import EventType from "util/EventType";
import { uniqueId, uniqueName } from "util/Identifiers";

const debug = new Debug("breeder");

/**
 * Wraps and extends spawn objects.
 */
@Profile
export default class Breeder extends LivingObject<StructureSpawn> {

    constructor(spawn: StructureSpawn) {
        super(spawn);
        debug.info(`New breeder instantiated: ${spawn.name}`);
    }

    public shouldSpawnCreeps(): boolean { // TODO: dedupe w/ courier role
        return Object.keys(Game.creeps).length < 30;
    }

    /**
     * Whether or not a creep with the specified body can currently be created.
     * @param body The body to use for this creep.
     */
    public canCreateCreep(body: BodyPartConstant[]): boolean {
        return this.instance.spawnCreep(body, uniqueId(), { dryRun: true }) === OK;
    }

    public createCreep(body: BodyPartConstant[], memory: CreeperMemory): void {
        const creepName = uniqueName();
        debug.info(`Total energy available: ${this.availableEnergy()}.`);
        const statusCode = this.instance.spawnCreep(sortBy(body), creepName, { memory });
        if (statusCode !== OK) {
            throw new Error(`Unable to create creep (error code ${statusCode}).`);
        }
        debug.info(`Spawning creep with role ${memory.role}.`);
    }

    public run() {
        const spawning = this.instance.spawning;
        if (spawning) {
            debug.info(`${spawning.remainingTime} ticks until creep is ready.`);
            // There's no 0 tick, defer it for 1 tick.
            if (spawning.remainingTime === 1) {
                Events.dispatch(EventType.creepSpawned, () => {
                    debug.info(`Creep ${spawning.name} is ready.`);
                    return new Creeper(Game.creeps[spawning.name]);
                }, 1);
            }
        } else {
            const creepBody: BodyPartConstant[] = [MOVE, CARRY, WORK, CARRY];
            if (this.shouldSpawnCreeps() && this.canCreateCreep(creepBody)) {
                this.createCreep(creepBody, {
                    role: this.nextCreepType()
                });
            }
        }
    }

    public nextCreepType(): string {
        const harvesters = Object.keys(Game.creeps).reduce((total, name) => {
            if ((Game.creeps[name].memory as CreeperMemory).role === "harvester") {
                total++;
            }
            return total;
        }, 0);
        const couriers = Object.keys(Game.creeps).reduce((total, name) => {
            if ((Game.creeps[name].memory as CreeperMemory).role === "courier") {
                total++;
            }
            return total;
        }, 0);
        return (couriers === 0 && harvesters > 0) ? "courier" : "harvester";
    }

    public availableEnergy(): number {
        const structs = this.instance.room.find(FIND_MY_STRUCTURES, {
            filter: ({structureType}) => contains([STRUCTURE_SPAWN, STRUCTURE_EXTENSION], structureType)
        }) as (StructureSpawn | StructureExtension)[];
        return structs.reduce((total, struct) => total + struct.energy, 0);
    }
}
