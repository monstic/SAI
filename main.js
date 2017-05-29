// Screeting Artificial intelligence - SAI
// [Coded by Hans]
// Version 1.0a


//START


//USE THIS ONLY IF HAVE ERRORS
var FORCE_PAUSE = false;
if (FORCE_PAUSE !== true) {

    //LIBS
    var gc = require('lib.gc');
    var gf = require('lib.gf');
    var _ = require('lib.lodash');
    require('lib.sai');


    //INIT
    require('init.system');


    //START LOOP
    module.exports.loop = function () {

        //BUCKET CHECK
        if (Game.cpu.bucket > 100) {

            //PULSE ALL CREEPS
            var initCreeps = require('init.creeps');
            for (var creepName in Game.creeps) {
                initCreeps(Game.creeps[creepName]);
                var creep = Game.creeps[creepName];
                var loadType = require('creeps.type.' + creep.memory.type);
                loadType(creep);
            }
        }

        //CPU CHECK
        if (Game.cpu.limit > 100 || Game.cpu.tickLimit < 100 || Game.cpu.bucket < 100) {
            log('CPU: ' + Game.cpu.getUsed() + '%');
        }
        else {
            //PULSE ALL ROOMS
            var initRooms = require('init.rooms');
            for (var roomName in Game.rooms) {
                initRooms(Game.rooms[roomName]);
            }

            //PULSE ALL SPAWNS
            var initSpawns = require('init.spawns');
            for (var spawnName in Game.spawns) {
                initSpawns(Game.spawns[spawnName]);
            }
        }

        //REMOVE DEAD CREEPS FROM MEMORY
        for (var name in Memory.creeps) {
            if (!Game.creeps[name] || Memory.creeps[name] == undefined) {
                delete Memory.creeps[name];
                log('Creep ' + name + ' died.');
            }
        }

    };
    //END LOOP

}

//END

