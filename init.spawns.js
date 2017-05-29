module.exports = function (spawn) {

    if (Memory.rooms) {
        if (Memory.rooms[spawn.pos.roomName]) {
            if (Memory.rooms[spawn.pos.roomName].spawns) {

                //LOAD MODULES
                spawnProgress(spawn);

                //REGISTER NEW SPAWN
                if (!Memory.rooms[spawn.pos.roomName].spawns[spawn.name] || Memory.rooms[spawn.pos.roomName].spawns[spawn.name] === undefined) {
                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name] = {};
                    console.log('Spawner ' + spawn.name + ' registered in database.');
                }

                //REGISTER SPAWN DETAILS
                if (Memory.rooms[spawn.pos.roomName].spawns[spawn.name]) {
                    //get spawn object
                    var spawnObject = Game.getObjectById(spawn.id);
                    //save spawn id
                    if (spawnObject) {
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name] = spawnObject;
                    }

                    //CREATE SPAWN RULES
                    if (!Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner || Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner === undefined) {
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner = {};
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester = 1;
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter = 3;
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 1;
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 0;
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner = 0;
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard = 0;
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer = 0;
                    }

                    //CREATE QUEUE LIST
                    if (!Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue) {
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue = {};
                        console.log(spawn.name + ' queue list initialized.');
                    }


                    //START CRON 2 [SPAWNER]
                    if (Memory.rooms[spawn.pos.roomName].cron[2].lastrun < (Game.time-Memory.rooms[spawn.pos.roomName].cron[2].interval)) {

                        //SPAWN RULES UPDATER
                        if (Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner) {

                            //PARASITES
                            if (Memory.rooms[spawn.pos.roomName].sources) {
                                var sources = Memory.rooms[spawn.pos.roomName].sources.total;
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester = sources;
                            }

                            //ENGINEER
                            var repairs = countRepairs(spawn.pos.roomName);
                            var builds = countConstructions(spawn.pos.roomName);
                            if (builds > 0 || repairs > 0) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 1;
                            }
                            else {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 0;
                            }

                            //MINER
                            if (Memory.rooms[spawn.pos.roomName].mineral) {
                                if (Memory.rooms[spawn.pos.roomName].mineral.extractor) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner = 1;
                                }
                                else {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner = 0;
                                }
                            }
                        }

                        //POPULATE QUEUE LIST
                        var i = 0;
                        if (i === 0) {
                            var totalOfNecessaryHarvesters = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester;
                            var totalSpawnedHarvesters = countCreeps('harvester', spawn.pos.roomName);
                            var totalQueuedHarvesters = countQueue('harvester', spawn.name);
                            var totalHarvesters = (totalSpawnedHarvesters+totalQueuedHarvesters);
                            if (totalHarvesters < totalOfNecessaryHarvesters) {
                                addToQueue('harvester', spawn.name);
                                i++;
                            }
                        }
                        if (i === 0) {
                            var sources = Memory.rooms[spawn.pos.roomName].totalsources;
                            var totalSpawnedTransporters = countCreeps('transporter', spawn.pos.roomName);
                            var totalQueuedTransporters = countQueue('transporter', spawn.name);
                            var totalTransporters = (totalSpawnedTransporters+totalQueuedTransporters);
                            if (totalTransporters < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter && totalHarvesters >= sources) {
                                addToQueue('transporter', spawn.name);
                                i++;
                            }
                        }
                        if (Memory.rooms[spawn.pos.roomName].security.underattack === 'no') {
                            if (i === 0) {
                                var totalConstructions = countConstructions(spawn.pos.roomName);
                                var totalRepairs = countRepairs(spawn.pos.roomName);
                                if (totalConstructions > 0 || totalRepairs > 0) {
                                    var totalSpawnedEngineers = countCreeps('engineer', spawn.pos.roomName);
                                    var totalQueuedEngineers = countQueue('engineer', spawn.name);
                                    var totalEngineers = (totalSpawnedEngineers+totalQueuedEngineers);
                                    if (totalEngineers < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer && totalTransporters >= Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter) {
                                        addToQueue('engineer', spawn.name);
                                        i++;
                                    }
                                }
                            }
                            if (i === 0) {
                                var totalSpawnedUpgraders = countCreeps('upgrader', spawn.pos.roomName);
                                var totalQueuedUpgraders = countQueue('upgrader', spawn.name);
                                var totalUpgraders = (totalSpawnedUpgraders+totalQueuedUpgraders);
                                if (totalUpgraders < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader && totalEngineers >= Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer) {
                                    addToQueue('upgrader', spawn.name);
                                    i++;
                                }
                            }
                            if (i === 0) {
                                if (Memory.rooms[spawn.pos.roomName].mineral) {
                                    if (Memory.rooms[spawn.pos.roomName].mineral.extractor) {
                                        var totalSpawnedMiners = countCreeps('miner', spawn.pos.roomName);
                                        var totalQueuedMiners = countQueue('miner', spawn.name);
                                        var totalMiners = (totalSpawnedMiners+totalQueuedMiners);
                                        if (totalMiners < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner && totalTransporters >= Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter) {
                                            addToQueue('miner', spawn.name);
                                            i++;
                                        }
                                    }
                                }
                            }
                            if (i === 0) {
                                var totalSpawnedGuards = countCreeps('guard', spawn.pos.roomName);
                                var totalQueuedGuards = countQueue('guard', spawn.name);
                                var totalGuards = (totalSpawnedGuards+totalQueuedGuards);
                                if (totalGuards < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard && totalTransporters >= Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter) {
                                    addToQueue('guard', spawn.name);
                                    i++;
                                }
                            }
                            if (i === 0) {
                                var totalSpawnedClaimers = countCreeps('claimer', spawn.pos.roomName);
                                var totalQueuedClaimers = countQueue('claimer', spawn.name);
                                var totalClaimers = (totalSpawnedClaimers+totalQueuedClaimers);
                                if (totalClaimers < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer && totalGuards >= Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard) {
                                    addToQueue('claimer', spawn.name);
                                    i++;
                                }
                            }
                        }

                        //RUN QUEUE LIST
                        var totalList = countQueue('all', spawn.name);
                        if (totalList > 0) {
                            var i = 0;
                            for (var id in Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue) {
                                if (i === 0) {
                                    //LOAD VARIABLES
                                    var queue_spawn = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue[id].spawnname;
                                    var queue_type = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue[id].type;
                                    var queue_firstaction = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue[id].firstaction;
                                    var removeFromQueue = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue[id].registertime;
                                    //SPAWN
                                    var result = spawnProtoCreep(queue_spawn, queue_type, queue_firstaction, removeFromQueue);
                                    //SHOW RESULT
                                    if (result) {
                                        console.log(result);
                                    }
                                }
                                i++;
                            }
                        }

                        //SAVE LAST RUN
                        Memory.rooms[spawn.pos.roomName].cron[2].lastrun = Game.time;

                    }
                    //END CRON 2

                }
            }
        }
    }
};



