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
        return 1;
    };

//SET TARGET
setTarget =
    function (creep, targetid, type, roomname) {
        creep.memory.targetId = targetid;
        creep.memory.targetType = type;
        creep.memory.targetRoom = roomname;
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
        if (checkPlace[0].type === 'terrain') {
            var place = new RoomPosition(x, y, startPos.roomName);
            new RoomVisual(startPos.roomName).text('âœ”', x, y, { align: 'center', size: '0.7', color: 'green' });
            return place;
        }
        else {
            new RoomVisual(startPos.roomName).text('ðŸš«', x, y, { align: 'center', size: '0.7', color: 'red' });
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

//ADD CREEP IN QUEUE
addToQueue =
    function (type, spawnname, goto) {
        var spawn = Game.spawns[spawnname];
        //QUEUE LIST LIMIT
        var totalList = countQueue('all', spawnname);
        if (totalList >= 20) {
            log('Queue list full! Can`t add more creeps to spawn.');
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
    function (spawnname, creeptype, creepfirstaction, removeFromQueue) {
        var spawn = Game.spawns[spawnname];
        if (!spawn.spawning) {
            var totalHarvesters = countCreeps('harvester', spawn.pos.roomName);
            if (totalHarvesters === 0) {
                delete Memory.rooms[spawn.pos.roomName].spawns[spawnname].queue;
                var name = spawn.createCreep([WORK, CARRY, MOVE], null, { type: 'harvester', action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, firstaction: creepfirstaction, id: Game.time });
                if (_.isString(name)) {
                    result = ('Spawning new harvester on ' + spawn.name + ' with name ' + name + '.');
                    log(result);
                }
            }
            else {
                var totalTransporters = countCreeps('transporter', spawn.pos.roomName);
                if (totalTransporters === 0) {
                    delete Memory.rooms[spawn.pos.roomName].spawns[spawnname].queue;
                    var name = spawn.createCreep([WORK, CARRY, MOVE], null, { type: 'transporter', action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, firstaction: creepfirstaction, id: Game.time });
                    if (_.isString(name)) {
                        result = ('Spawning new transporter on ' + spawn.name + ' with name ' + name + '.');
                        log(result);
                    }
                }
                else {
                    if (spawn.energy >= 300) {
                        //ACTION: SPAWN
                        // create a balanced body as big as possible with the given energy
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
                        else if (creeptype === 'engineer') {
                            var body = [];
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

                        var canIspawn = spawn.canCreateCreep(body, null, { type: creeptype, action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, firstaction: creepfirstaction, id: Game.time });
                        if (canIspawn === 0) {
                            var name = spawn.createCreep(body, null, { type: creeptype, action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, firstaction: creepfirstaction, id: Game.time });
                            if (_.isString(name)) {
                                result = ('Spawning new ' + creeptype + ' on ' + spawn.name + ' with name ' + name + '.');
                                delete Memory.rooms[spawn.pos.roomName].spawns[spawn.name].queue[removeFromQueue];
                                log(result);
                            }
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
            }
            else {
                var hostiles = room.find(FIND_HOSTILE_CREEPS, { filter: function (object) { return object.getActiveBodyparts(ATTACK) > 0 } });
                if (hostiles.length > 0) {
                    var towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
                    tower.attack(hostiles[0]);
                }
                else {
                    var closestWounded = tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (w) => w.hits < w.hitsMax });
                    if (closestWounded) {
                        tower.heal(closestWounded);
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
                                                if (road.usedtimes > 10) {
                                                    tower.repair(findConstructionSiteToRepair[i]);
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


//VISUAL SCREEN
showRoomInfoInScreen =
    function (room) {
        var roomName = room.name;
        if (Memory.rooms[roomName]) {
            //VISUAL ROADS
            var paths = Memory.rooms[room.name].trail;
            for (var path in paths) {
                if (paths[path].lastused > (Game.time - 16) && paths[path].lastused < (Game.time - 10)) {
                    new RoomVisual(room.name).text('.', (paths[path].x), (paths[path].y + 0.05), { size: 0.3, opacity: 0.8, color: '#ffff00' });
                }
                if (paths[path].lastused > (Game.time - 11) && paths[path].lastused < (Game.time - 5)) {
                    new RoomVisual(room.name).text('.', (paths[path].x), (paths[path].y + 0.05), { size: 0.6, opacity: 0.8, color: '#ffff00' });
                }
                if (paths[path].lastused > (Game.time - 6) && paths[path].lastused < (Game.time + 1)) {
                    new RoomVisual(room.name).text('.', (paths[path].x), (paths[path].y + 0.05), { size: 1, opacity: 0.8, color: '#ffff00' });
                }
                if (paths[path].usedtimes >= 20 && paths[path].lastused < (Game.time - 10)) {
                    new RoomVisual(room.name).text('.', (paths[path].x), (paths[path].y + 0.05), { size: 1, opacity: 0.8, color: 'black' });
                }
            }
            if (Game.rooms[roomName].controller) {
                if (Game.rooms[roomName].visual.getSize() < 512000) {
                    // cannot add more visuals in this tick
                    var room = Game.rooms[roomName];
                    //ROOM STATS
                    new RoomVisual(roomName).text('MAP ' + roomName, 1, 1, { align: 'left' });
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
                    new RoomVisual(roomName).text('C: ' + countCreeps('claimer', roomName), 1, 11, { align: 'left' });

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
    };


