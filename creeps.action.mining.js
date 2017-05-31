var creepActFunctions = function(creep) {

    //SET TARGET FOR EACH ACTION
    if (!creep.memory.sourceId || creep.memory.sourceId === 'undefined') {

        //minning
        if (creep.memory.action === 'mining') {

            setSource(creep, Memory.rooms[creep.room.name].mineral.id, 'EXTR', creep.room.name);
        }

    }

    if (creep.memory.sourceId) {
        if (creep.memory.action === 'mining') {
            if (creep.memory.sourceType === 'EXTR') {
                source = Game.getObjectById(creep.memory.sourceId);
                if (Memory.rooms[creep.room.name].mineral) {
                    if (Memory.rooms[creep.room.name].mineral.extractor) {
                    extractor = Game.getObjectById(Memory.rooms[creep.room.name].mineral.extractor);
                        if (extractor.isActive() === true) {
                            if (!extractor.cooldown) {
                                if (creep.harvest(source) === OK) {
                                    //VISUALS
                                    new RoomVisual(creep.room.name).text('⚡', (source.pos.x - 0.5), (source.pos.y + 0.1), {size: 0.4, color: 'gold'});
                                    new RoomVisual(creep.room.name).text('⚡', (source.pos.x + 0.5), (source.pos.y + 0.1), {size: 0.4, color: 'gold'});
                                    new RoomVisual(creep.room.name).text('⚡', (source.pos.x), (source.pos.y - 0.4), {size: 0.4, color: 'gold'});
                                    new RoomVisual(creep.room.name).text('⚡', (source.pos.x), (source.pos.y + 0.6), {size: 0.4, color: 'gold'});
                                    creep.say('⛏');
                                }
                                else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                                    creep.moveTo(source, {reusePath: true});
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
                        }
                    }
                }
            }
        }


    }

};



module.exports = creepActFunctions;
