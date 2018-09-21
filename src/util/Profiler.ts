import { registerFN, registerClass } from "screeps-profiler";
import Settings from "geth.config";

export function Profile(target: Function): void;
export function Profile(target: object, key: string | Symbol, _descriptor: TypedPropertyDescriptor<Function>): void;
export default function Profile(target: object | Function, key?: string | Symbol, _descriptor?: TypedPropertyDescriptor<Function>): void {
    if (!Settings.enableProfiling) {
        return;
    }

    if (key) {
        // case of method decorator
        registerFN(target as Function, key as string);
        return;
    }

    // case of class decorator

    const ctor = target as any;
    if (!ctor.prototype) {
        return;
    }
    registerClass(target as Function, ctor.name);
}
