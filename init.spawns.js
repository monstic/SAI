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
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 1;
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner = 0;
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard = 0;
                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer = 0;
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
                                var harvesterQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester;
                                if (sources === 0) {
                                    if (harvesterQty !== 0) {
                                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester = 0;
                                    }
                                }
                                else if (sources === 1) {
                                    if (harvesterQty !== 2) {
                                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester = 2;
                                    }
                                }
                                else {
                                    if (harvesterQty !== sources) {
                                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester = sources;
                                    }
                                }
                            }

                            //TRANSPORTERS
                            var transporterQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter;
                            if (Memory.rooms[spawn.pos.roomName].structure.container.controller) {
                                if (transporterQty !== 3) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter = 3;
                                }
                            }
                            else {
                                if (transporterQty !== 2) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter = 2;
                                }
                            }

                            //UPGRADERS
                            var room = Game.rooms[spawn.pos.roomName];
                            var upgraderQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader;

                            if (room.controller.level === 1) {
                                if (upgraderQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 1;
                                }
                            }
                            else if (room.controller.level === 2) {
                                if (upgraderQty !== 4) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 4;
                                }
                            }
                            else if (room.controller.level === 3) {
                                if (upgraderQty !== 3) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 3;
                                }
                            }
                            else if (room.controller.level === 4) {
                                if (upgraderQty !== 2) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 2;
                                }
                            }
                            else if (room.controller.level >= 5) {
                                if (upgraderQty !== 2) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 2;
                                }
                            }

                            //ENGINEER
                            var engineerQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer;
                            if (builds === 0 && repairs < 50) {
                              if (engineerQty !== 0) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 0;
                              }
                            }
                            else if ((builds > 0 && builds <= 5) || (repairs > 0 && repairs < 50)) {
                              if (engineerQty !== 1) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 1;
                              }
                            }
                            else {
                              if (engineerQty !== 1) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 1;
                              }
                            }

                            //MINER
                            if (Memory.rooms[spawn.pos.roomName].mineral) {
                                var minerQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner;
                                if (Memory.rooms[spawn.pos.roomName].mineral.extractor) {
                                  if (minerQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner = 1;
                                  }
                                }
                                else {
                                  if (minerQty !== 0) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner = 0;
                                  }
                                }
                            }
                            //CLAIMER
                            if (Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer === 0) {
                                if (Game.flags.claim) {
                                    var claimQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer;
                                    var flagColor = Game.flags.claim;
                                    if (flagColor.color === COLOR_BLUE && flagColor.secondaryColor === COLOR_GREEN) {
                                      if (claimQty !== 1) {
                                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer = 1;
                                      }
                                    }
                                    else {
                                      if (claimQty !== 0) {
                                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer = 0;
                                      }
                                    }
                                }
                            }

                        }

                        //POPULATE QUEUE LIST
                        var totalHarvesters = countCreeps('harvester', spawn.pos.roomName, 100);
                        if (totalHarvesters < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester) {
                            spawnProtoCreep(spawn.name, 'harvester', spawn.pos.roomName);
                        }
                        else {
                            var totalTransporters = countCreeps('transporter', spawn.pos.roomName, 100);
                            if (totalTransporters < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter) {
                              spawnProtoCreep(spawn.name, 'transporter', spawn.pos.roomName);
                            }
                            else {
                                var totalUpgraders = countCreeps('upgrader', spawn.pos.roomName, 100);
                                if (totalUpgraders < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader) {
                                  spawnProtoCreep(spawn.name, 'upgrader', spawn.pos.roomName);
                                }
                                else {
                                    var totalEngineers = countCreeps('engineer', spawn.pos.roomName, 100);
                                    if (totalEngineers < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer) {
                                        spawnProtoCreep(spawn.name, 'engineer', spawn.pos.roomName);
                                    }
                                    else {
                                        if (Memory.rooms[spawn.pos.roomName].mineral) {
                                            if (Memory.rooms[spawn.pos.roomName].mineral.extractor) {
                                                var totalMiners = countCreeps('miner', spawn.pos.roomName, 100);
                                                if (totalMiners < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner) {
                                                  spawnProtoCreep(spawn.name, 'miner', spawn.pos.roomName);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //SAVE LAST RUN
                        Memory.rooms[spawn.pos.roomName].cron[2].lastrun = Game.time;

                    }
                    //END CRON 2

                //END CRONJOBS
                }

                //LOAD MODULES
                //spawnProgress(spawn);

            }
        }
    }
};
