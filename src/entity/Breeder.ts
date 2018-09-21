import LivingObject from "abstract/LivingObject";
import Creeper from "entity/Creeper";
import Profile from "util/Profiler";
import Debug from "util/Debug";
import { sortBy, uniqueId } from "lodash";

const debug = new Debug("entity/breeder");

/**
 * Wraps and extends spawn objects.
 */
@Profile
export default class Breeder extends LivingObject<StructureSpawn> {

    constructor(spawn: StructureSpawn) {
        super(spawn);
        debug.info(`New breeder instantiated: ${spawn.name}`);
    }

    /**
     * Whether or not a creep with the specified body can currently be created.
     * @param body The body to use for this creep.
     */
    public canCreateCreep(body: BodyPartConstant[]): boolean {
        return this.instance.spawnCreep(body, uniqueId(), {dryRun: true}) === OK;
    }

    public createCreep(body: BodyPartConstant[], name?: string, memory?: CreepMemory): Creeper {
        const creepName = name || uniqueId();
        const statusCode = this.instance.spawnCreep(sortBy(body), creepName, { memory });
        if (statusCode !== OK) {
            throw new Error(`Unable to create creep (error code ${statusCode}).`);
        }
        return new Creeper(Game.creeps[creepName], memory);
    }

    public run() {
        if (this.canCreateCreep([MOVE, WORK, MOVE, CARRY])) {
            this.createCreep([MOVE, WORK, MOVE, CARRY]);
        }
    }
}