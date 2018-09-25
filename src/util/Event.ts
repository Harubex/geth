import Runnable from "interface/Runnable";
import Creeper from "entity/Creeper";
import Debug from "util/Debug";
import Breeder from "entity/Breeder";
import { CpuEvent, CreepEvent, SpawnEvent } from "util/EventType";

const debug = new Debug("events");

export default class Events implements Runnable {

    private static eventQueue: { name: string, data: object }[] = [];
    private static listeners: { [eventName: string]: ((data: any) => void)[] } = {};

    // #region Dispatch overloads.
    public static dispatch(eventName: SpawnEvent, spawner: Breeder): void;
    public static dispatch(eventName: CreepEvent, creeper: Creeper): void;
    public static dispatch(eventName: CpuEvent, cpu: CPU): void;
    // #endregion

    public static dispatch(eventName: string, data: object): void {
        Events.eventQueue.push({
            name: eventName,
            data
        });
    }

    // #region Dispatch overloads.
    public static addListener(eventName: SpawnEvent, listener: (spawner: Breeder) => void): void;
    public static addListener(eventName: CreepEvent, listener: (creeper: Creeper) => void): void;
    public static addListener(eventName: CpuEvent, listener: (cpu: CPU) => void): void;
    // #endregion
    public static addListener(eventName: string, listener: (data: any) => void): void {
        if (!Events.listeners[eventName]) {
            Events.listeners[eventName] = [];
        }
        Events.listeners[eventName].push(listener);
    }

    public run(): void {
        const events = Events.eventQueue;
        Events.eventQueue = [];
        if (events.length > 0) {
            debug.log(`Processing events: ${events.length} ${Events.eventQueue.length}`);
        }
        events.forEach((event) => {
            debug.log(event.name, (Events.listeners[event.name] || []).length);
            if (Events.listeners[event.name]) {
                Events.listeners[event.name].forEach((listener) => {
                    debug.log(`Calling listener for ${event.name} at game time ${Game.time}.`);
                    listener(event.data);
                });
            }
        });
    }
}
