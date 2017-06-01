module.exports = function (spawn) {

    if (Memory.rooms) {
        if (Memory.rooms[spawn.pos.roomName]) {
            if (Memory.rooms[spawn.pos.roomName].spawns) {

                //REGISTER NEW SPAWN
                if (!Memory.rooms[spawn.pos.roomName].spawns[spawn.name] || Memory.rooms[spawn.pos.roomName].spawns[spawn.name] === undefined) {
                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name] = {};
                    //get spawn
                    var spawnObject = Game.getObjectById(spawn.id);
                    //save spawn
                    if (spawnObject) {
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name] = spawnObject;
                    }
                    console.log('Spawner ' + spawn.name + ' registered in database.');
                }

                //REGISTER SPAWN DETAILS
                if (Memory.rooms[spawn.pos.roomName].spawns[spawn.name]) {

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
                    if (!Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue || Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue === undefined) {
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue = {};
                        console.log(spawn.name + ' queue list initialized.');
                    }


                    //START CRONJOBS
                    
                    //START CRON 2 [SPAWNER]
                    if (Memory.rooms[spawn.pos.roomName].cron[2].lastrun < (Game.time-Memory.rooms[spawn.pos.roomName].cron[2].interval)) {

                        var repairs = countRepairs(spawn.pos.roomName);
                        var builds = countConstructions(spawn.pos.roomName);
                        
                        //SPAWN RULES UPDATER
                        if (Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner) {

                            //HARVESTERS
                            if (Memory.rooms[spawn.pos.roomName].sources) {
                                var sources = Memory.rooms[spawn.pos.roomName].sources.total;
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester = sources;
                            }

                            //UPGRADERS
                            var room = Game.rooms[spawn.pos.roomName];
                            if (room.controller.level > 4 && Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader < 2 && (builds < 40 || repairs < 40)) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 2;
                            }
                            if (builds >= 40 || repairs >= 40) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 1;
                            }

                            //ENGINEER
                            if (builds > 0 || (repairs > 0 && repairs < 40)) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 1;
                            }
                            if (builds >= 40 || repairs >= 40) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 2;
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
                            //CLAIMER
                            if (Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer === 0) {
                                var flagColor = Game.flags.claim;
                                if (flagColor.color === COLOR_BLUE && flagColor.secondaryColor === COLOR_GREEN) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer = 1;
                                }
                            }

                        }

                        //POPULATE QUEUE LIST
                        var totalOfNecessaryHarvesters = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester;
                        var totalSpawnedHarvesters = countCreeps('harvester', spawn.pos.roomName);
                        var totalQueuedHarvesters = countQueue('harvester', spawn.name);
                        var totalHarvesters = (totalSpawnedHarvesters+totalQueuedHarvesters);
                        if (totalHarvesters < totalOfNecessaryHarvesters) {
                            addToQueue('harvester', spawn.name);
                        }
                        var sources = Memory.rooms[spawn.pos.roomName].sources.total;
                        var totalSpawnedTransporters = countCreeps('transporter', spawn.pos.roomName);
                        var totalQueuedTransporters = countQueue('transporter', spawn.name);
                        var totalTransporters = (totalSpawnedTransporters+totalQueuedTransporters);
                        if (totalTransporters < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter && totalHarvesters >= sources) {
                            addToQueue('transporter', spawn.name);
                        }
                        //ONLY IF ROOM IS CLEAN
                        if (Memory.rooms[spawn.pos.roomName].security.underattack === 'no') {
                            var totalConstructions = countConstructions(spawn.pos.roomName);
                            var totalRepairs = countRepairs(spawn.pos.roomName);
                            if (totalConstructions > 0 || totalRepairs > 0) {
                                var totalSpawnedEngineers = countCreeps('engineer', spawn.pos.roomName);
                                var totalQueuedEngineers = countQueue('engineer', spawn.name);
                                var totalEngineers = (totalSpawnedEngineers+totalQueuedEngineers);
                                if (totalEngineers < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer && totalTransporters >= Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter) {
                                    addToQueue('engineer', spawn.name);
                                }
                            }
                            var totalSpawnedUpgraders = countCreeps('upgrader', spawn.pos.roomName);
                            var totalQueuedUpgraders = countQueue('upgrader', spawn.name);
                            var totalUpgraders = (totalSpawnedUpgraders+totalQueuedUpgraders);
                            if (totalUpgraders < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader && totalEngineers >= Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer) {
                                addToQueue('upgrader', spawn.name);
                            }
                            if (Memory.rooms[spawn.pos.roomName].mineral) {
                                if (Memory.rooms[spawn.pos.roomName].mineral.extractor) {
                                    var totalSpawnedMiners = countCreeps('miner', spawn.pos.roomName);
                                    var totalQueuedMiners = countQueue('miner', spawn.name);
                                    var totalMiners = (totalSpawnedMiners+totalQueuedMiners);
                                    if (totalMiners < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner && totalTransporters >= Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter) {
                                        addToQueue('miner', spawn.name);
                                    }
                                }
                            }
                            var totalSpawnedGuards = countCreeps('guard', spawn.pos.roomName);
                            var totalQueuedGuards = countQueue('guard', spawn.name);
                            var totalGuards = (totalSpawnedGuards+totalQueuedGuards);
                            if (totalGuards < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard && totalTransporters >= Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter) {
                                addToQueue('guard', spawn.name);
                            }
                            var totalSpawnedClaimers = countCreeps('claimer', spawn.pos.roomName);
                            var totalQueuedClaimers = countQueue('claimer', spawn.name);
                            var totalClaimers = (totalSpawnedClaimers+totalQueuedClaimers);
                            if (totalClaimers < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer && totalGuards >= Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard) {
                                var flagColor = Game.flags.claim;
                                if (flagColor.color === COLOR_BLUE && flagColor.secondaryColor === COLOR_GREEN) {
                                    var flag = Game.flags.claim;
                                    log('ok');
                                }
                                else {
                                    var flag = spawn;
                                }
                                
                                addToQueue('claimer', spawn.name, flag.pos.roomName);
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
                                    var queue_goto = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue[id].goto;
                                    var removeFromQueue = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue[id].registertime;
                                    //SPAWN
                                    var result = spawnProtoCreep(queue_spawn, queue_type, queue_goto, removeFromQueue);
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

                //END CRONJOBS
                }

                //LOAD MODULES
                spawnProgress(spawn);

            }
        }
    }
};

