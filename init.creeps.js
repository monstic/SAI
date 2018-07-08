module.exports = function (creep) {

    //load types
    var initAction = require('creeps.action.' + creep.memory.action);
    initAction(creep);


};
