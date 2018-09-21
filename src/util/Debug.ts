import { escape } from "lodash";

type StyleRules = { [rule: string]: string };
type MessageValue = number | string | any[] | object | Error;

export default class Debug {

    /**
     * Sets the styles to use for this debug instance. Styles previously set will be overwritten.
     */
    public set styles(styles: StyleRules) {
        this._styles = Object.assign(this._styles, styles);
    }

    private static messageCache: { [msg: string]: number } = {};
    private static cacheTimeout = 60000;

    private context: string;
    private _styles: StyleRules;

    private disableCache: boolean;

    constructor(context: string, styles: StyleRules = {}, disableCache: boolean = false) {
        this.context = context;
        this._styles = styles;
        this.disableCache = disableCache;
    }

    public error(...messages: MessageValue[]) {
        Debug.writeMessages(this.context, Object.assign(this._styles, { color: "red" }), this.disableCache, messages);
    }

    public warn(...messages: MessageValue[]) {
        Debug.writeMessages(this.context, Object.assign(this._styles, { color: "yellow" }), this.disableCache, messages);
    }

    public log(...messages: MessageValue[]) {
        Debug.writeMessages(this.context, Object.assign(this._styles, { color: "white" }), this.disableCache, messages);
    }

    public info(...messages: MessageValue[]) {
        Debug.writeMessages(this.context, Object.assign(this._styles, { color: "lightblue" }), this.disableCache, messages);
    }

    private static writeMessages(context: string, styles: StyleRules, disableCache: boolean, ...messages: MessageValue[]): void {
        let style = "";
        for (const rule in styles) {
            style += `${rule}: ${styles[rule]};`;
        }
        const message = `<span style="${style}">${messages.reduce(Debug.stringifyConcat)}</span>`;
        const now = Date.now();
        if (!disableCache) {
            if (Debug.messageCache[message]) {
                if ((now - Debug.messageCache[message]) > this.cacheTimeout) {
                    Debug.messageCache[message] = now;
                } else {
                    return;
                }
            } else {
                Debug.messageCache[message] = now;
            }
        }
        // tslint:disable-next-line:no-console
        console.log(`(<span style="color: ${Debug.colorHash(context)}">${context}</span>):`, message);
    }

    /**
     * Generates a reasonable color from the provided input.
     * @param input The string to hash.
     * @returns The hashed color, represented as a color hex.
     */
    private static colorHash(input: string): string {
        if (!Memory.colorCache) {
            Memory.colorCache = {};
        }
        if (!Memory.colorCache[input]) {
            let sum = 0;
            for (let i = 0; i < input.length; i++) {
                sum += input.charCodeAt(i);
            }
            let hex = "#";
            for (let i = 1; i <= 3; i++) {
                // What
                hex += ("00" + Math.round(Number("." + Math.sin(sum + i).toString().substr(6)) * 256).toString(14 + i * 2)).substr(-2, 2);
            }
            Memory.colorCache[input] = hex;
        }
        return Memory.colorCache[input];
    }

    /**
     * Stringifies the provided message value, and appends it to the specified message.
     * @param message The message to append to.
     * @param value The value to append.
     * @returns The concatenated string.
     */
    private static stringifyConcat(message: string, value: MessageValue): string {
        if (typeof (value) === "object") {
            if (value instanceof Error) {
                value = `${value.toString()}\n${value.stack}`;
            } else {
                value = JSON.stringify(value, null, 4);
            }
        }
        return `${message} ${escape(value.toString())}`;
    }
}

/**
 * A default debug instance.
 */
export const logger = new Debug("default");
