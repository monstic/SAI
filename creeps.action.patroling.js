var creepActFunctions = function(creep) {

      //PATROL ROOM
      if (!creep.memory.nextpostime || creep.memory.nextpostime === 'undefined') {
        creep.memory.nextpostime = Game.time;
      }

      if (creep.memory.nextpos) {
        creep.moveTo(creep.memory.nextpos.x, creep.memory.nextpos.y);
      }

      if (creep.memory.nextpostime) {
          if (creep.memory.nextpostime < (Game.time-30)) {
              var room = Game.rooms[creep.memory.homeroom];
              if (creep.memory.nextpos) {
                  if (creep.pos.x === creep.memory.nextpos.x && creep.pos.y === creep.memory.nextpos.y) {
                      creep.say('👮');
                      delete creep.memory.nextpos;
                  }
                  else {
                      if (creep.memory.checkpos) {
                          if (creep.pos.x === creep.memory.checkpos.x || creep.pos.y === creep.memory.checkpos.y) {
                            creep.say('👮');
                            delete creep.memory.nextpos;
                          }
                          creep.memory.checkpos = creep.pos;
                      }
                      else {
                        creep.memory.checkpos = creep.pos;
                      }
                  }
              }
              else {
                  creep.memory.nextpos = walkRandomInRoad(Memory.rooms[creep.room.name].spawns[creep.memory.homespawn].pos, 10, creep.room.name);
              }
              creep.memory.nextpostime = Game.time;
          }
      }
};



module.exports = creepActFunctions;
