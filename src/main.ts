
import { wrap } from "screeps-profiler";
import Settings from "geth.config";
import Breeder from "entity/Breeder";
import Creeper from "entity/Creeper";
import Debug from "util/Debug";
import Event from "util/Event";
import EventType from "util/EventType";
import { remove } from "lodash";

const debug = new Debug("main/loop");
let initialized = false;

const breeders: Breeder[] = [];
const creepers: Creeper[] = [];

Event.addListener(EventType.creepSpawned, (creeper: Creeper) => {
    debug.log(`A new creep was born. His name is ${creeper.name}.`);
    creepers.push(creeper);
});

Event.addListener(EventType.creepDead, (creeper) => {
    debug.log(`A creep has died. His name was ${creeper.name}.`);
    remove(creepers, (c) => c.name === creeper.name);
});

let update: Function = () => {
    breeders.forEach((b) => b.run());
    creepers.forEach((c) => c.run());
};

function initialize(): boolean {
    if (Object.keys(Game.spawns).length === 0) {
        return false;
    }
    for (const name in Game.creeps) {
        creepers.push(new Creeper(Game.creeps[name]));
    }
    for (const name in Game.spawns) {
        breeders.push(new Breeder(Game.spawns[name]));
    }
    if (Settings.enableProfiling) {
        update = wrap(update);
    }
    return true;
}

export function loop() {
    if (!initialized) {
        initialized = initialize();
    }
    update();
}
