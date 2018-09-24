import Role from "abstract/Role";
import Creeper from "entity/Creeper";

export default abstract class GathererRole extends Role {

    public run(creep: Creeper): RoomPosition {
        return null;
    }
}
