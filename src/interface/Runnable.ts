export default interface IRunnable<T = void, U = void> {
    run(arg: T): U;
}
