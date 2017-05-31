module.exports = function (room) {

    if (Memory.rooms) {

        //START ONE TIME RUN

        //REGISTER NEW ROOM
        if (!Memory.rooms[room.name] || Memory.rooms[room.name] === 'undefined') {
            Memory.rooms[room.name] = {};
            console.log('Room ' + room.name + ' registered in database.');
        }

        if (Memory.rooms[room.name]) {

            //CREATE SPAWNS DATABASE
            if (!Memory.rooms[room.name].spawns || Memory.rooms[room.name].spawns === undefined) {
                Memory.rooms[room.name].spawns = {};
                console.log('Spawns database created.');
            }


            //CREATE SUMMARY
            if (!Memory.rooms[room.name].info || Memory.rooms[room.name].info === 'undefined') {
                Memory.rooms[room.name].info = {};
                Memory.rooms[room.name].info.lastseen = Game.time;
                Memory.rooms[room.name].info.constructionslevel = 1;
            }

            //CREATE CONFIG
            if (!Memory.rooms[room.name].config || Memory.rooms[room.name].config === 'undefined') {
                Memory.rooms[room.name].config = {};
                Memory.rooms[room.name].config.deleteemptyroomsafter = 500;
            }

            //CREATE SUMMARY
            if (!Memory.rooms[room.name].structure || Memory.rooms[room.name].structure === 'undefined') {
                Memory.rooms[room.name].structure = {};
                Memory.rooms[room.name].structure.container = {};
                Memory.rooms[room.name].structure.storage = {};
                Memory.rooms[room.name].structure.tower = {};
                Memory.rooms[room.name].structure.spawn = {};
                Memory.rooms[room.name].structure.link = {};
                Memory.rooms[room.name].structure.road = {};
            }


            //CREATE SECURITY
            if (!Memory.rooms[room.name].security || Memory.rooms[room.name].security === 'undefined') {
                Memory.rooms[room.name].security = {};
                Memory.rooms[room.name].security.mode = 'defend';
                Memory.rooms[room.name].security.level = 1;
                Memory.rooms[room.name].security.underattack = 'no';
            }

            //CREATE TRAIL DB
            if (!Memory.rooms[room.name].trail || Memory.rooms[room.name].trail === 'undefined') {
                Memory.rooms[room.name].trail = {};
            }



            //CREATE SUMMARY
            if (!Memory.rooms[room.name].exit || Memory.rooms[room.name].exit === 'undefined') {
                Memory.rooms[room.name].exit = {};
                Memory.rooms[room.name].exit.left = {};
                Memory.rooms[room.name].exit.right = {};
                Memory.rooms[room.name].exit.top = {};
                Memory.rooms[room.name].exit.bot = {};
            }

            //CREATE CRONJOBS
            if (!Memory.rooms[room.name].cron || Memory.rooms[room.name].cron === 'undefined') {
                Memory.rooms[room.name].cron = {};
                Memory.rooms[room.name].cron[0] = {};
                Memory.rooms[room.name].cron[0].lastrun = Game.time;
                Memory.rooms[room.name].cron[0].interval = 50;
                Memory.rooms[room.name].cron[1] = {};
                Memory.rooms[room.name].cron[1].lastrun = (Game.time+1);
                Memory.rooms[room.name].cron[1].interval = 500;
                Memory.rooms[room.name].cron[2] = {};
                Memory.rooms[room.name].cron[2].lastrun = (Game.time+2);
                Memory.rooms[room.name].cron[2].interval = 100;
                Memory.rooms[room.name].cron[3] = {};
                Memory.rooms[room.name].cron[3].lastrun = (Game.time+3);
                Memory.rooms[room.name].cron[3].interval = 50;
                Memory.rooms[room.name].cron[4] = {};
                Memory.rooms[room.name].cron[4].lastrun = (Game.time+4);
                Memory.rooms[room.name].cron[4].interval = 500;
                Memory.rooms[room.name].cron[5] = {};
                Memory.rooms[room.name].cron[5].lastrun = (Game.time+5);
                Memory.rooms[room.name].cron[5].interval = 25;
            }

        //END ONE TIME RUN

        //START SCAN ROOM

            //START CRONJOBS

            //START CRON 0 [REGISTER STRUCTURES]
            if (Memory.rooms[room.name].cron[0].lastrun < (Game.time-Memory.rooms[room.name].cron[0].interval)) {

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

                    //REGISTER EXTRACTOR
                    if (Memory.rooms[room.name].mineral) {
                        if (!Memory.rooms[room.name].mineral.extractor || Memory.rooms[room.name].mineral.extractor === 'undefined') {
                            var extractor = room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_EXTRACTOR)});
                            if (extractor.length > 0) {
                                Memory.rooms[room.name].mineral.extractor = extractor[0].id;
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
                    }

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

                    //REGISTER TOWERS
                    if (!Memory.rooms[room.name].structure.tower || Memory.rooms[room.name].structure.tower === 'undefined') {
                        var towers = room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_TOWER)});
                        if (towers.length > 0) {
                            Memory.rooms[room.name].structure.tower.total = towers.length;
                            var i = 0;
                            while (i < towers.length) {
                                if (!Memory.rooms[room.name].structure.tower[i] || Memory.rooms[room.name].structure.tower[i] === 'undefined') {
                                    Memory.rooms[room.name].structure.tower[i] = {};
                                    Memory.rooms[room.name].structure.tower[i] = towers[i].id;
                                }
                                i++;
                            }
                        }
                    }

                    //REGISTER LINKS
                    if (!Memory.rooms[room.name].links || Memory.rooms[room.name].links === undefined) {
                        Memory.rooms[room.name].links = {};
                    }
                    if (Memory.rooms[room.name].links) {
                        var haveLink = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_LINK)});
                        Memory.rooms[room.name].links.haveLink = haveLink.length;

                    }

                    //REGISTER EXIT POSITIONS
                    if (Memory.rooms[room.name].exit) {
                        if (Memory.rooms[room.name].exit.left) {
                            var exits = room.find(FIND_EXIT_LEFT);
                            var i = 0;
                            if (exits.length > 0) {
                                for (var exit in exits) {
                                    Memory.rooms[room.name].exit.left[exits[exit].y] = exits[exit].y;
                                }
                                for (var exit in exits) {
                                    if (i === (exits.length/2)) {
                                        log('i = ' + i);
                                        log('pos = ' + Memory.rooms[room.name].exit.left[exits[exit].y + ' - ');
                                        delete Memory.rooms[room.name].exit.left[exits[exit].y];
                                    }
                                    i++;
                                }

                            }
                        }
                        if (Memory.rooms[room.name].exit.right) {
                            var exits = room.find(FIND_EXIT_RIGHT);
                            var i = 0;
                            if (exits.length > 0) {
                                for (var exit in exits) {
                                    Memory.rooms[room.name].exit.right[exits[exit].y] = exits[exit].y;
                                }
                                for (var exit in exits) {
                                    if (i === (exits.length/2)) { 
                                        delete Memory.rooms[room.name].exit.right[exits[exit].y];
                                    }
                                    i++;
                                }
                            }
                        }
                        if (Memory.rooms[room.name].exit.top) {
                            var exits = room.find(FIND_EXIT_TOP);
                            var i = 0;
                            if (exits.length > 0) {
                                for (var exit in exits) {
                                    Memory.rooms[room.name].exit.top[exits[exit].x] = exits[exit].x;
                                }
                                for (var exit in exits) {
                                    if (i === (exits.length/2)) { 
                                        delete Memory.rooms[room.name].exit.top[exits[exit].x];
                                    }
                                    i++;
                                }
                            }
                        }
                        if (Memory.rooms[room.name].exit.bot) {
                            var exits = room.find(FIND_EXIT_BOTTOM);
                            var i = 0;
                            if (exits.length > 0) {
                                for (var exit in exits) {
                                    Memory.rooms[room.name].exit.bot[exits[exit].x] = exits[exit].x;
                                }
                                for (var exit in exits) {
                                    if (i === (exits.length/2)) { 
                                        delete Memory.rooms[room.name].exit.bot[exits[exit].x];
                                    }
                                    i++;
                                }
                            }
                        }
                    }
                    

                }


                //SAVE LAST RUN
                Memory.rooms[room.name].cron[0].lastrun = Game.time;

            }
            //END CRON 0

            //START CRON 1 [CLEANING OLD DATA]
            if (Memory.rooms[room.name].cron[1].lastrun < (Game.time-Memory.rooms[room.name].cron[1].interval)) {

                //DELETE UNUSED ROOMS (CRON)
                if (Memory.rooms[room.name]) {
                    var searchStructures;
                    searchStructures = room.find(FIND_MY_STRUCTURES);
                    if (searchStructures.length === 0) {
                        console.log('Deleting ' + room.name + ' from memory, no structures in this room.');
                        delete Memory.rooms[room.name];
                    }
                }

                //SAVE LAST RUN
                Memory.rooms[room.name].cron[1].lastrun = Game.time;

            }
            //END CRON 1

            //START CRON 2
            // in use by init.spawns
            //END CRON 2

            //START CRON 3 [AUTO DECREASE ROADS]
            if (Memory.rooms[room.name].cron[3].lastrun < (Game.time-Memory.rooms[room.name].cron[3].interval)) {
                decreaseRoads(room);
                Memory.rooms[room.name].cron[3].lastrun = Game.time;
            }
            //END CRON 3

            //START CRON 4 [AUTO BUILD ROADS]
            if (Memory.rooms[room.name].cron[4].lastrun < (Game.time-Memory.rooms[room.name].cron[4].interval)) {
                autoBuildRoads(room);
                Memory.rooms[room.name].cron[4].lastrun = Game.time;
            }
            //END CRON 4

            //START CRON 5 [AUTO BUILD STRUCTURES]
            if (Memory.rooms[room.name].cron[5].lastrun < (Game.time-Memory.rooms[room.name].cron[5].interval)) {
                autoBuild(room);
                Memory.rooms[room.name].cron[5].lastrun = Game.time;
            }
            //END CRON 5

            //END CRONJOBS

        }
        //END SCAN ROOM

        //LOAD MODULES
        enableTowers(room);
        showRoomInfoInScreen(room);

    }

};
//END ROOM
