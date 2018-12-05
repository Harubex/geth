import Creeper from "entity/Creeper";
import GameObject from "abstract/GameObject";
import Carry from "util/Carry";

export default class EnergySource extends GameObject<Source> {

    public get available(): number {
        return this.instance.energy / this.instance.energyCapacity;
        // return new Carry(this.instance.energy, this.instance.energyCapacity);
    }

    constructor(source: Source) {
        super(source);
    }

    public static all(room: Room, active?: boolean): Source[] {
        return room.find(active ? FIND_SOURCES_ACTIVE : FIND_SOURCES);
    }

    public static nearest(creep: Creeper, active?: boolean): Source {
        return creep.position.findClosestByPath(active ? FIND_SOURCES_ACTIVE : FIND_SOURCES);
    }

    public spaces(): number {
        const { pos } = this.instance;
        const terrain = new Room.Terrain(pos.roomName);
        let total = 0;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                // It should always count itself (+0, +0) as a wall.
                if (terrain.get(pos.x + x, pos.y + y) !== TERRAIN_MASK_WALL) {
                    total++;
                }
            }
        }
        return total;
    }
}
