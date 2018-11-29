import Debug from "util/Debug";
import Role from "abstract/Role";
import Creeper from "entity/Creeper";

const debug = new Debug("role/courier", false);

export default class CourierRole extends Role {

    constructor(creep: Creeper) {
        super(creep);
    }

    public run(): void {
        if (this.creep.memory.depositing) {
            const code = this.creep.upgrade();
            if (code === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.creep.room.controller);
            } else if (code === ERR_NOT_ENOUGH_RESOURCES) {
                this.creep.memory.depositing = false;
            }
        } else if (!this.creep.carry.full) {
            const source = this.creep.position.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: (resource: Resource | Source) => resource instanceof Resource
            });
            if (source) {
                if (source.resourceType !== RESOURCE_ENERGY) {
                    debug.error("Unable to filter non-energy sources.");
                }
                if (this.creep.pickup(source) === ERR_NOT_IN_RANGE) {
                    debug.info("Moving to source.");
                    this.creep.moveTo(source);
                }
            } else {
                const tombstone = this.creep.position.findClosestByPath(FIND_TOMBSTONES);
                if (tombstone && tombstone.store.energy) {
                    if (this.creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(tombstone);
                    }
                } else {
                    debug.info("No resources to pickup.");
                    this.swapRole("harvester");
                }
            }
        } else {
            if (this.shouldSpawnCreeps()) {
                debug.info("Depositing at spawn.");
                const spawn = this.creep.position.findClosestByPath(FIND_MY_SPAWNS);
                if (this.creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(spawn);
                }
            } else {
                debug.info("Depositing at controller.");
                this.creep.memory.depositing = true;
            }
        }
    }
    private shouldSpawnCreeps(): boolean { // TODO: dedupe w/ breeder
        return Object.keys(Game.creeps).length < 30;
    }
}
