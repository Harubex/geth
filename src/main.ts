
import { wrap } from "screeps-profiler";
import Settings from "geth.config";
import Breeder from "entity/Breeder";
import Creeper from "entity/Creeper";
import Debug from "util/Debug";

const debug = new Debug("main/loop");
let initialized = false;

const breeders: Breeder[] = [];

let update: Function = () => {
    breeders.forEach((b) => b.run());
    for (const name in Game.creeps) {
        new Creeper(Game.creeps[name]).run();
    }
};

function initialize(): boolean {
    for (const name in Game.spawns) {
        breeders.push(new Breeder(Game.spawns[name]));
    }
    if (Settings.enableProfiling) {
        update = wrap(update);
    }

    return true;
}

export async function loop() {
    if (!initialized) {
        initialized = initialize();
    }
    update();
}
