//LIB SAI
log = console.log;

//COUNT CONSTRUCTIONS TO BUILD
countConstructions =
    function (roomname) {
        var room = Game.rooms[roomname];
        if (Memory.rooms[roomname]) {
            var total = room.find(FIND_CONSTRUCTION_SITES);
            return total.length;
        }
    };

//COUNT CONTAINERS
countContainers =
    function (roomname) {
        var room = Game.rooms[roomname];
        if (Memory.rooms[roomname]) {
            var total = room.find(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_CONTAINER) });
            return total.length;
        }
    };

//COUNT BUILDS TO REPAIR
countRepairs =
    function (roomname) {
        var room = Game.rooms[roomname];
        if (Memory.rooms[roomname]) {
            var total = room.find(FIND_STRUCTURES, { filter: (s) => (s.hits < s.hitsMax) });
            return total.length;
        }
    };

//TURN ON/OFF DISPLAY
showDisplay =
function () {
    Memory.system.config.display = 'on';
};
hideDisplay =
function () {
    Memory.system.config.display = 'off';
};

//COUNT CREEPS
countCreeps =
    function (type, roomname, livetime) {
        if (type === 'all') {
            if (livetime) {
                var total = (_.sum(Game.creeps, (c) => c.room.name === roomname && c.ticksToLive >= livetime));
            }
            else {
                var total = (_.sum(Game.creeps, (c) => c.room.name === roomname));
            }
            return total;
        }
        else {
            if (livetime) {
                var total = _.sum(Game.creeps, (c) => c.memory.type === type && c.memory.homeroom === roomname && c.ticksToLive >= livetime);
            }
            else {
                var total = _.sum(Game.creeps, (c) => c.memory.type === type && c.memory.homeroom === roomname);
            }
            return total;
        }
    };

//COUNT CREEPS IN SAME TARGET
countCreepsInTarget =
    function (target) {
        var creeps = Game.creeps;
        var i = 0;
        for (var creep in creeps) {
            if (creeps[creep].memory.targetId === target) {
                i++;
            }
        }
        return i;
    };

//COUNT CREEPS IN SAME SOURCE
countCreepsInSource =
    function (source) {
        var creeps = Game.creeps;
        var i = 0;
        for (var creep in creeps) {
            if (creeps[creep].memory.sourceId === source) {
                i++;
            }
        }
        return i;
    };

//CHECK IF IS SCHEDULED
countQueue =
    function (type, spawnname) {
        var spawn = Game.spawns[spawnname];
        if (Memory.rooms[spawn.pos.roomName]) {
            if (Memory.rooms[spawn.pos.roomName].spawns) {
                if (type === 'all') {
                    var total = _.sum(Memory.rooms[spawn.pos.roomName].spawns[spawnname].queue, (s) => s.spawnname === spawnname);
                    return total;
                }
                else {
                    var total = _.sum(Memory.rooms[spawn.pos.roomName].spawns[spawnname].queue, (s) => (s.type === type && s.spawnname === spawnname));
                    return total;
                }
            }
        }
    };

//CLEAN TARGET
cleanTarget =
    function (creep) {
        delete creep.memory.targetId;
        delete creep.memory.targetRoom;
        delete creep.memory.targetType;
        delete creep.memory.sourceId;
        delete creep.memory.sourceRoom;
        delete creep.memory.sourceType;
        delete creep.memory.path;
        return 1;
    };

//SET TARGET
setTarget =
    function (creep, targetid, type, roomname) {
        creep.memory.targetId = targetid;
        creep.memory.targetType = type;
        creep.memory.targetRoom = roomname;
        var target = Game.getObjectById(targetid);
        creep.memory.path = creep.pos.findPathTo(target);
        return 1;
    };

//SET SOURCE
setSource =
    function (creep, sourceid, type, roomname) {
        creep.memory.sourceId = sourceid;
        creep.memory.sourceType = type;
        creep.memory.sourceRoom = roomname;
        return 1;
    };


//SIGN CONTROLLER
signController =
    function (creep) {
        if (creep.room.controller) {
            if (creep.room.controller.my) {
                if (!creep.room.controller.sign) {
                    var SignMessage = Memory.system.signmsg;
                    if (creep.signController(creep.room.controller, SignMessage) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
    };

//GET RAMDOM POSITION WITHOUT STRUCTURES
getRandomFreePos =
    function (startPos, distance) {
        var x, y;
        do {
            x = startPos.x + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
            y = startPos.y + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
        }
        while ((x + y) % 2 !== (startPos.x + startPos.y) % 2 || Game.map.getTerrainAt(x, y, startPos.roomName) === 'wall');
        return new RoomPosition(x, y, startPos.roomName);
    };


//GET RAMDOM POSITION WITHOUT STRUCTURES AND OUT OF ROAD
getRandomFreePosOutOfRoad =
    function (startPos, distance, room) {
        var x, y;
        do {
            x = startPos.x + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
            y = startPos.y + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
        }
        while ((x + y) % 2 !== (startPos.x + startPos.y) % 2 || Game.map.getTerrainAt(x, y, startPos.roomName) === 'wall');
        var checkPlace = room.lookAt(x, y);
        var place = new RoomPosition(x, y, startPos.roomName);
        var checkArea = place.findInRange(FIND_STRUCTURES, 2, { filter: s => (s.structureType === STRUCTURE_SPAWN) });
        if (checkPlace[0].type === 'terrain' || checkPlace[0].type === 'swamp' || (!checkArea)) {
            new RoomVisual(startPos.roomName).text('✔', x, y, { align: 'center', size: '0.7', color: 'green' });
            return place;
        }
        else {
            new RoomVisual(startPos.roomName).text('❌', x, y, { align: 'center', size: '0.7', color: 'red' });
            var searching = 'searching';
            return searching;
        }
    };

//SHOW TARGET ON SCREEN
showTarget =
    function (creep, targetId, room) {
        target = Game.getObjectById(targetId);
        new RoomVisual(room).circle(creep).line(target);
    };

//EXTENSIONS LIMITS
checkExtensionsLimits =
function (room) {
    if (room.controller) {
        if (room.controller.level === 1) {
            return 0;
        }
        else if (room.controller.level === 2) {
            return 5;
        }
        else if (room.controller.level === 3) {
            return 10;
        }
        else if (room.controller.level === 4) {
            return 20;
        }
        else if (room.controller.level === 5) {
            return 30;
        }
        else if (room.controller.level === 6) {
            return 40;
        }
        else if (room.controller.level === 7) {
            return 50;
        }
        else if (room.controller.level === 8) {
            return 60;
        }
    }
};

//ADD CREEP IN QUEUE
addToQueue =
    function (type, spawnname, goto) {
        var spawn = Game.spawns[spawnname];
        //QUEUE LIST LIMIT
        var totalList = countQueue('all', spawnname);
        if (totalList >= 20) {
            console.log('Queue list full! Can`t add more creeps to spawn.');
        }
        else {
            var taskId = Game.time;
            if (!Memory.rooms[spawn.pos.roomName].spawns[spawnname].queue[taskId]) {
                Memory.rooms[spawn.pos.roomName].spawns[spawnname].queue[taskId] = {};
                Memory.rooms[spawn.pos.roomName].spawns[spawnname].queue[taskId].type = type;
                Memory.rooms[spawn.pos.roomName].spawns[spawnname].queue[taskId].spawnname = spawnname;
                Memory.rooms[spawn.pos.roomName].spawns[spawnname].queue[taskId].registertime = taskId;
                //OPTIONS
                if (goto) {
                    Memory.rooms[spawn.pos.roomName].spawns[spawnname].queue[taskId].goto = goto;
                }
                else {
                    Memory.rooms[spawn.pos.roomName].spawns[spawnname].queue[taskId].goto = spawn.pos.roomName;
                }
            }
        }
        var checktotalList = countQueue('all', spawnname);
        if (totalList !== checktotalList) {
            return 'Creep ' + type + ' added to ' + spawnname + ' queue list.';
        }
    };

//CREEP TYPES
spawnProtoCreep =
    function (spawnname, creeptype, creepgoto) {
        var spawn = Game.spawns[spawnname];
        if (!spawn.spawning) {
            var totalHarvesters = countCreeps('harvester', spawn.pos.roomName);
            var totalTransporters = countCreeps('transporter', spawn.pos.roomName);
            if (totalHarvesters === 0 && spawn.energy < 300) {
                var name = spawn.createCreep([WORK, CARRY, MOVE], null, { type: 'harvester', action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, goto: creepgoto, id: Game.time });
                if (_.isString(name)) {
                    result = ('Spawning new harvester on ' + spawn.name + ' with name ' + name + '.');
                    log(result);
                }
            }
            else if (totalHarvesters > 0 && totalTransporters === 0) {
                var name = spawn.createCreep([WORK, CARRY, MOVE], null, { type: 'transporter', action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, goto: creepgoto, id: Game.time });
                if (_.isString(name)) {
                    result = ('Spawning new transporter on ' + spawn.name + ' with name ' + name + '.');
                    log(result);
                }
            }
            else {
                if (spawn.energy >= 300) {
                    //ACTION: SPAWN
                    // create a balanced body as big as possible with the given energy
                    var spawn = Game.spawns[spawnname];
                    var room = Game.rooms[spawn.pos.roomName];
                    var numberOfParts = Math.floor(spawn.room.energyCapacityAvailable / 200);
                    // make sure the creep is not too big (more than 50 parts)
                    if (creeptype === 'harvester') {
                        numberOfParts = Math.min(numberOfParts, Math.floor(7));
                        var body = [];
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(WORK);
                        }
                        for (let i = 0; i < 1; i++) {
                            body.push(CARRY);
                        }
                        for (let i = 0; i < 3; i++) {
                            body.push(MOVE);
                        }
                    }
                    else if (creeptype === 'transporter') {
                        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 2) - 1);
                        var body = [];
                        for (let i = 0; i < 1; i++) {
                            body.push(WORK);
                        }
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(CARRY);
                        }
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(MOVE);
                        }
                    }
                    else if (creeptype === 'upgrader') {
                        numberOfParts = Math.min(numberOfParts, Math.floor(43));
                        var body = [];
                        if (room.controller.level < 6) {
                            for (let i = 0; i < numberOfParts; i++) {
                                body.push(WORK);
                            }
                            for (let i = 0; i < numberOfParts; i++) {
                                body.push(CARRY);
                            }
                            for (let i = 0; i < numberOfParts; i++) {
                                body.push(MOVE);
                            }
                        }
                        else {
                            for (let i = 0; i < numberOfParts; i++) {
                                body.push(WORK);
                            }
                            for (let i = 0; i < 2; i++) {
                                body.push(CARRY);
                            }
                            for (let i = 0; i < 4; i++) {
                                body.push(MOVE);
                            }
                        }
                    }
                    else if (creeptype === 'engineer') {
                        var totalConstructions = countConstructions(spawn.pos.roomName);
                        var totalRepairs = countRepairs(spawn.pos.roomName);
                        if (totalConstructions > 0 || totalRepairs > 0) {
                            var body = [];
                            if (room.controller.level < 6) {
                                for (let i = 0; i < numberOfParts; i++) {
                                    body.push(WORK);
                                }
                                for (let i = 0; i < numberOfParts; i++) {
                                    body.push(CARRY);
                                }
                                for (let i = 0; i < numberOfParts; i++) {
                                    body.push(MOVE);
                                }
                            }
                            else {
                                for (let i = 0; i < 5; i++) {
                                    body.push(WORK);
                                }
                                for (let i = 0; i < 5; i++) {
                                    body.push(CARRY);
                                }
                                for (let i = 0; i < 5; i++) {
                                    body.push(MOVE);
                                }
                            }
                        }
                    }
                    else if (creeptype === 'miner') {
                        var body = [];
                        for (let i = 0; i < 9; i++) {
                            body.push(WORK);
                        }
                        for (let i = 0; i < 2; i++) {
                            body.push(CARRY);
                        }
                        for (let i = 0; i < 4; i++) {
                            body.push(MOVE);
                        }
                    }
                    else if (creeptype === 'claimer') {
                        var numberOfParts = Math.floor(spawn.room.energyCapacityAvailable / 600);
                        numberOfParts = Math.min(numberOfParts, Math.floor(6) - 1);
                        var body = [];
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(MOVE);
                        }
                        for (let i = 0; i < 1; i++) {
                            body.push(CLAIM);
                        }
                        for (let i = 0; i < 1; i++) {
                            body.push(CARRY);
                        }
                    }
                    else {
                        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
                        var body = [];
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(WORK);
                        }
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(CARRY);
                        }
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(MOVE);
                        }
                    }

                    var canIspawn = spawn.canCreateCreep(body, null, { type: creeptype, action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, goto: creepgoto, id: Game.time });
                    if (canIspawn === 0) {
                        var name = spawn.createCreep(body, null, { type: creeptype, action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, goto: creepgoto, id: Game.time });
                        if (_.isString(name)) {
                            result = ('Spawning new ' + creeptype + ' on ' + spawn.name + ' with name ' + name + '.');
                            log(result);
                        }
                    }
                }
            }
        }
    };

//TOWERS
enableTowers =
    function (room) {
        var towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER);
        for (let tower of towers) {
            var hostilesHealer = room.find(FIND_HOSTILE_CREEPS, { filter: function (object) { return object.getActiveBodyparts(HEAL) > 0 } });
            if (hostilesHealer.length > 0) {
                tower.attack(hostilesHealer[0]);
                //VISUALS
                new RoomVisual(room.name).text('.', (hostilesHealer[0].pos.x - 0.5), (hostilesHealer[0].pos.y + 0.1), {size: 0.4, color: 'red'});
                new RoomVisual(room.name).text('.', (hostilesHealer[0].pos.x + 0.5), (hostilesHealer[0].pos.y + 0.1), {size: 0.4, color: 'red'});
                new RoomVisual(room.name).text('.', (hostilesHealer[0].pos.x), (hostilesHealer[0].pos.y - 0.4), {size: 0.4, color: 'red'});
                new RoomVisual(room.name).text('.', (hostilesHealer[0].pos.x), (hostilesHealer[0].pos.y + 0.6), {size: 0.4, color: 'red'});
            }
            else {
                var hostilesArmed = room.find(FIND_HOSTILE_CREEPS, { filter: function (object) { return object.getActiveBodyparts(ATTACK) > 0 } });
                if (hostilesArmed.length > 0) {
                    tower.attack(hostilesArmed[0]);
                    //VISUALS
                    new RoomVisual(room.name).text('.', (hostilesArmed[0].pos.x - 0.5), (hostilesArmed[0].pos.y + 0.1), {size: 0.4, color: 'red'});
                    new RoomVisual(room.name).text('.', (hostilesArmed[0].pos.x + 0.5), (hostilesArmed[0].pos.y + 0.1), {size: 0.4, color: 'red'});
                    new RoomVisual(room.name).text('.', (hostilesArmed[0].pos.x), (hostilesArmed[0].pos.y - 0.4), {size: 0.4, color: 'red'});
                    new RoomVisual(room.name).text('.', (hostilesArmed[0].pos.x), (hostilesArmed[0].pos.y + 0.6), {size: 0.4, color: 'red'});
                }
                else {
                    var hostiles = room.find(FIND_HOSTILE_CREEPS);
                    if (hostiles.length > 0) {
                        tower.attack(hostiles[0]);
                        //VISUALS
                        new RoomVisual(room.name).text('.', (hostiles[0].pos.x - 0.5), (hostiles[0].pos.y + 0.1), {size: 0.4, color: 'red'});
                        new RoomVisual(room.name).text('.', (hostiles[0].pos.x + 0.5), (hostiles[0].pos.y + 0.1), {size: 0.4, color: 'red'});
                        new RoomVisual(room.name).text('.', (hostiles[0].pos.x), (hostiles[0].pos.y - 0.4), {size: 0.4, color: 'red'});
                        new RoomVisual(room.name).text('.', (hostiles[0].pos.x), (hostiles[0].pos.y + 0.6), {size: 0.4, color: 'red'});
                    }
                    else {
                        var closestWounded = tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (w) => w.hits < w.hitsMax });
                        if (closestWounded) {
                            tower.heal(closestWounded);
                            //VISUALS
                            new RoomVisual(room.name).text('.', (closestWounded.pos.x - 0.5), (closestWounded.pos.y + 0.1), {size: 0.4, color: 'green'});
                            new RoomVisual(room.name).text('.', (closestWounded.pos.x + 0.5), (closestWounded.pos.y + 0.1), {size: 0.4, color: 'green'});
                            new RoomVisual(room.name).text('.', (closestWounded.pos.x), (closestWounded.pos.y - 0.4), {size: 0.4, color: 'green'});
                            new RoomVisual(room.name).text('.', (closestWounded.pos.x), (closestWounded.pos.y + 0.6), {size: 0.4, color: 'green'});
                        }
                        else {
                            var repairs = room.find(FIND_STRUCTURES, { filter: (s) => ((s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) && (s.hits < 1000)) });
                            if (repairs.length > 0) {
                                tower.repair(repairs[0]);
                                //VISUALS
                                new RoomVisual(room.name).text('.', (repairs[0].pos.x - 0.5), (repairs[0].pos.y + 0.1), {size: 0.4, color: 'blue'});
                                new RoomVisual(room.name).text('.', (repairs[0].pos.x + 0.5), (repairs[0].pos.y + 0.1), {size: 0.4, color: 'blue'});
                                new RoomVisual(room.name).text('.', (repairs[0].pos.x), (repairs[0].pos.y - 0.4), {size: 0.4, color: 'blue'});
                                new RoomVisual(room.name).text('.', (repairs[0].pos.x), (repairs[0].pos.y + 0.6), {size: 0.4, color: 'blue'});
                            }
                            else {
                                var findConstructionSiteToRepair = room.find(FIND_STRUCTURES, { filter: (s) => ((s.structureType === STRUCTURE_ROAD) && (s.hits < s.hitsMax)) });
                                if (findConstructionSiteToRepair.length > 0) {
                                    var i = 0;
                                    var b = 0;
                                    while (i < findConstructionSiteToRepair.length) {
                                        if (b === 0) {
                                            var pos = findConstructionSiteToRepair[i].pos;
                                            if (Memory.rooms[room.name].trail) {
                                                if (Memory.rooms[room.name].trail[pos]) {
                                                    var road = Memory.rooms[room.name].trail[pos];
                                                    if (road) {
                                                        if (road.usedtimes > 500) {
                                                            tower.repair(findConstructionSiteToRepair[i]);
                                                            //VISUALS
                                                            new RoomVisual(room.name).text('.', (findConstructionSiteToRepair[i].pos.x - 0.5), (findConstructionSiteToRepair[i].pos.y + 0.1), {size: 0.4, color: 'blue'});
                                                            new RoomVisual(room.name).text('.', (findConstructionSiteToRepair[i].pos.x + 0.5), (findConstructionSiteToRepair[i].pos.y + 0.1), {size: 0.4, color: 'blue'});
                                                            new RoomVisual(room.name).text('.', (findConstructionSiteToRepair[i].pos.x), (findConstructionSiteToRepair[i].pos.y - 0.4), {size: 0.4, color: 'blue'});
                                                            new RoomVisual(room.name).text('.', (findConstructionSiteToRepair[i].pos.x), (findConstructionSiteToRepair[i].pos.y + 0.6), {size: 0.4, color: 'blue'});
                                                            b++;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        i++;
                                    }
                                }
                                else {
                                    var totalRepairs = countRepairs(room.name);
                                    if (totalRepairs > 0) {
                                        var findConstructionSiteToRepair = room.find(FIND_STRUCTURES, { filter: (s) => ((s.structureType !== STRUCTURE_ROAD) && (s.hits < s.hitsMax && s.hits < 10001)) });
                                        tower.repair(findConstructionSiteToRepair[0]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

//CHECK IF HAVE HOSTILES
checkAttacks =
    function (room) {
        //CHECK IF ROOM IS UNDER ATTACK
        if (Memory.rooms[room.name].security) {
            var hostiles = room.find(FIND_HOSTILE_CREEPS, { filter: function (object) { return object.getActiveBodyparts(ATTACK) > 0 } });
            if (hostiles.length > 0) {
                Memory.rooms[room.name].security.underattack = 'yes';
            }
            else {
                Memory.rooms[room.name].security.underattack = 'no';
            }
        }
    };

//CHECK HOTILES IN RANGE
checkHostilesInRange =
    function (creep) {
        //CHECK IF ROOM IS UNDER ATTACK
        var hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5, { filter: function (object) { return object.getActiveBodyparts(ATTACK) > 0 } });
        if (hostiles.length > 0) {
            creep.moveTo(creep.room.controller);
        }
    };

//SPAWN PROGRESS
spawnProgress =
    function (spawn) {
        if (spawn.spawning) {
            new RoomVisual(spawn.pos.roomName).text('Remaining: ' + parseInt(spawn.spawning.remainingTime), (spawn.pos.x - 0.01), (spawn.pos.y + 1.2), { align: 'center', size: '0.5', color: 'white', opacity: 0.5 });
        }
    };

//VISUAL TRAIL
showTrails =
    function (room) {

        //SHOW CREEP TRAIL
        var paths = Memory.rooms[room.name].trail;
        for (var path in paths) {
            if (paths[path].lastused > (Game.time - 16) && paths[path].lastused < (Game.time - 10)) {
                new RoomVisual(room.name).text('.', (paths[path].x), (paths[path].y + 0.05), { size: 0.2, opacity: 0.8, color: '#ffff00' });
            }
            if (paths[path].lastused > (Game.time - 11) && paths[path].lastused < (Game.time - 5)) {
                new RoomVisual(room.name).text('.', (paths[path].x), (paths[path].y + 0.05), { size: 0.5, opacity: 0.8, color: '#ffff00' });
            }
            if (paths[path].lastused > (Game.time - 6) && paths[path].lastused < (Game.time + 1)) {
                new RoomVisual(room.name).text('.', (paths[path].x), (paths[path].y + 0.05), { size: 0.8, opacity: 0.8, color: '#ffff00' });
            }
            if (paths[path].usedtimes >= 20 && paths[path].lastused < (Game.time - 10)) {
                new RoomVisual(room.name).text('.', (paths[path].x), (paths[path].y + 0.05), { size: 0.8, opacity: 0.8, color: 'black' });
            }
        }

    };


//VISUAL SCREEN
showRoomInfoInScreen =
    function (room) {
        var roomName = room.name;
        if (Memory.rooms[roomName]) {
            if (Memory.rooms[roomName].config) {
                if (Memory.rooms[roomName].config.display) {
                    if (Memory.system.config.display === 'on') {
                        if (Game.rooms[roomName].controller) {
                            if (Game.rooms[roomName].visual.getSize() < 512000) {
                                // cannot add more visuals in this tick
                                var room = Game.rooms[roomName];
                                //ROOM STATS
                                new RoomVisual(roomName).text('ROOM ' + roomName, 1, 1, { align: 'left' });
                                new RoomVisual(roomName).text('LVL ' + room.controller.level, 6, 1, { align: 'left' });
                                //ENERGY STATS
                                new RoomVisual(roomName).text('ENERGY: ' + parseInt((100 / Game.rooms[roomName].energyCapacityAvailable) * Game.rooms[roomName].energyAvailable) + '% [' + Game.rooms[roomName].energyAvailable + '/' + Game.rooms[roomName].energyCapacityAvailable + 'W]', 1, 2, { align: 'left' });
                                //JOBS
                                var cs = countConstructions(roomName);
                                var rp = countRepairs(roomName);
                                new RoomVisual(roomName).text('CS: ' + cs, 1, 4, { align: 'left' });
                                new RoomVisual(roomName).text('RP: ' + rp, 1, 5, { align: 'left' });
                                //CPU STATS
                                new RoomVisual(roomName).text('CORES: ' + (Game.cpu.limit), 40, 1, { align: 'left' });
                                new RoomVisual(roomName).text('CPU: ' + parseInt(Game.cpu.getUsed()) + '%', 40, 2, { align: 'left' });
                                new RoomVisual(roomName).text('BURST: ' + Game.cpu.bucket, 40, 3, { align: 'left' });
                                new RoomVisual(roomName).text('TICK:' + Game.cpu.tickLimit, 40, 4, { align: 'left' });
                                new RoomVisual(roomName).text('VMEM:' + room.visual.getSize(), 40, 5, { align: 'left' });
                                //ROOM CONTROLLER
                                new RoomVisual(roomName).text('LVL ' + room.controller.level, (room.controller.pos.x), (room.controller.pos.y + 1.5), { align: 'center', size: '0.50', color: 'gray', opacity: 0.2 });
                                //CREEPS STATS
                                new RoomVisual(roomName).text('H: ' + countCreeps('harvester', roomName), 1, 7, { align: 'left' });
                                new RoomVisual(roomName).text('U: ' + countCreeps('upgrader', roomName), 1, 8, { align: 'left' });
                                new RoomVisual(roomName).text('E: ' + countCreeps('engineer', roomName), 1, 9, { align: 'left' });
                                new RoomVisual(roomName).text('T: ' + countCreeps('transporter', roomName), 1, 10, { align: 'left' });
                                new RoomVisual(roomName).text('G: ' + countCreeps('guard', roomName), 1, 11, { align: 'left' });
                                new RoomVisual(roomName).text('C: ' + countCreeps('claimer', roomName), 1, 12, { align: 'left' });

                            }
                        }
                    }
                }
            }
        }
    };

//MAKE TRAIL
saveTrail =
    function (creep) {
        var roomname = creep.room.name;

        var placeCod = creep.pos;
        var placeCodx = creep.pos.x;
        var placeCody = creep.pos.y;
        if (Memory.rooms[roomname]) {
            if (Memory.rooms[roomname].trail) {
                if (!Memory.rooms[roomname].trail[placeCod] || Memory.rooms[roomname].trail[placeCod] === 'undefined') {
                    Memory.rooms[roomname].trail[placeCod] = {};
                    Memory.rooms[roomname].trail[placeCod].usedtimes = 1;
                    Memory.rooms[roomname].trail[placeCod].lastused = Game.time;
                    Memory.rooms[roomname].trail[placeCod].x = placeCodx;
                    Memory.rooms[roomname].trail[placeCod].y = placeCody;
                }
                if (Memory.rooms[roomname].trail[placeCod]) {
                    var oldregister = Memory.rooms[roomname].trail[placeCod].usedtimes;
                    var newregister = (oldregister + 1);
                    Memory.rooms[roomname].trail[placeCod].usedtimes = newregister;
                    Memory.rooms[roomname].trail[placeCod].lastused = Game.time;
                }
            }
        }
    };

//DECREASE ROADS NOT USED
decreaseRoads =
function (room) {
    var paths = Memory.rooms[room.name].trail;
    for (var path in paths) {
        //AUTO DECREASE ROADS
        var oldregister = Memory.rooms[room.name].trail[path].usedtimes;
        var newregister = (Memory.rooms[room.name].trail[path].usedtimes-1);
        Memory.rooms[room.name].trail[path].usedtimes = newregister;
        if (Memory.rooms[room.name].trail[path].usedtimes < 1) {
            delete Memory.rooms[room.name].trail[path];
        }
    }
};

//AUTO BUILD ROADS
autoBuildRoads =
function (room) {
    if (room.controller.level > 1) {
        var ca = room.find(FIND_CONSTRUCTION_SITES);
        var paths = Memory.rooms[room.name].trail;
        if (ca.length < 2) {
            var i = 0;
            for (var path in paths) {
                //AUTO CONSTRUCTION ROADS
                if (Memory.rooms[room.name].trail[path]) {
                    if (Memory.rooms[room.name].trail[path].usedtimes) {
                        if (Memory.rooms[room.name].trail[path].usedtimes >= 5000) {
                            var roadHere = new RoomPosition(Memory.rooms[room.name].trail[path].x, Memory.rooms[room.name].trail[path].y, room.name);
                            roadHere.createConstructionSite(STRUCTURE_ROAD);
                        }
                    }
                }
            }
        }
    }
};

//AUTO BUILD
autoBuild =
function (room) {

    //PASSO 0 - SPAWN
    if (Memory.rooms[room.name].info.constructionslevel === 0) {
        if (room.controller.level > 0) {
            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length === 0) {
                var spawn = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_SPAWN)});
                console.log(spawn.length);
                if (spawn.length === 0) {
                    var flag = Game.flags.claim;
                    if (flag) {
                        var spawnPos = new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName);
                        spawnPos.createConstructionSite(STRUCTURE_SPAWN);
                    }
                }
                else {
                    Memory.rooms[room.name].info.constructionslevel = 1;
                    if (Game.flags.claim) {
                        Game.flags.claim.remove();
                    }
                }
            }
        }
    }

    //PASSO 1 - EXTENSIONS
    if (Memory.rooms[room.name].info.constructionslevel === 1) {
        if (room.controller.level >= 2) {
            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length === 0) {
                var extensions = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_EXTENSION)});
                if (extensions.length < 5) {
                    var someroad = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_ROAD)});
                    if (someroad.length > 0) {
                        var someNumber = Math.floor((Math.random() * someroad.length) + 1);
                        var freeSpace = getRandomFreePosOutOfRoad(someroad[someNumber].pos, 1, room);
                        if (freeSpace) {
                            freeSpace.createConstructionSite(STRUCTURE_EXTENSION);
                        }
                    }
                }
                else {
                    Memory.rooms[room.name].info.constructionslevel = 2;
                }
            }
        }
        else {
            Memory.rooms[room.name].info.constructionslevel = 0;
        }
    }

    //PASSO 2 - CONTAINER NEAR ROOM CONTROLLER AND SOURCES
    if (Memory.rooms[room.name].info.constructionslevel === 2) {
        var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length === 0) {
            var haveContainer = Memory.rooms[room.name].structure.container.controller;
            if (!haveContainer) {
                var getFreePos = getRandomFreePosOutOfRoad(room.controller.pos, 2, room);
                if (getFreePos !== 'searching') {
                    getFreePos.createConstructionSite(STRUCTURE_CONTAINER);
                }
            }
            else {
                var sourceId = Memory.rooms[room.name].sources[0];
                var source = Game.getObjectById(sourceId);
                if (Memory.rooms[room.name].structure.container.source) {
                    if (Memory.rooms[room.name].structure.container.source[0]) {
                        var haveContainer = Memory.rooms[room.name].structure.container.source[0];
                    }
                    else {
                        var haveContainer = null;
                    }
                }
                else {
                    var haveContainer = null;
                }
                if (!haveContainer) {
                    var getFreePos = getRandomFreePosOutOfRoad(source.pos, 2, room);
                    if (getFreePos !== 'searching') {
                        getFreePos.createConstructionSite(STRUCTURE_CONTAINER);
                    }
                }
                else {
                    var sourceId = Memory.rooms[room.name].source[1];
                    var source = Game.getObjectById(sourceOneId);
                    if (Memory.rooms[room.name].structure.container.source) {
                        if (Memory.rooms[room.name].structure.container.source[1]) {
                            var haveContainer = Memory.rooms[room.name].structure.container.source[1];
                        }
                        else {
                            var haveContainer = null;
                        }
                    }
                    else {
                        var haveContainer = null;
                    }
                    if (!haveContainer) {
                        var getFreePos = getRandomFreePosOutOfRoad(source.pos, 2, room);
                        if (getFreePos !== 'searching') {
                            getFreePos.createConstructionSite(STRUCTURE_CONTAINER);
                        }
                    }
                    else {
                        var sourceId = Memory.rooms[room.name].source[2];
                        var source = Game.getObjectById(sourceOneId);
                        if (Memory.rooms[room.name].structure.container.source) {
                            if (Memory.rooms[room.name].structure.container.source[2]) {
                                var haveContainer = Memory.rooms[room.name].structure.container.source[2];
                            }
                            else {
                                var haveContainer = null;
                            }
                        }
                        else {
                            var haveContainer = null;
                        }
                        if (!haveContainer) {
                            var getFreePos = getRandomFreePosOutOfRoad(source.pos, 2, room);
                            if (getFreePos !== 'searching') {
                                getFreePos.createConstructionSite(STRUCTURE_CONTAINER);
                            }
                        }
                        else {
                            var sourceId = Memory.rooms[room.name].source[3];
                            var source = Game.getObjectById(sourceOneId);
                            if (Memory.rooms[room.name].structure.container.source) {
                                if (Memory.rooms[room.name].structure.container.source[3]) {
                                    var haveContainer = Memory.rooms[room.name].structure.container.source[3];
                                }
                                else {
                                    var haveContainer = null;
                                }
                            }
                            else {
                                var haveContainer = null;
                            }
                            if (!haveContainer) {
                                var getFreePos = getRandomFreePosOutOfRoad(source.pos, 2, room);
                                if (getFreePos !== 'searching') {
                                    getFreePos.createConstructionSite(STRUCTURE_CONTAINER);
                                }
                                else {
                                  Memory.rooms[room.name].info.constructionslevel = 3;
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    //PASSO 3 - TOWER NEAR SPAWN
    if (Memory.rooms[room.name].info.constructionslevel === 3) {
        if (room.controller.level >= 3) {
            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length === 0) {
                var tower = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_TOWER});
                if (tower.length === 0) {
                    var spawn = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_SPAWN)});
                    if (spawn.length > 0) {
                        var freeSpace = getRandomFreePosOutOfRoad(spawn[0].pos, 7, room);
                        if (freeSpace) {
                            freeSpace.createConstructionSite(STRUCTURE_TOWER);
                        }
                    }
                }
                else {
                    Memory.rooms[room.name].info.constructionslevel = 4;
                }
            }
        }
        else {
            Memory.rooms[room.name].info.constructionslevel = 1;
        }
    }

    //PASSO 4 - EXTENSIONS
    if (Memory.rooms[room.name].info.constructionslevel === 4) {
        if (room.controller.level >= 3) {
            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length === 0) {
                var extensions = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_EXTENSION)});
                if (extensions.length < 10) {
                    var someroad = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_ROAD)});
                    var someNumber = Math.floor((Math.random() * someroad.length) + 1);
                    if (someroad[someNumber]) {
                        if (someroad.length > 0) {
                            var freeSpace = getRandomFreePosOutOfRoad(someroad[someNumber].pos, 1, room);
                            if (freeSpace !== 'searching') {
                                freeSpace.createConstructionSite(STRUCTURE_EXTENSION);
                            }
                        }
                    }
                }
                else {
                    Memory.rooms[room.name].info.constructionslevel = 5;
                }
            }
        }
    }

    //PASSO 5 - EXTENSIONS
    if (Memory.rooms[room.name].info.constructionslevel === 5) {
        if (room.controller.level >= 4) {
            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length === 0) {
                var extensions = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_EXTENSION)});
                var extensionsLimit = checkExtensionsLimits(room);
                if (extensions.length < 20) {
                    var someroad = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_ROAD)});
                    if (someroad.length > 0) {
                        var someNumber = Math.floor((Math.random() * someroad.length) + 1);
                        var freeSpace = getRandomFreePosOutOfRoad(someroad[someNumber].pos, 1, room);
                        if (freeSpace !== 'searching') {
                            freeSpace.createConstructionSite(STRUCTURE_EXTENSION);
                        }
                    }
                }
                else {
                    Memory.rooms[room.name].info.constructionslevel = 6;
                }
            }
        }
        else {
            Memory.rooms[room.name].info.constructionslevel = 3;
        }
    }

    //PASSO 6 - TOWER NEAR SPAWN
    if (Memory.rooms[room.name].info.constructionslevel === 6) {
        if (room.controller.level >= 5) {
            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length === 0) {
                var tower = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_TOWER});
                if (tower.length === 1) {
                    var spawn = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_SPAWN)});
                    if (spawn.length > 0) {
                        var freeSpace = getRandomFreePosOutOfRoad(spawn[0].pos, 7, room);
                        if (freeSpace !== 'searching') {
                            freeSpace.createConstructionSite(STRUCTURE_TOWER);
                        }
                    }
                }
                else {
                    Memory.rooms[room.name].info.constructionslevel = 7;
                }
            }
        }
        else {
            Memory.rooms[room.name].info.constructionslevel = 5;
        }

    }

    //PASSO 7 - EXTENSIONS
    if (Memory.rooms[room.name].info.constructionslevel === 7) {
        if (room.controller.level >= 5) {
            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length === 0) {
                var extensions = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_EXTENSION)});
                var extensionsLimit = checkExtensionsLimits(room);
                if (extensions.length < 30) {
                    var someroad = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_ROAD)});
                    if (someroad.length > 0) {
                    var someNumber = Math.floor((Math.random() * someroad.length) + 1);
                    var freeSpace = getRandomFreePosOutOfRoad(someroad[someNumber].pos, 1, room);
                    if (freeSpace !== 'searching') {
                        freeSpace.createConstructionSite(STRUCTURE_EXTENSION);
                    }
                    }
                }
                else {
                    Memory.rooms[room.name].info.constructionslevel = 8;
                }
            }
        }
    }

    //PASSO 8 - STORAGE NEAR MINERAL
    if (Memory.rooms[room.name].info.constructionslevel === 8) {
        if (room.controller.level >= 5) {
            var storage = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_STORAGE)});
            if (storage.length === 0) {
                var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
                if (constructionSites.length === 0) {
                    var mineral = Memory.rooms[room.name].mineral;
                    if (mineral) {
                        var freeSpace = getRandomFreePosOutOfRoad(mineral.pos, 3, room);
                        if (freeSpace !== 'searching') {
                            freeSpace.createConstructionSite(STRUCTURE_STORAGE);
                        }
                    }
                }
            }
            else {
                Memory.rooms[room.name].info.constructionslevel = 9;
            }
        }
    }

    //PASSO 9 - EXTENSIONS
    if (Memory.rooms[room.name].info.constructionslevel === 9) {
        if (room.controller.level >= 6) {
            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length === 0) {
                var extensions = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_EXTENSION)});
                var extensionsLimit = checkExtensionsLimits(room);
                if (extensions.length < 40) {
                    var someroad = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_ROAD)});
                    if (someroad.length > 0) {
                    var someNumber = Math.floor((Math.random() * someroad.length) + 1);
                    var freeSpace = getRandomFreePosOutOfRoad(someroad[someNumber].pos, 1, room);
                    if (freeSpace !== 'searching') {
                        freeSpace.createConstructionSite(STRUCTURE_EXTENSION);
                    }
                    }
                }
                else {
                    Memory.rooms[room.name].info.constructionslevel = 10;
                }
            }
        }
        else {
            Memory.rooms[room.name].info.constructionslevel = 10;
        }
    }

    //PASSO 10 - EXTRACTOR
    if (Memory.rooms[room.name].info.constructionslevel === 10) {
        if (room.controller.level >= 6) {
            var extractor = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_EXTRACTOR)});
            if (extractor.length === 0) {
                var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
                if (constructionSites.length === 0) {
                    var mineral = Memory.rooms[room.name].mineral;
                    if (mineral) {
                        var mineralPos = new RoomPosition(mineral.pos.x, mineral.pos.y, mineral.pos.roomName);
                        mineralPos.createConstructionSite(STRUCTURE_EXTRACTOR);
                    }
                }
            }
            else {
                Memory.rooms[room.name].info.constructionslevel = 11;
            }
        }
    }

    //PASSO 11 - LAB
    if (Memory.rooms[room.name].info.constructionslevel === 11) {
        if (room.controller.level >= 6) {
            var labs = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_LAB)});
            if (labs.length === 0) {
                var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
                if (constructionSites.length === 0) {
                    var mineral = Memory.rooms[room.name].mineral;
                    if (mineral) {
                        var freeSpace = getRandomFreePosOutOfRoad(mineral.pos, 3, room);
                        if (freeSpace !== 'searching') {
                            freeSpace.createConstructionSite(STRUCTURE_LAB);
                        }
                    }
                }
            }
            else {
                Memory.rooms[room.name].info.constructionslevel = 0;
            }
        }
    }
    //PASSO 11 - LAB
    if (Memory.rooms[room.name].info.constructionslevel === 12) {
      Memory.rooms[room.name].info.constructionslevel = 0;
    }
};

//AUTO BUILD WALLS AND RAMPARTS
autoBuildWalls =
function (room) {
    if (room.controller.level >= 5) {
        var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length === 0) {
            if (Memory.rooms[room.name].exit) {
                var top = Memory.rooms[room.name].exit.top;
                var bot = Memory.rooms[room.name].exit.bottom;
                var left = Memory.rooms[room.name].exit.left;
                var right = Memory.rooms[room.name].exit.right;
                //CREATE CS WALLS
                if (left) {
                    for (var pos in left) {
                        var wall = Memory.rooms[room.name].exit.left[pos];
                        if (wall) {
                            var place = new RoomPosition(2, wall, room.name);
                            place.createConstructionSite(STRUCTURE_WALL);
                        }
                    }
                }
                if (right) {
                    for (var pos in right) {
                        var wall = Memory.rooms[room.name].exit.right[pos];
                        if (wall) {
                            var place = new RoomPosition(47, wall, room.name);
                            place.createConstructionSite(STRUCTURE_WALL);
                        }
                    }
                }
                if (top) {
                    for (var pos in top) {
                        var wall = Memory.rooms[room.name].exit.top[pos];
                        if (wall) {
                            var place = new RoomPosition(wall, 2, room.name);
                            place.createConstructionSite(STRUCTURE_WALL);
                        }
                    }
                }
                if (bot) {
                    for (var pos in bot) {
                        var wall = Memory.rooms[room.name].exit.bottom[pos];
                        if (wall) {
                            var place = new RoomPosition(wall, 47, room.name);
                            place.createConstructionSite(STRUCTURE_WALL);
                        }
                    }
                }
                //CREATE CS RAMPART AND BORDERS
                var countExits = room.find(FIND_EXIT_LEFT);
                var rexits = Memory.rooms[room.name].exit.left;
                var i = 1;
                for (var exit in rexits) {
                    if (i === 1) {
                        var place = new RoomPosition(1, (Memory.rooms[room.name].exit.left[exit]-2), room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition(2, (Memory.rooms[room.name].exit.left[exit]-2), room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition(2, (Memory.rooms[room.name].exit.left[exit]-1), room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                    }
                    if (i === parseInt(countExits.length/2)) {
                        var place = new RoomPosition(2, (Memory.rooms[room.name].exit.left[exit]+1), room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                    }
                    if (i === (countExits.length-1)) {
                        var place = new RoomPosition(2, (Memory.rooms[room.name].exit.left[exit]+1), room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                        var place = new RoomPosition(2, (Memory.rooms[room.name].exit.left[exit]+2), room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition(1, (Memory.rooms[room.name].exit.left[exit]+2), room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                    }
                    i++;
                }
                //CREATE CS RAMPART AND BORDERS
                var countExits = room.find(FIND_EXIT_RIGHT);
                var rexits = Memory.rooms[room.name].exit.right;
                var i = 1;
                for (var exit in rexits) {
                    if (i === 1) {
                        var place = new RoomPosition(48, (Memory.rooms[room.name].exit.right[exit]-2), room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition(47, (Memory.rooms[room.name].exit.right[exit]-2), room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition(47, (Memory.rooms[room.name].exit.right[exit]-1), room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                    }
                    if (i === parseInt(countExits.length/2)) {
                        var place = new RoomPosition(47, (Memory.rooms[room.name].exit.right[exit]+1), room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                    }
                    if (i === (countExits.length-1)) {
                        var place = new RoomPosition(47, (Memory.rooms[room.name].exit.right[exit]+1), room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                        var place = new RoomPosition(47, (Memory.rooms[room.name].exit.right[exit]+2), room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition(48, (Memory.rooms[room.name].exit.right[exit]+2), room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                    }
                    i++;
                }
                //CREATE CS RAMPART AND BORDERS
                var countExits = room.find(FIND_EXIT_TOP);
                var rexits = Memory.rooms[room.name].exit.top;
                var i = 1;
                for (var exit in rexits) {
                    if (i === 1) {
                        var place = new RoomPosition((Memory.rooms[room.name].exit.top[exit]-2), 1, room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition((Memory.rooms[room.name].exit.top[exit]-2), 2, room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition((Memory.rooms[room.name].exit.top[exit]-1), 2, room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                    }
                    if (i === parseInt(countExits.length/2)) {
                        var place = new RoomPosition((Memory.rooms[room.name].exit.top[exit]+1), 2, room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                    }
                    if (i === (countExits.length-1)) {
                        var place = new RoomPosition((Memory.rooms[room.name].exit.top[exit]+1), 2, room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                        var place = new RoomPosition((Memory.rooms[room.name].exit.top[exit]+2), 2, room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition((Memory.rooms[room.name].exit.top[exit]+2), 1, room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                    }
                    i++;
                }
                //CREATE CS RAMPART AND BORDERS
                var countExits = room.find(FIND_EXIT_BOTTOM);
                var rexits = Memory.rooms[room.name].exit.bottom;
                var i = 1;
                for (var exit in rexits) {
                    if (i === 1) {
                        var place = new RoomPosition((Memory.rooms[room.name].exit.bottom[exit]-2), 48, room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition((Memory.rooms[room.name].exit.bottom[exit]-2), 47, room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition((Memory.rooms[room.name].exit.bottom[exit]-1), 47, room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                    }
                    if (i === parseInt(countExits.length/2)) {
                        var place = new RoomPosition((Memory.rooms[room.name].exit.bottom[exit]+1), 47, room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                    }
                    if (i === (countExits.length-1)) {
                        var place = new RoomPosition((Memory.rooms[room.name].exit.bottom[exit]+1), 47, room.name);
                        place.createConstructionSite(STRUCTURE_RAMPART);
                        var place = new RoomPosition((Memory.rooms[room.name].exit.bottom[exit]+2), 47, room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                        var place = new RoomPosition((Memory.rooms[room.name].exit.bottom[exit]+2), 48, room.name);
                        place.createConstructionSite(STRUCTURE_WALL);
                    }
                    i++;
                }
            }
        }
    }
};

moveToByPath =
function (creep, target) {
    let roomName = creep.pos.roomName;
    let ret = PathFinder.search(
        creep.pos, target,
        {
        // We need to set the defaults costs higher so that we
        // can set the road cost lower in `roomCallback`
        plainCost: 2,
        swampCost: 10,

        roomCallback: function(roomName) {

            let room = Game.rooms[roomName];
            // In this example `room` will always exist, but since
            // PathFinder supports searches which span multiple rooms
            // you should be careful!
            if (!room) return;
            let costs = new PathFinder.CostMatrix;

            room.find(FIND_STRUCTURES).forEach(function(struct) {
            if (struct.structureType === STRUCTURE_ROAD) {
                // Favor roads over plain tiles
                costs.set(struct.pos.x, struct.pos.y, 1);
            } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                        (struct.structureType !== STRUCTURE_RAMPART ||
                        !struct.my)) {
                // Can't walk through non-walkable buildings
                costs.set(struct.pos.x, struct.pos.y, 0xff);
            }
            });

            // Avoid creeps in the room
            room.find(FIND_CREEPS).forEach(function(creep) {
            costs.set(creep.pos.x, creep.pos.y, 0xff);
            });

            return costs;
        },
        }
    );

    var pos = ret.path[0];

    if (pos) {
        creep.move(creep.pos.getDirectionTo(pos));
    }
};
