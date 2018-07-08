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
