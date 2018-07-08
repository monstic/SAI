                    //REGISTER STORAGES NEAR MINERAL
                    if (Memory.rooms[room.name].structure.storage) {
                        if (!Memory.rooms[room.name].structure.storage.mineral || Memory.rooms[room.name].structure.storage.mineral === 'undefined') {
                            if (Memory.rooms[room.name].mineral) {
                                var mineral = Game.getObjectById(Memory.rooms[room.name].mineral.id);
                                var mineralpos = new RoomPosition(mineral.pos.x, mineral.pos.y, room.name);
                                var storage = mineralpos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (s.structureType === STRUCTURE_STORAGE)});
                                if (storage[0]) {
                                    Memory.rooms[room.name].structure.storage.mineral = storage[0].id;
                                }
                            }
                        }
                    }


                //REGISTER AVAILABLE MINERALS
                if (!Memory.rooms[room.name].mineral || Memory.rooms[room.name].mineral === 'undefined') {
                    var findMinerals = room.find(FIND_MINERALS);
                    if (findMinerals.length > 0) {
                        Memory.rooms[room.name].mineral = {};
                        Memory.rooms[room.name].mineral.id = findMinerals[0].id;
                        console.log('Mineral type ' + findMinerals[0].mineralType + ' was found in room ' + room.name + '.');
                    }
                }

                //REGISTER AVAILABLE SOURCES
                if (!Memory.rooms[room.name].sources || Memory.rooms[room.name].sources === 'undefined') {
                    var findSources = room.find(FIND_SOURCES);
                    if (findSources.length > 0) {
                        Memory.rooms[room.name].sources = {};
                        Memory.rooms[room.name].sources.total = findSources.length;
                        console.log('Found ' + findSources.length + ' source(s) in room ' + room.name + '.');
                        i = 0;
                        while (i < findSources.length) {
                            Memory.rooms[room.name].sources[i] = findSources[i].id;
                            console.log('Source ' + findSources[i].id + ' registered in room ' + room.name + '.');
                            i++;
                        }
                    }
                }

                //REGISTER STRUCTURES
                if (Memory.rooms[room.name].structure) {

                    //REGISTER CONSTRUCTION SITE TO BUILD SPAWN
                    var spawnExist = room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_SPAWN)});
                    if (spawnExist === 0) {
                        var csSpawnExist = room.find(FIND_CONSTRUCTION_SITES);
                        if (csSpawnExist > 0) {
                            Memory.constructionSite = csSpawnExist[0];
                        }
                    }


                    //REGISTER EXTRACTOR
                    if (Memory.rooms[room.name].mineral) {
                        if (!Memory.rooms[room.name].mineral.extractor || Memory.rooms[room.name].mineral.extractor === 'undefined') {
                            var extractor = room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_EXTRACTOR)});
                            if (extractor.length > 0) {
                                Memory.rooms[room.name].mineral.extractor = extractor[0].id;
                            }
                        }
                        if (Memory.rooms[room.name].mineral.extractor) {
                            var extractor = Game.getObjectById(Memory.rooms[room.name].mineral.extractor);
                            if (!extractor || extractor === 'undefined') {
                                delete Memory.rooms[room.name].mineral.extractor;
                            }
                        }
                    }

                    //REGISTER CONTAINER NEAR CONTROLLER
                    if (Memory.rooms[room.name].structure.container) {
                        if (!Memory.rooms[room.name].structure.container.controller || Memory.rooms[room.name].structure.container.controller === 'undefined') {
                            var controller = new RoomPosition(room.controller.pos.x, room.controller.pos.y, room.name);
                            var container = controller.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (s.structureType === STRUCTURE_CONTAINER)});
                            if (container[0]) {
                                Memory.rooms[room.name].structure.container.controller = container[0].id;
                            }
                        }
                        if (Memory.rooms[room.name].structure.container.controller) {
                            var container = Game.getObjectById(Memory.rooms[room.name].structure.container.controller);
                            if (!container || container === 'undefined') {
                                delete Memory.rooms[room.name].structure.container.controller;
                            }
                        }
                    }

                    //REGISTER CONTAINER NEAR SOURCE 0
                    if (Memory.rooms[room.name].structure.container) {
                        if (!Memory.rooms[room.name].structure.container.source || Memory.rooms[room.name].structure.container.source === 'undefined') {
                            var sourceId = Memory.rooms[room.name].sources[0];
                            var sourceStr = Game.getObjectById(sourceId);
                            var source = new RoomPosition(sourceStr.pos.x, sourceStr.pos.y, room.name);
                            var container = source.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (s.structureType === STRUCTURE_CONTAINER)});
                            if (container[0]) {
                                Memory.rooms[room.name].structure.container.source = container[0].id;
                            }
                        }
                        if (Memory.rooms[room.name].structure.container.source) {
                            var container = Game.getObjectById(Memory.rooms[room.name].structure.container.source);
                            if (!container || container === 'undefined') {
                                delete Memory.rooms[room.name].structure.container.source;
                            }
                        }
                    }

                    //REGISTER CONTAINER NEAR SOURCE 1
                    if (Memory.rooms[room.name].structure.container) {
                        if (!Memory.rooms[room.name].structure.container.source1 || Memory.rooms[room.name].structure.container.source1 === 'undefined') {
                            if (Memory.rooms[room.name].sources[1]) {
                                var sourceId = Memory.rooms[room.name].sources[1];
                                var sourceStr = Game.getObjectById(sourceId);
                                var source = new RoomPosition(sourceStr.pos.x, sourceStr.pos.y, room.name);
                                var container = source.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (s.structureType === STRUCTURE_CONTAINER)});
                                if (container[0]) {
                                    Memory.rooms[room.name].structure.container.source1 = container[0].id;
                                }
                            }
                        }
                        if (Memory.rooms[room.name].structure.container.source1) {
                            var container = Game.getObjectById(Memory.rooms[room.name].structure.container.source1);
                            if (!container || container === 'undefined') {
                                delete Memory.rooms[room.name].structure.container.source1;
                            }
                        }
                    }


                    //REGISTER TOWERS
                    if (Memory.rooms[room.name].structure.tower) {
                        var towers = room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_TOWER)});
                        if (towers.length > 0) {
                            Memory.rooms[room.name].structure.tower.total = towers.length;
                            var i = 0;
                            while (i < towers.length) {
                                if (!Memory.rooms[room.name].structure.tower[i] || Memory.rooms[room.name].structure.tower[i] === 'undefined') {
                                    Memory.rooms[room.name].structure.tower[i] = towers[i].id;
                                }
                                if (Memory.rooms[room.name].structure.tower[i]) {
                                    var towers = Game.getObjectById(Memory.rooms[room.name].structure.tower[i]);
                                    if (!towers || towers === 'undefined') {
                                        delete Memory.rooms[room.name].structure.tower[i];
                                    }
                                }
                                i++;
                            }
                        }
                    }

                    //REGISTER LINKS
                    if (Memory.rooms[room.name].structure.link) {
                        var link = room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_LINK)});
                        if (link.length > 0) {
                            Memory.rooms[room.name].structure.link.total = link.length;
                            var i = 0;
                            while (i < link.length) {
                                if (!Memory.rooms[room.name].structure.link[i] || Memory.rooms[room.name].structure.link[i] === 'undefined') {
                                    Memory.rooms[room.name].structure.link[i] = link[i].id;
                                }
                                if (Memory.rooms[room.name].structure.link[i]) {
                                    var link = Game.getObjectById(Memory.rooms[room.name].structure.link[i]);
                                    if (!link || link === 'undefined') {
                                        delete Memory.rooms[room.name].structure.link[i];
                                    }
                                }
                                i++;
                            }
                        }
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
                                    if (harvesterQty !== 4) {
                                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester = 4;
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
                            if (Memory.rooms[spawn.pos.roomName].structure.container.source) {
                                if (transporterQty !== 2) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter = 2;
                                }
                            }
                            else {
                                if (transporterQty !== 0) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter = 0;
                                }
                            }

                            //GUARDS
                            var guardQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard;
                            if (Memory.rooms[spawn.pos.roomName].security.underattack === 'yes') {
                                if (guardQty !== 2) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard = 2;
                                }
                            }
                            else {
                                if (guardQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard = 1;
                                }
                            }

                            //HEALERS
                            var healerQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.healer;
                            if (healerQty !== 1) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.healer = 1;
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
                                if (upgraderQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 1;
                                }
                            }
                            else if (room.controller.level === 3) {
                                if (upgraderQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 1;
                                }
                            }
                            else if (room.controller.level === 4) {
                                if (upgraderQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 1;
                                }
                            }
                            else if (room.controller.level >= 5) {
                                if (upgraderQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 3;
                                }
                            }

                            //ENGINEER
                            var engineerQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer;
                            if (builds === 0 && repairs < 10) {
                              if (engineerQty !== 0) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 0;
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
                            var claimQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer;
                            if (Game.flags.claim) {
                                if (Game.glc > 1) {
                                    if (claimQty !== 1) {
                                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer = 1;
                                    }
                                }
                                if (claimQty !== 0) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer = 0;
                                }
                            }
                            else {
                                if (claimQty !== 0) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer = 0;
                                }
                            }
                        }

                        //POPULATE QUEUE LIST
                        var totalHarvesters = countCreeps('harvester', spawn.pos.roomName, 100);
                        if (totalHarvesters < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester) {
                            spawnProtoCreep(spawn.name, 'harvester', spawn.pos.roomName);
                        }
                        else {
                            var totalUpgraders = countCreeps('upgrader', spawn.pos.roomName, 100);
                            if (totalUpgraders < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader) {
                                spawnProtoCreep(spawn.name, 'upgrader', spawn.pos.roomName);
                            }
                            else {
                                var totalTransporters = countCreeps('transporter', spawn.pos.roomName, 100);
                                if (totalTransporters < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter && Game.rooms[spawn.pos.roomName].controller.level > 1) {
                                    spawnProtoCreep(spawn.name, 'transporter', spawn.pos.roomName);
                                }
                                else {
                                    var totalClaimers = countCreeps('claimer', spawn.pos.roomName, 100);
                                    if (totalClaimers < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer && Game.rooms[spawn.pos.roomName].controller.level > 4) {
                                        spawnProtoCreep(spawn.name, 'claimer', spawn.pos.roomName);
                                    }
                                    else {
                                        var totalGuards = countCreeps('guard', spawn.pos.roomName, 100);
                                        if (totalGuards < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard && Game.rooms[spawn.pos.roomName].controller.level > 1) {
                                            spawnProtoCreep(spawn.name, 'guard', spawn.pos.roomName);
                                        }
                                        else {
                                            var totalEngineers = countCreeps('engineer', spawn.pos.roomName, 100);
                                            if (totalEngineers < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer && Game.rooms[spawn.pos.roomName].controller.level > 1) {
                                                spawnProtoCreep(spawn.name, 'engineer', spawn.pos.roomName);
                                            }
                                            else {
                                                var totalHealers = countCreeps('healer', spawn.pos.roomName, 100);
                                                if (totalHealers < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard && Memory.rooms[spawn.pos.roomName].security.underattack === 'yes' && Game.rooms[spawn.pos.roomName].controller.level > 1) {
                                                    spawnProtoCreep(spawn.name, 'healer', spawn.pos.roomName);
                                                }
                                                else {
                                                    if (Memory.rooms[spawn.pos.roomName].mineral) {
                                                        if (Memory.rooms[spawn.pos.roomName].mineral.extractor) {
                                                            var totalMiners = countCreeps('miner', spawn.pos.roomName, 100);
                                                            if (totalMiners < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner && Game.rooms[spawn.pos.roomName].controller.level > 1) {
                                                              spawnProtoCreep(spawn.name, 'miner', spawn.pos.roomName);
                                                            }
                                                        }
                                                    }
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
