const enum EventType {
    /**
     * Fires when a creep has been born from a spawner.
     */
    creepSpawned = "creepspawned",
    /**
     * Fires when a creep has died though any means.
     */
    creepDead = "creepdead",
    /**
     * The extra cpu bucket has become empty.
     */
    cpuBucketEmpty = "cpubucketempty",
    /**
     * The extra cpu bucket has become full (10,000 units).
     */
    cpuBucketFull = "cpubucketfull",
    /**
     * The current tick has taken as long or longer than the current tick limit.
     */
    cpuLimitReached = "cpulimitreached",
    /**
     * A new spawn has been created.
     */
    spawnBuilt = "spawnbuilt"
}

export default EventType;

export type CpuEvent = EventType.cpuBucketEmpty | EventType.cpuBucketFull | EventType.cpuLimitReached;

export type CreepEvent = EventType.creepSpawned | EventType.creepDead;

export type SpawnEvent = EventType.spawnBuilt;
