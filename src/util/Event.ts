import Creeper from "entity/Creeper";
import Debug from "util/Debug";
import Breeder from "entity/Breeder";
import { CpuEvent, CreepEvent, SpawnEvent } from "util/EventType";

const debug = new Debug("events");

export default class Events { // TODO: add events to memory if possible.

    private static eventQueue: { event: string, data: object, delay: number }[] = [];
    private static listeners: { [event: string]: ((data: any) => void)[] } = {};

    // #region Dispatch overloads.
    public static dispatch(event: SpawnEvent, spawner: Breeder, delay?: number): void;
    public static dispatch(event: CreepEvent, creeper: Creeper): void;
    public static dispatch(event: CreepEvent, cb: () => Creeper, delay: number): void;
    public static dispatch(event: CpuEvent, cpu: CPU, delay?: number): void;
    // #endregion

    public static dispatch(event: string, data: any, delay: number = 0): void {
        debug.info(`Queuing event ${event} with ${delay} tick delay`);
        Events.eventQueue.push({ event, data, delay: Game.time + delay });
    }

    // #region Dispatch overloads.
    public static addListener(event: SpawnEvent, listener: (spawner: Breeder) => void): void;
    public static addListener(event: CreepEvent, listener: (creeper: Creeper) => void): void;
    public static addListener(event: CpuEvent, listener: (cpu: CPU) => void): void;
    // #endregion
    public static addListener(event: string, listener: (data: any) => void): void {
        debug.info(`Listener added for event ${event}.`);
        if (!Events.listeners[event]) {
            Events.listeners[event] = [];
        }
        Events.listeners[event].push(listener);
    }

    public static run(): void {
        const events = Events.eventQueue;
        Events.eventQueue = [];
        if (events.length > 0) {
            debug.log(`Processing events: ${events.length} ${Events.eventQueue.length}`);
        }
        events.forEach(({event, data, delay}) => {
            debug.log(event, (Events.listeners[event] || []).length);
            if (Events.listeners[event]) {
                if (Game.time < delay) {
                    debug.info(`Readding event - time ${Game.time} of ${delay}`);
                    Events.eventQueue.push({event, data, delay});
                } else {
                    Events.listeners[event].forEach((listener) => {
                        debug.log(`Calling listener for ${event} at game time ${Game.time}.`);
                        if (typeof (data) === "function") {
                            data = data();
                        }
                        listener(data);
                    });
                }
            }
        });
    }
}
