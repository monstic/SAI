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
            var total = room.find(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_CONTAINER)});
            return total.length;
        }
    };

//COUNT BUILDS TO REPAIR
countRepairs =
    function (roomname) {
        var room = Game.rooms[roomname];
        if (Memory.rooms[roomname]) {
            var total = room.find(FIND_STRUCTURES, {filter: (s) => (s.hits < s.hitsMax)});
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
    function (sourceid) {
        var total = (_.sum(Game.creeps, (c) => c.memory.sourceId === sourceid));
        return total;
    };

//CHECK IF IS SCHEDULED
countQueue =
    function (type, spawnname) {
        var spawn = Game.spawns[spawnname];
        if (Memory.rooms[spawn.pos.roomName]) {
            if (Memory.rooms[spawn.pos.roomName].spawns) {
                if (type === 'all') {
                    var total = _.sum(Memory.spawns[spawnname].queue, (s) => s.spawnname === spawnname);
                    return total;
                }
                else {
                    var total = _.sum(Memory.spawns[spawnname].queue, (s) => (s.type === type && s.spawnname === spawnname));
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
    };

//SIGN CONTROLLER
signController =
    function (creep) {
        if(creep.room.controller) {
            if(creep.room.controller.my) {
                if(!creep.room.controller.sign) {
                    var SignMessage = Memory.system.signmsg;
                    if(creep.signController(creep.room.controller, SignMessage) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
    };

//GET RAMDOM POSITION WITHOUT STRUCTURES
getRandomFreePos =
    function (startPos, distance) {
        var x,y;
        do {
            x = startPos.x + Math.floor(Math.random()*(distance*2+1)) - distance;
            y = startPos.y + Math.floor(Math.random()*(distance*2+1)) - distance;
        }
        while((x+y)%2 !== (startPos.x+startPos.y)%2 || Game.map.getTerrainAt(x,y,startPos.roomName) === 'wall');
        return new RoomPosition(x, y, startPos.roomName);
    };


//GET RAMDOM POSITION WITHOUT STRUCTURES AND OUT OF ROAD
getRandomFreePosOutOfRoad =
    function (startPos, distance, room) {
        var x,y;
        do {
            x = startPos.x + Math.floor(Math.random()*(distance*2+1)) - distance;
            y = startPos.y + Math.floor(Math.random()*(distance*2+1)) - distance;
        }
        while((x+y)%2 !== (startPos.x+startPos.y)%2 || Game.map.getTerrainAt(x,y,startPos.roomName) === 'wall');
        var checkPlace = room.lookAt(x, y);
        if (checkPlace[0].type === 'terrain') {
            var place = new RoomPosition(x, y, startPos.roomName);
            new RoomVisual(startPos.roomName).text('âœ”', x, y, {align: 'center', size: '0.7', color: 'green'});
            return place;
        }
        else {
            new RoomVisual(startPos.roomName).text('ðŸš«', x, y, {align: 'center', size: '0.7', color: 'red'});
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
    function (type, spawnname, firstaction) {
        //QUEUE LIST LIMIT
        var totalList = countQueue('all', spawnname);
        if (totalList >= 20) {
            log('Queue list full! Can`t add more creeps to spawn.');
        }
        else {
            var taskId = Game.time;
            if (!Memory.spawns[spawnname].queue[taskId]) {
                Memory.spawns[spawnname].queue[taskId] = {};
                Memory.spawns[spawnname].queue[taskId].type = type;
                Memory.spawns[spawnname].queue[taskId].spawnname = spawnname;
                Memory.spawns[spawnname].queue[taskId].registertime = taskId;
                //OPTIONS
                if (firstaction) {
                    Memory.spawns[spawnname].queue[taskId].firstaction = firstaction;
                }
                else {
                    Memory.spawns[spawnname].queue[taskId].firstaction = 0;
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
                delete Memory.spawns[spawnname].queue;
                var name = spawn.createCreep([WORK, CARRY, MOVE], null, { type: 'harvester', action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, firstaction: creepfirstaction, id: Game.time });
                if(_.isString(name)) {
                    result = ('Spawning new harvester on ' + spawn.name + ' with name ' + name + '.');
                    log(result);
                }
            }
            else {
                var totalTransporters = countCreeps('transporter', spawn.pos.roomName);
                if (totalTransporters === 0) {
                    delete Memory.spawns[spawnname].queue;
                    var name = spawn.createCreep([WORK, CARRY, MOVE], null, { type: 'transporter', action: 'undefined', homeroom: spawn.pos.roomName, homespawn: spawn.name, firstaction: creepfirstaction, id: Game.time });
                    if(_.isString(name)) {
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
                            if(_.isString(name)) {
                                result = ('Spawning new ' + creeptype + ' on ' + spawn.name + ' with name ' + name + '.');
                                delete Memory.spawns[spawn.name].queue[removeFromQueue];
                                log(result);
                            }
                        }
                    }
                }
            }
        }
    };


//LINK LINKS
linkLinks =
    function (creep) {

if (Memory.rooms[creep.room.name].links.haveLink > 0) {
    if (!Memory.rooms[creep.room.name].links.default || Memory.rooms[creep.room.name].links.default === undefined) {
        Memory.rooms[creep.room.name].links.default = {};
    }
    if (Memory.rooms[creep.room.name].links.default && !Memory.rooms[creep.room.name].links.default.from) {
        var source = creep.pos.findClosestByRange(FIND_SOURCES);
        var rangeToSource = creep.pos.getRangeTo(source);
        if (rangeToSource < 3) {
            findLinkOne = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_LINK)});
        Memory.rooms[creep.room.name].links.default.from = findLinkOne.id;
        log('Link one registered.');
    }
}
}
if (Memory.rooms[creep.room.name].links.haveLink > 1) {
    if (Memory.rooms[creep.room.name].links.default && (!Memory.rooms[creep.room.name].links.default.to || Memory.rooms[creep.room.name].links.default.to === undefined)) {
        rangeToController = creep.pos.getRangeTo(creep.room.controller);
        if (rangeToController < 2) {
            findLinkTwo = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_LINK)});
        Memory.rooms[creep.room.name].links.default.to = findLinkTwo.id;
        log('Link two registered.');
    }
    else {
        creep.moveTo(creep.room.controller);
    }
}
}
if (Memory.rooms[creep.room.name].links.haveLink > 2) {
    if (Memory.rooms[creep.room.name].links.default && (!Memory.rooms[creep.room.name].links.default.fromalt || Memory.rooms[creep.room.name].links.default.fromalt === undefined)) {
        var source = creep.pos.findClosestByRange(FIND_SOURCES);
        var rangeToSource = creep.pos.getRangeTo(source);
        if (rangeToSource < 3) {
            findLinkTree = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_LINK)});
        if (findLinkTree.id !== Memory.rooms[creep.room.name].links.default.from && findLinkTree.id !== Memory.rooms[creep.room.name].links.default.to) {
            Memory.rooms[creep.room.name].links.default.fromalt = findLinkTree.id;
            log('Link tree registered.');
        }
    }
    else {
        creep.moveTo(source);
    }
}
}
};

//TRANSFER ENERGY LINKS
enableLinks =
    function (room) {
        if (!Memory.rooms[room.name].cron.linktransfer || Memory.rooms[room.name].cron.linktransfer === undefined) {
            Memory.rooms[room.name].cron.linktransfer = {};
            Memory.rooms[room.name].cron.linktransfer.lasttransfer = Game.time;
            Memory.rooms[room.name].cron.linktransfer.transferinterval = 25;
        }
        if (Memory.rooms[room.name].cron.linktransfer.lasttransfer < (Game.time-Memory.rooms[room.name].cron.linktransfer.transferinterval)) {
            if (Memory.rooms[room.name].links) {
                if (Memory.rooms[room.name].links.default) {
                    if (Memory.rooms[room.name].links.default.from && Memory.rooms[room.name].links.default.to) {
                        var linkFromId = Memory.rooms[room.name].links.default.from;
                        var linkFrom = Game.getObjectById(linkFromId);
                        var linkToId = Memory.rooms[room.name].links.default.to;
                        var linkTo = Game.getObjectById(linkToId);
                        if (linkFrom !== null && linkTo !== null) {
                            if (linkFrom.energy > 0 && linkTo.energy < linkTo.energyCapacity) {
                                new RoomVisual(room.name).text('âš¡', (linkFrom.pos.x - 0.5), (linkFrom.pos.y + 0.1), {size: 0.4, color: 'gold'});
                                new RoomVisual(room.name).text('âš¡', (linkFrom.pos.x + 0.5), (linkFrom.pos.y + 0.1), {size: 0.4, color: 'gold'});
                                new RoomVisual(room.name).text('âš¡', (linkFrom.pos.x), (linkFrom.pos.y - 0.4), {size: 0.4, color: 'gold'});
                                new RoomVisual(room.name).text('âš¡', (linkFrom.pos.x), (linkFrom.pos.y + 0.6), {size: 0.4, color: 'gold'});
                                //log('Transferring ' + linkFrom.energy + 'e from master to slave link container in ' + room.name + ' room.');
                                linkFrom.transferEnergy(linkTo);
                                Memory.rooms[room.name].cron.linktransfer.lasttransfer = Game.time;
                            }
                        }
                    }
                    if (Memory.rooms[room.name].links.default.fromalt && Memory.rooms[room.name].links.default.to) {
                        var link2FromId = Memory.rooms[room.name].links.default.fromalt;
                        var link2From = Game.getObjectById(link2FromId);
                        var linkToId = Memory.rooms[room.name].links.default.to;
                        var linkTo = Game.getObjectById(linkToId);
                        if (link2From !== null && linkTo !== null) {
                            if (link2From.energy > 0 && linkTo.energy < linkTo.energyCapacity) {
                                new RoomVisual(room.name).text('âš¡', (link2From.pos.x - 0.5), (link2From.pos.y + 0.1), {size: 0.4, color: 'gold'});
                                new RoomVisual(room.name).text('âš¡', (link2From.pos.x + 0.5), (link2From.pos.y + 0.1), {size: 0.4, color: 'gold'});
                                new RoomVisual(room.name).text('âš¡', (link2From.pos.x), (link2From.pos.y - 0.4), {size: 0.4, color: 'gold'});
                                new RoomVisual(room.name).text('âš¡', (link2From.pos.x), (link2From.pos.y + 0.6), {size: 0.4, color: 'gold'});
                                //log('Transferring ' + linkFrom.energy + 'e from master to slave link container in ' + room.name + ' room.');
                                link2From.transferEnergy(linkTo);
                                Memory.rooms[room.name].cron.linktransfer.lasttransfer = Game.time;
                            }
                        }
                    }
                }
            }
        }
    }

//TOWERS
enableTowers =
    function (room) {
        var towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER);
        for (let tower of towers) {
            var hostilesHealer = room.find(FIND_HOSTILE_CREEPS, { filter: function(object) { return object.getActiveBodyparts(HEAL) > 0}});
            if (hostilesHealer.length > 0) {
                towers.forEach(tower => tower.attack(hostilesHealer[0]));
            }
            else {
                var hostiles = room.find(FIND_HOSTILE_CREEPS, { filter: function(object) { return object.getActiveBodyparts(ATTACK) > 0}});
                if (hostiles.length > 0) {
                    var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                    towers.forEach(tower => tower.attack(hostiles[0]));
                }
                else {
                    var closestWounded = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (w) => w.hits < w.hitsMax});
                if (closestWounded) {
                    tower.heal(closestWounded);
                }
                else {
                    var findConstructionSiteToRepair = room.find(FIND_STRUCTURES, {filter: (s) => ((s.structureType === STRUCTURE_ROAD) && (s.hits < s.hitsMax))});
                if (findConstructionSiteToRepair.length > 0) {
                    var i = 0;
                    var b = 0;
                    while (i < findConstructionSiteToRepair.length) {
                        if (b === 0) {
                            var pos = findConstructionSiteToRepair[i].pos;
                            if (Memory.rooms[room.name].mostusedpaths) {
                                if (Memory.rooms[room.name].mostusedpaths[pos]) {
                                    var road = Memory.rooms[room.name].mostusedpaths[pos];
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
                        var findConstructionSiteToRepair = room.find(FIND_STRUCTURES, {filter: (s) => ((s.structureType !== STRUCTURE_ROAD) && (s.hits < s.hitsMax && s.hits < 10001))});
                    tower.repair(findConstructionSiteToRepair[0]);
                }
            }
        }
    }
}
}
}

checkAttacks =
    function (room) {
        //CHECK IF ROOM IS UNDER ATTACK
        if (Memory.rooms[room.name].security) {
            var hostiles = room.find(FIND_HOSTILE_CREEPS, { filter: function(object) { return object.getActiveBodyparts(ATTACK) > 0}});
            if (hostiles.length > 0) {
                Memory.rooms[room.name].security.underattack = 'yes';
            }
            else {
                Memory.rooms[room.name].security.underattack = 'no';
            }
        }
    };

checkHostilesInRange =
    function (creep) {
        //CHECK IF ROOM IS UNDER ATTACK
        var hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5, { filter: function(object) { return object.getActiveBodyparts(ATTACK) > 0}});
        if (hostiles.length > 0) {
            creep.moveTo(creep.room.controller);
        }
    };

//SPAWN PROGRESS
spawnProgress =
    function (spawn) {
        if (spawn.spawning) {
            new RoomVisual(spawn.pos.roomName).text('Remaining: ' + parseInt(spawn.spawning.remainingTime), (spawn.pos.x - 0.01), (spawn.pos.y + 1.2), {align: 'center', size: '0.5', color: 'white', opacity: 0.5});
        }
    };


//VISUAL SCREEN
showRoomInfoInScreen =
    function (room) {
        var roomName = room.name;
        if (Memory.rooms[roomName]) {
            //VISUAL ROADS
            var paths = Memory.rooms[room.name].mostusedpaths;
            for (var path in paths) {
                if (paths[path].lastused > (Game.time-16) && paths[path].lastused < (Game.time-10)) {
                    new RoomVisual(room.name).text('ðŸ”µ', (paths[path].x), (paths[path].y + 0.05), {size: 0.10, opacity: 0.8, color: '#ffff00'});
                }
                if (paths[path].lastused > (Game.time-11) && paths[path].lastused < (Game.time-5)) {
                    new RoomVisual(room.name).text('ðŸ”µ', (paths[path].x), (paths[path].y + 0.05), {size: 0.10, opacity: 0.8, color: '#ffff00'});
                }
                if (paths[path].lastused > (Game.time-6) && paths[path].lastused < (Game.time+1)) {
                    new RoomVisual(room.name).text('ðŸ”µ', (paths[path].x), (paths[path].y + 0.05), {size: 0.15, opacity: 0.8, color: '#ffff00'});
                }
                if (paths[path].usedtimes >= 20 && paths[path].lastused < (Game.time-10)) {
                    new RoomVisual(room.name).text('â¬›', (paths[path].x), (paths[path].y + 0.05), {size: 0.15, opacity: 0.8, color: 'black'});
                }
            }
            if (Game.rooms[roomName].controller) {
                if(Game.rooms[roomName].visual.getSize() < 512000) {
                    // cannot add more visuals in this tick
                    var room = Game.rooms[roomName];
                    //ROOM STATS
                    new RoomVisual(roomName).text('ðŸ—º ' + roomName, 1, 1, {align: 'left'});
                    new RoomVisual(roomName).text('âš™ LVL ' + room.controller.level, 6, 1, {align: 'left'});
                    //ENERGY STATS
                    new RoomVisual(roomName).text('ðŸ”‹ ' + parseInt((100 / Game.rooms[roomName].energyCapacityAvailable) * Game.rooms[roomName].energyAvailable) + '% [' + Game.rooms[roomName].energyAvailable + '/' + Game.rooms[roomName].energyCapacityAvailable + 'W]', 1, 2, {align: 'left'});
                    //JOBS
                    var cs = countConstructions(roomName);
                    var rp = countRepairs(roomName);
                    new RoomVisual(roomName).text('ðŸš§ ' + cs, 1, 4, {align: 'left'});
                    new RoomVisual(roomName).text('ðŸ›  ' + rp, 1, 5, {align: 'left'});
                    //CPU STATS
                    new RoomVisual(roomName).text('CORES: ' + (Game.cpu.limit), 40, 1, {align: 'left'});
                    new RoomVisual(roomName).text('CPU: ' + parseInt(Game.cpu.getUsed()) + '%', 40, 2, {align: 'left'});
                    new RoomVisual(roomName).text('BURST: ' + Game.cpu.bucket, 40, 3, {align: 'left'});
                    new RoomVisual(roomName).text('TICK:' + Game.cpu.tickLimit, 40, 4, {align: 'left'});
                    new RoomVisual(roomName).text('VMEM:' + room.visual.getSize(), 40, 5, {align: 'left'});
                    //ROOM CONTROLLER
                    new RoomVisual(roomName).text('LVL ' + room.controller.level, (room.controller.pos.x), (room.controller.pos.y + 1.5), {align: 'center', size: '0.50', color: 'gray', opacity: 0.2});
                    //CREEPS STATS
                    new RoomVisual(roomName).text('ðŸ‘· ' + countCreeps('harvester', roomName), 1, 7, {align: 'left'});
                    new RoomVisual(roomName).text('ðŸ™â€ ' + countCreeps('upgrader', roomName), 1, 8, {align: 'left'});
                    new RoomVisual(roomName).text('ðŸ‘³ ' + countCreeps('engineer', roomName), 1, 9, {align: 'left'});
                    new RoomVisual(roomName).text('ðŸšš ' + countCreeps('transporter', roomName), 1, 10, {align: 'left'});
                    new RoomVisual(roomName).text('ðŸ‘® ' + countCreeps('guard', roomName), 1, 11, {align: 'left'});

                }
            }
        }
    };

//AUTO BUILD
autoBuild =
    function (room) {
        if (Memory.rooms[room.name].cron.autobuild) {
            if (Memory.rooms[room.name].cron.autobuild.lastrun < (Game.time - Memory.rooms[room.name].cron.autobuild.interval)) {

                //PASSO 1 - CRIAR EXTENSIONS PERMITIDAS
                if (Memory.rooms[room.name].buildprogress === 1) {
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
                        Memory.rooms[room.name].buildprogress = 2;
                    }
                }
            }
        }

        //PASSO 2 - CRIAR UM CONTAINER NAS PROXIMIDADES DO ROOM CONTROLLER
        if (Memory.rooms[room.name].buildprogress === 2) {
            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length === 0) {
                var controller = new RoomPosition(room.controller.pos.x, room.controller.pos.y, room.name);
                var haveContainer = Memory.rooms[room.name].containers.nearcontroller;
                if (!haveContainer) {
                    var sourcePos = room.controller;
                    var getFreePos = getRandomFreePosOutOfRoad(sourcePos.pos, 2, room);
                    if (getFreePos !== 'searching') {
                        getFreePos.createConstructionSite(STRUCTURE_CONTAINER);
                    }
                }
                else {
                    Memory.rooms[room.name].buildprogress = 3;
                }
            }
        }


        //PASSO 3 - CRIAR UMA TORRE NAS PROXIMIDADES DO SPAWN
        if (Memory.rooms[room.name].buildprogress === 3) {
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
                Memory.rooms[room.name].buildprogress = 4;
            }
        }
    }
}

//PASSO 4 - CRIAR EXTENSIONS PERMITIDAS
if (Memory.rooms[room.name].buildprogress === 4) {
    if (room.controller.level >= 3) {
        var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length === 0) {
            var extensions = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_EXTENSION)});
        var extensionsLimit = checkExtensionsLimits(room);
        if (extensions.length < 10) {
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
        Memory.rooms[room.name].buildprogress = 5;
    }
}
}
}

//PASSO 5 - CRIAR EXTENSIONS PERMITIDAS
if (Memory.rooms[room.name].buildprogress === 5) {
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
            if (freeSpace) {
                freeSpace.createConstructionSite(STRUCTURE_EXTENSION);
            }
        }
    }
    else {
        Memory.rooms[room.name].buildprogress = 6;
    }
}
}
}

//PASSO 6 - CRIAR UMA TORRE NAS PROXIMIDADES DO SPAWN
if (Memory.rooms[room.name].buildprogress === 6) {
    if (room.controller.level >= 5) {
        var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length === 0) {
            var tower = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_TOWER});
        if (tower.length === 1) {
            var spawn = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_SPAWN)});
        if (spawn.length > 0) {
            var freeSpace = getRandomFreePosOutOfRoad(spawn[0].pos, 7, room);
            if (freeSpace) {
                freeSpace.createConstructionSite(STRUCTURE_TOWER);
            }
        }
    }
    else {
        Memory.rooms[room.name].buildprogress = 7;
    }
}
}
}

//PASSO 7 - CRIAR EXTENSIONS PERMITIDAS
if (Memory.rooms[room.name].buildprogress === 7) {
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
            if (freeSpace) {
                freeSpace.createConstructionSite(STRUCTURE_EXTENSION);
            }
        }
    }
    else {
        Memory.rooms[room.name].buildprogress = 8;
    }
}
}
}

//PASSO 8 - CRIAR STORAGE
if (Memory.rooms[room.name].buildprogress === 8) {
    if (room.controller.level >= 5) {
        var storage = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_STORAGE)});
    if (storage.length === 0) {
        var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length === 0) {
            var mineral = Memory.rooms[room.name].mineral;
            if (mineral) {
                var freeSpace = getRandomFreePosOutOfRoad(mineral.pos, 3, room);
                if (freeSpace) {
                    freeSpace.createConstructionSite(STRUCTURE_STORAGE);
                }
            }
        }
    }
    else {
        Memory.rooms[room.name].buildprogress = 9;
    }
}
}

//PASSO 9 - CRIAR EXTENSIONS PERMITIDAS
if (Memory.rooms[room.name].buildprogress === 9) {
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
            if (freeSpace) {
                freeSpace.createConstructionSite(STRUCTURE_EXTENSION);
            }
        }
    }
    else {
        Memory.rooms[room.name].buildprogress = 10;
    }
}
}
}

//PASSO 10 - CRIAR EXTRACTOR
if (Memory.rooms[room.name].buildprogress === 10) {
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
        Memory.rooms[room.name].buildprogress = 11;
    }
}
}

//PASSO 11 - CRIAR LAB
if (Memory.rooms[room.name].buildprogress === 11) {
    if (room.controller.level >= 6) {
        var labs = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_LAB)});
    if (labs.length === 0) {
        var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length === 0) {
            var mineral = Memory.rooms[room.name].mineral;
            if (mineral) {
                var freeSpace = getRandomFreePosOutOfRoad(mineral.pos, 3, room);
                if (freeSpace) {
                    freeSpace.createConstructionSite(STRUCTURE_LAB);
                }
            }
        }
    }
    else {
        Memory.rooms[room.name].buildprogress = 1;
    }
}
}


Memory.rooms[room.name].cron.autobuild.lastrun = Game.time;
}
}
};
