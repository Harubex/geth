export default class Hitpoints {

    public get current(): number {
        return this._current;
    }

    public get maximum(): number {
        return this._maximum;
    }

    public get percentage(): number {
        return this._current / this._maximum;
    }

    private _current: number;
    private _maximum: number;

    constructor(current: number, maximum: number) {
        this._current = current;
        this._maximum = maximum;
    }
}
