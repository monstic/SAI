module.exports = function (room) {

    //START ONE TIME RUN

    //REGISTER NEW ROOM
    if (!Memory.rooms[room.name] || Memory.rooms[room.name] === 'undefined') {
        Memory.rooms[room.name] = {};
        log('Room ' + room.name + ' registered in database.');
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
    }


    //CREATE CRONJOBS
    if (!Memory.rooms[room.name].cron || Memory.rooms[room.name].cron === 'undefined') {
        Memory.rooms[room.name].cron = {};
        Memory.rooms[room.name].cron[0] = {};
        Memory.rooms[room.name].cron[0].lastrun = Game.time;
        Memory.rooms[room.name].cron[0].interval = 100;
        Memory.rooms[room.name].cron[1] = {};
        Memory.rooms[room.name].cron[1].lastrun = (Game.time+1);
        Memory.rooms[room.name].cron[1].interval = 5;
        Memory.rooms[room.name].cron[2] = {};
        Memory.rooms[room.name].cron[2].lastrun = (Game.time+2);
        Memory.rooms[room.name].cron[2].interval = 5;
        Memory.rooms[room.name].cron[3] = {};
        Memory.rooms[room.name].cron[3].lastrun = (Game.time+3);
        Memory.rooms[room.name].cron[3].interval = 5;
        Memory.rooms[room.name].cron[4] = {};
        Memory.rooms[room.name].cron[4].lastrun = (Game.time+4);
        Memory.rooms[room.name].cron[4].interval = 5;
    }

    //END ONE TIME RUN

    //START CRON 0 [REGISTER STRUCTURES]
    if (Memory.rooms[room.name].cron[0].lastrun < (Game.time-Memory.rooms[room.name].cron[0].interval)) {


        //REGISTER AVAILABLE MINERALS
        if (!Memory.rooms[room.name].mineral || Memory.rooms[room.name].mineral === 'undefined') {
            var findMinerals = room.find(FIND_MINERALS);
            if (findMinerals.length > 0) {
                Memory.rooms[room.name].mineral = {};
                Memory.rooms[room.name].mineral.id = findMinerals[0].id;
                log('Mineral type ' + findMinerals[0].mineralType + ' was found in room ' + room.name + '.');
            }
        }

        //REGISTER EXTRACTOR
        if (Memory.rooms[room.name].mineral) {
            if (!Memory.rooms[room.name].mineral.extractor || Memory.rooms[room.name].mineral.extractor === 'undefined') {
                var extractor = room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType === STRUCTURE_EXTRACTOR)}});
                if (extractor.length > 0) {
                    Memory.rooms[room.name].mineral.extractor = extractor[0].id;
                }
            }
        }

        //REGISTER AVAILABLE SOURCES
        if (!Memory.rooms[room.name].sources || Memory.rooms[room.name].sources === 'undefined') {
            var findSources = room.find(FIND_SOURCES);
            if (findSources.length > 0) {
                Memory.rooms[room.name].sources = {};
                Memory.rooms[room.name].sources.total = findSources.length;
                log('Found ' + findSources.length + ' source(s) in room ' + room.name + '.');
                i = 0;
                while (i < findSources.length) {
                    Memory.rooms[room.name].sources[i] = findSources[i].id;
                    log('Registered source ' + findSources[i].id + ' in room ' + room.name + '.');
                    i++;
                }
            }
        }

        //REGISTER CONTAINER NEAR CONTROLLER
        if (!Memory.rooms[room.name].structure.container.nearcontroller || Memory.rooms[room.name].structure.container.nearcontroller === 'undefined') {
            var controller = new RoomPosition(room.controller.pos.x, room.controller.pos.y, room.name);
            var container = controller.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (s.structureType === STRUCTURE_CONTAINER)});
            if (container[0]) {
                Memory.rooms[room.name].structure.container.nearcontroller = container[0].id;
            }
        }

        //REGISTER STORAGE NEAR MINERAL
        if (!Memory.rooms[room.name].structure.storage.nearmineral || Memory.rooms[room.name].structure.storage.nearmineral === 'undefined') {
            if (Memory.rooms[room.name].mineral.id) {
                var mineral = Game.getObjectById(Memory.rooms[room.name].mineral.id);
                var mineralpos = new RoomPosition(mineral.pos.x, mineral.pos.y, room.name);
                var storage = mineralpos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (s.structureType === STRUCTURE_STORAGE)});
                if (storage[0]) {
                    Memory.rooms[room.name].structure.storage.nearmineral = storage[0].id;
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

    Memory.rooms[room.name].cron.database.lastcheck = Game.time;
    }
    //END CRON 0

    //START CRON 1 [CLEANING OLD DATA]
    if (Memory.rooms[room.name].cron[1].lastrun < (Game.time-Memory.rooms[room.name].cron[1].interval)) {

        //DELETE UNUSED ROOMS (CRON)
        if (Memory.rooms[room.name]) {

            if (!Memory.rooms[room.name].info.lastseen) {
                var searchStructures = room.find(FIND_MY_STRUCTURES);
                if (searchStructures.length === 0) {
                    console.log('Deleting ' + room.name + ' from memory, no structures in this room.');
                    delete Memory.rooms[room.name];
                }
            }
            else {
                if (Memory.rooms[room.name].info.lastseen < (Game.time - Memory.rooms[room.name].config.deleteemptyroomsafter)) {
                    console.log(`Deleting empty ${room.name} from memory, older than 500 tickes`);
                    delete Memory.rooms[room.name];
                }
            }
        }
    }
    //END CRON 1


};
//END ROOM


