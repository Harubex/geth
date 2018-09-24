import { forOwn } from "lodash";

/**
 * A structure for properties relating to a creep's current carry.
 */
export default class Carry {
    /**
     * The current quantity carried.
     */
    public get current(): StoreDefinition {
        return this._current;
    }

    /**
     * The maximum amount carryable.
     */
    public get capacity(): number {
        return this._capacity;
    }

    /**
     * How much capacity is being used, expressed as a percentage.
     */
    public get percent(): number {
        let total = 0;
        forOwn(this._current, (qty) => total += (qty as number));
        return total / this._capacity;
    }

    private _current: StoreDefinition;
    private _capacity: number;

    public constructor(current: StoreDefinition, capacity: number) {
        this._current = current;
        this._capacity = capacity;
    }
}
