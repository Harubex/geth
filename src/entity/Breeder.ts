import LivingObject from "abstract/LivingObject";
import Creeper, { CreeperMemory } from "entity/Creeper";
import Profile from "util/Profiler";
import Debug from "util/Debug";
import { sortBy, uniqueId } from "lodash";
import Events from "util/Event";
import EventType from "util/EventType";

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
        return this.instance.spawnCreep(body, uniqueId(), {dryRun: true}) === OK;
    }

    public createCreep(body: BodyPartConstant[], memory: CreeperMemory): void {
        debug.info(`Spawning creep with role ${memory.role}.`);
        const creepName = uniqueId(String(Game.time));
        const statusCode = this.instance.spawnCreep(sortBy(body), creepName, { memory });
        if (statusCode !== OK) {
            throw new Error(`Unable to create creep (error code ${statusCode}).`);
        }
        Events.dispatch(EventType.creepSpawned, () => {
            debug.info(`Creep spawned with name ${creepName}`);
            return new Creeper(Game.creeps[creepName], memory);
        }, 1 + body.length * CREEP_SPAWN_TIME);
    }

    public run() {
        const creepBody: BodyPartConstant[] = [MOVE, CARRY, WORK, CARRY];
        if (this.shouldSpawnCreeps() && this.canCreateCreep(creepBody)) {
            this.createCreep(creepBody, {
                role: this.nextCreepType()
            });
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
}
