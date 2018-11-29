import Role from "abstract/Role";
import Creeper from "entity/Creeper";
import Debug from "util/Debug";

const debug = new Debug("role/builder");

export default class Builder extends Role {

    constructor(creep: Creeper) {
        super(creep);
    }

    public run(): void {
        const site = this.creep.position.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (!site) {
            this.swapRole("courier");
        } else {
            if (this.creep.build(site) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(site);
            }
        }
    }
}
