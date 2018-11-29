import Role from "abstract/Role";
import Creeper from "entity/Creeper";
import Harvester from "role/Harvester";
import Courier from "role/Courier";
import Builder from "role/Builder";

export default class RoleType {
    public static table: {[role: string]: (creep: Creeper) => Role} = {
        [Harvester.name.toLowerCase()]: (creep) => new Harvester(creep),
        [Courier.name.toLowerCase()]: (creep) => new Courier(creep),
        [Builder.name.toLowerCase()]: (creep) => new Builder(creep)
    };
}
