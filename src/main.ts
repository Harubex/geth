
import { wrap } from "screeps-profiler";
import Settings from "geth.config";
import Breeder from "entity/Breeder";
import Debug from "util/Debug";
import Creeper from "entity/Creeper";

const debug = new Debug("main/loop");
let initialized = false;

const breeders: Breeder[] = [];

function initialize(): boolean {
    for (const name in Game.spawns) {
        breeders.push(new Breeder(Game.spawns[name]));
    }
    return true;
}

function update() {
    debug.log("update");
    breeders.forEach((b) => b.run());
    for (const name in Game.creeps) {
        new Creeper(Game.creeps[name]).run();
    }
}

export function loop() {
    if (!initialized) {
        initialized = initialize();
    }
    if (Settings.enableProfiling) {
        wrap(update);
    } else {
        debug.log("loop");
        update();
    }
}
