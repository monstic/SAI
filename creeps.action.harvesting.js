var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.sourceId || creep.memory.sourceId === 'undefined') {

        //harvesting
        if (creep.memory.action === 'harvesting') {
            
            if (Memory.rooms[creep.room.name].sources) {
                var sources = Memory.rooms[creep.room.name].sources;
                var haveSources = Memory.rooms[creep.room.name].sources.total;
            }


            if (haveSources > 0) {

                if (haveSources === 1) {
                    creep.memory.sourceId = sources[0];
                    creep.memory.sourceRoom = creep.room.name;
                    creep.memory.sourceType = 'SCAC';
                }

                if (haveSources === 2) {
                    var isBusy = countCreepsInSource(sources[0]);
                    if (isBusy > 0) {
                        var isBusyToo = countCreepsInSource(sources[1]);
                        if (isBusyToo > 0) {
                            creep.say('⚡?');
                        }
                        else {
                            creep.memory.sourceId = sources[1];
                            creep.memory.sourceRoom = creep.room.name;
                            creep.memory.sourceType = 'SCAC';
                        }
                    }
                    else {
                        creep.memory.sourceId = sources[0];
                        creep.memory.sourceRoom = creep.room.name;
                        creep.memory.sourceType = 'SCAC';
                    }
                }

                if (haveSources === 3) {
                    var isBusy = countCreepsInSource(sources[0]);
                    if (isBusy > 0) {
                        var isBusyToo = countCreepsInSource(sources[1]);
                        if (isBusyToo > 0) {
                            var isBusyTooToo = countCreepsInSource(sources[2]);
                            if (isBusyTooToo > 0) {
                                creep.say('⚡?');
                            }
                            else {
                                creep.memory.sourceId = sources[2];
                                creep.memory.sourceRoom = creep.room.name;
                                creep.memory.sourceType = 'SCAC';
                            }
                        }
                        else {
                            creep.memory.sourceId = sources[1];
                            creep.memory.sourceRoom = creep.room.name;
                            creep.memory.sourceType = 'SCAC';
                        }
                    }
                    else {
                        creep.memory.sourceId = sources[0];
                        creep.memory.sourceRoom = creep.room.name;
                        creep.memory.sourceType = 'SCAC';
                    }
                }

            }
        }

    }

    if (creep.memory.sourceId) {

        if (creep.memory.action === 'harvesting') {
            if (creep.memory.sourceType === 'SCAC') {
                source = Game.getObjectById(creep.memory.sourceId);
                if (source.energy > 0)  {
                    if (creep.harvest(source) === OK) {
                    //VISUALS
                    new RoomVisual(creep.room.name).text('⚡', (source.pos.x - 0.5), (source.pos.y + 0.1), {size: 0.4, color: 'gold'});
                    new RoomVisual(creep.room.name).text('⚡', (source.pos.x + 0.5), (source.pos.y + 0.1), {size: 0.4, color: 'gold'});
                    new RoomVisual(creep.room.name).text('⚡', (source.pos.x), (source.pos.y - 0.4), {size: 0.4, color: 'gold'});
                    new RoomVisual(creep.room.name).text('⚡', (source.pos.x), (source.pos.y + 0.6), {size: 0.4, color: 'gold'});
                    }
                    else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                    else if (creep.harvest(source) === ERR_BUSY) {
                        creep.say('❗');
                    }
                    else if (creep.harvest(source) === ERR_FULL) {
                        creep.say('❗');
                    }
                    else if (creep.harvest(source) === ERR_TIRED) {
                        creep.say('❗');
                    }
                    else if (creep.harvest(source) === ERR_INVALID_TARGET) {
                        cleanTarget(creep);
                        creep.say('❔');
                    }
                }
                else {
                    creep.moveTo(source);
                }
            }
        }


    }

};



module.exports = creepActFunctions;


