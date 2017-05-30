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
    var initCreeps = require('init.creeps');
    var initRooms = require('init.rooms');
    var initSpawns = require('init.spawns');


    //START LOOP
    module.exports.loop = function () {

        //CPU CHECK
        if (Game.cpu.limit > 100 || Game.cpu.tickLimit < 100 || Game.cpu.bucket < 100) {
            console.log('CPU: ' + Game.cpu.getUsed() + '%');
        }

        //PULSE ALL CREEPS
        for (var creepName in Game.creeps) {
            //load creep
            var creep = Game.creeps[creepName];
            //load main
            initCreeps(creep);
            //load types
            var initCreepType = require('creeps.type.' + creep.memory.type);
            initCreepType(creep);
            //load actions
            var initCreepAction = require('creeps.action.' + creep.memory.action);
            initCreepAction(creep);
        }

        //PULSE ALL ROOMS
        for (var roomName in Game.rooms) {
            initRooms(Game.rooms[roomName]);
        }

        //PULSE ALL SPAWNS
        for (var spawnName in Game.spawns) {
            initSpawns(Game.spawns[spawnName]);
        }

        //REMOVE DEAD CREEPS FROM MEMORY
        for (var name in Memory.creeps) {
            if (!Game.creeps[name] || Memory.creeps[name] == undefined) {
                delete Memory.creeps[name];
                console.log('Creep ' + name + ' died.');
            }
        }

    };
    //END LOOP

}

//END

// Screeting Artificial intelligence - SAI
// http://www.screepting.tk



