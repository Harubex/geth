import Role from "abstract/Role";
import Creeper from "entity/Creeper";
import HarvesterRole from "role/HarvesterRole";
import CourierRole from "role/CourierRole";

export default class RoleType {
    public static table: {[role: string]: (creep: Creeper) => Role} = {
        harvester: (creep) => new HarvesterRole(creep),
        courier: (creep) => new CourierRole(creep)
    };
}