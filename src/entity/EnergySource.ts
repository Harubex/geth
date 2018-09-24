import Creeper from "entity/Creeper";

export default class EnergySource {

    public static all(room: Room, active?: boolean): Source[] {
        return room.find(active ? FIND_SOURCES_ACTIVE : FIND_SOURCES);
    }

    public static nearest(creep: Creeper, active?: boolean): Source {
        return creep.position.findClosestByPath(active ? FIND_SOURCES_ACTIVE : FIND_SOURCES);
    }
}
