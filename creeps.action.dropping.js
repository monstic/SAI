var creepActFunctions = function(creep) {

        //storing
        if (creep.memory.action === 'dropping') {
            if (creep.carry[RESOURCE_ENERGY] > 0) {
                creep.drop(RESOURCE_ENERGY);
            }
            if (creep.carry[RESOURCE_GHODIUM_OXIDE] > 0) {
                creep.drop(RESOURCE_GHODIUM_OXIDE);
            }
        }

};

module.exports = creepActFunctions;


