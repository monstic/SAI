module.exports = function (room) {

    if (Memory.rooms) {

        //START ONE TIME RUN

        //REGISTER NEW ROOM
        if (!Memory.rooms[room.name] || Memory.rooms[room.name] === 'undefined') {
            Memory.rooms[room.name] = {};
            console.log('Room ' + room.name + ' registered in database.');
        }

        if (Memory.rooms[room.name]) {

            //INFO DB
            if (!Memory.rooms[room.name].info || Memory.rooms[room.name].info === 'undefined') {
                Memory.rooms[room.name].info = {};
                Memory.rooms[room.name].info.lastvisit = Game.time;
                Memory.rooms[room.name].info.constructionslevel = 0;
                Memory.rooms[room.name].info.underattack = 0;
            }

            //CONFIG DB
            if (!Memory.rooms[room.name].config || Memory.rooms[room.name].config === 'undefined') {
                Memory.rooms[room.name].config = {};
                Memory.rooms[room.name].config.deleteifnovisitin = 500;
                Memory.rooms[room.name].config.autobuild = 0;
                Memory.rooms[room.name].config.autobuildroads = 0;
                Memory.rooms[room.name].config.autobuildwalls = 0;
            }

            //CREATE SECURITY
            if (!Memory.rooms[room.name].security || Memory.rooms[room.name].security === 'undefined') {
                Memory.rooms[room.name].security = {};
                Memory.rooms[room.name].security.mode = 0;
                Memory.rooms[room.name].security.level = 0;
            }
            
            //ROOM DB
            if (!Memory.rooms[room.name].structure || Memory.rooms[room.name].structure === 'undefined') {
                Memory.rooms[room.name].structure = {};
            }
            if (!Memory.rooms[room.name].structure.container || Memory.rooms[room.name].structure.container === 'undefined') {
                Memory.rooms[room.name].structure.container = {};
            }
            if (!Memory.rooms[room.name].structure.storage || Memory.rooms[room.name].structure.storage === 'undefined') {
                Memory.rooms[room.name].structure.storage = {};
            }
            if (!Memory.rooms[room.name].structure.storage.mineral || Memory.rooms[room.name].structure.storage.mineral === 'undefined') {
                Memory.rooms[room.name].structure.storage.mineral = {};
            }
            if (!Memory.rooms[room.name].mineral || Memory.rooms[room.name].mineral === 'undefined') {
                Memory.rooms[room.name].mineral = {};
            }
            
            if (!Memory.hostiles || Memory.hostiles === 'undefined') {
                Memory.hostiles = {};
            }


            //CREATE CRONJOBS
            if (!Memory.rooms[room.name].cron || Memory.rooms[room.name].cron === 'undefined') {
                Memory.rooms[room.name].cron = {};
            }
            if (!Memory.rooms[room.name].cron[0] || Memory.rooms[room.name].cron[0] === 'undefined') {
                Memory.rooms[room.name].cron[0] = {};
                Memory.rooms[room.name].cron[0].lastrun = Game.time;
                Memory.rooms[room.name].cron[0].interval = 15;
            }
            if (!Memory.rooms[room.name].cron[1] || Memory.rooms[room.name].cron[1] === 'undefined') {
                Memory.rooms[room.name].cron[1] = {};
                Memory.rooms[room.name].cron[1].lastrun = Game.time;
                Memory.rooms[room.name].cron[1].interval = 15;
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
            
            //REGISTER AVAILABLE MINERALS
            if (!Memory.rooms[room.name].mineral || Memory.rooms[room.name].mineral === 'undefined') {
                var findMinerals = room.find(FIND_MINERALS);
                if (findMinerals.length > 0) {
                    Memory.rooms[room.name].mineral = {};
                    Memory.rooms[room.name].mineral.id = findMinerals[0].id;
                    console.log('Mineral type ' + findMinerals[0].mineralType + ' was found in room ' + room.name + '.');
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
            }
            else {
                Memory.rooms[room.name].structure = {};
            }

        }
        



        //START CRONJOBS

        //START CRON 0 [REGISTER STRUCTURES]
        if (Memory.rooms[room.name].cron[0].lastrun < (Game.time-Memory.rooms[room.name].cron[0].interval)) {
            Memory.rooms[room.name].cron[0].lastrun = Game.time;

            //CHECK ROOM HOSTILES
            var target = room.find(FIND_HOSTILE_CREEPS);
            if (target.length > 0) {
                Memory.rooms[room.name].security.underattack = 1;
                if (Memory.rooms[room.name].security.mode > 0) {
                    if (Memory.hostiles) {
                        if (!Memory.hostiles.targetId || Memory.hostiles.targetId === 'undefined') {
                            if (target.length > 0) {
                              Memory.hostiles.targetId = target[0].id;
                            }
                        }
                    }
                    else {
                        Memory.hostiles = {};
                    }
                }
            }
            else {
              if (Memory.hostiles) {
                  if (Memory.hostiles.targetId) {
                      delete Memory.hostiles.targetId;
                  }
              }
              if (Memory.rooms[room.name].security.underattack !== 0) {
                  Memory.rooms[room.name].security.underattack = 0;
              }
            }
        }
        //END CRON 0

        //START CRON 1 [CLEANING OLD DATA]
        if (Memory.rooms[room.name].cron[1].lastrun < (Game.time-Memory.rooms[room.name].cron[1].interval)) {
            Memory.rooms[room.name].cron[1].lastrun = Game.time;

            //DELETE UNUSED ROOMS (CRON)
            if (Memory.rooms[room.name]) {
                var searchStructures;
                searchStructures = room.find(FIND_MY_STRUCTURES);
                if (searchStructures.length === 0) {
                    console.log('Deleting ' + room.name + ' from memory, no structures in this room.');
                    delete Memory.rooms[room.name];
                }
            }

        }
        //END CRON 1

    }
    else {
        Memory.rooms = {};
    }

};
//END ROOM
