                    //REGISTER STORAGES NEAR MINERAL
                    if (Memory.rooms[room.name].structure.storage) {
                        if (!Memory.rooms[room.name].structure.storage.mineral || Memory.rooms[room.name].structure.storage.mineral === 'undefined') {
                            if (Memory.rooms[room.name].mineral) {
                                var mineral = Game.getObjectById(Memory.rooms[room.name].mineral.id);
                                var mineralpos = new RoomPosition(mineral.pos.x, mineral.pos.y, room.name);
                                var storage = mineralpos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (s.structureType === STRUCTURE_STORAGE)});
                                if (storage[0]) {
                                    Memory.rooms[room.name].structure.storage.mineral = storage[0].id;
                                }
                            }
                        }
                    }


                //REGISTER AVAILABLE MINERALS
                if (!Memory.rooms[room.name].mineral || Memory.rooms[room.name].mineral === 'undefined') {
                    var findMinerals = room.find(FIND_MINERALS);
                    if (findMinerals.length > 0) {
                        Memory.rooms[room.name].mineral = {};
                        Memory.rooms[room.name].mineral.id = findMinerals[0].id;
                        console.log('Mineral type ' + findMinerals[0].mineralType + ' was found in room ' + room.name + '.');
                    }
                }

                //REGISTER AVAILABLE SOURCES
                if (!Memory.rooms[room.name].sources || Memory.rooms[room.name].sources === 'undefined') {
                    var findSources = room.find(FIND_SOURCES);
                    if (findSources.length > 0) {
                        Memory.rooms[room.name].sources = {};
                        Memory.rooms[room.name].sources.total = findSources.length;
                        console.log('Found ' + findSources.length + ' source(s) in room ' + room.name + '.');
                        i = 0;
                        while (i < findSources.length) {
                            Memory.rooms[room.name].sources[i] = findSources[i].id;
                            console.log('Source ' + findSources[i].id + ' registered in room ' + room.name + '.');
                            i++;
                        }
                    }
                }

                //REGISTER STRUCTURES
                if (Memory.rooms[room.name].structure) {

                    //REGISTER CONSTRUCTION SITE TO BUILD SPAWN
                    var spawnExist = room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_SPAWN)});
                    if (spawnExist === 0) {
                        var csSpawnExist = room.find(FIND_CONSTRUCTION_SITES);
                        if (csSpawnExist > 0) {
                            Memory.constructionSite = csSpawnExist[0];
                        }
                    }


                    //REGISTER EXTRACTOR
                    if (Memory.rooms[room.name].mineral) {
                        if (!Memory.rooms[room.name].mineral.extractor || Memory.rooms[room.name].mineral.extractor === 'undefined') {
                            var extractor = room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_EXTRACTOR)});
                            if (extractor.length > 0) {
                                Memory.rooms[room.name].mineral.extractor = extractor[0].id;
                            }
                        }
                        if (Memory.rooms[room.name].mineral.extractor) {
                            var extractor = Game.getObjectById(Memory.rooms[room.name].mineral.extractor);
                            if (!extractor || extractor === 'undefined') {
                                delete Memory.rooms[room.name].mineral.extractor;
                            }
                        }
                    }

                    //REGISTER CONTAINER NEAR CONTROLLER
                    if (Memory.rooms[room.name].structure.container) {
                        if (!Memory.rooms[room.name].structure.container.controller || Memory.rooms[room.name].structure.container.controller === 'undefined') {
                            var controller = new RoomPosition(room.controller.pos.x, room.controller.pos.y, room.name);
                            var container = controller.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (s.structureType === STRUCTURE_CONTAINER)});
                            if (container[0]) {
                                Memory.rooms[room.name].structure.container.controller = container[0].id;
                            }
                        }
                        if (Memory.rooms[room.name].structure.container.controller) {
                            var container = Game.getObjectById(Memory.rooms[room.name].structure.container.controller);
                            if (!container || container === 'undefined') {
                                delete Memory.rooms[room.name].structure.container.controller;
                            }
                        }
                    }

                    //REGISTER CONTAINER NEAR SOURCE 0
                    if (Memory.rooms[room.name].structure.container) {
                        if (!Memory.rooms[room.name].structure.container.source || Memory.rooms[room.name].structure.container.source === 'undefined') {
                            var sourceId = Memory.rooms[room.name].sources[0];
                            var sourceStr = Game.getObjectById(sourceId);
                            var source = new RoomPosition(sourceStr.pos.x, sourceStr.pos.y, room.name);
                            var container = source.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (s.structureType === STRUCTURE_CONTAINER)});
                            if (container[0]) {
                                Memory.rooms[room.name].structure.container.source = container[0].id;
                            }
                        }
                        if (Memory.rooms[room.name].structure.container.source) {
                            var container = Game.getObjectById(Memory.rooms[room.name].structure.container.source);
                            if (!container || container === 'undefined') {
                                delete Memory.rooms[room.name].structure.container.source;
                            }
                        }
                    }

                    //REGISTER CONTAINER NEAR SOURCE 1
                    if (Memory.rooms[room.name].structure.container) {
                        if (!Memory.rooms[room.name].structure.container.source1 || Memory.rooms[room.name].structure.container.source1 === 'undefined') {
                            if (Memory.rooms[room.name].sources[1]) {
                                var sourceId = Memory.rooms[room.name].sources[1];
                                var sourceStr = Game.getObjectById(sourceId);
                                var source = new RoomPosition(sourceStr.pos.x, sourceStr.pos.y, room.name);
                                var container = source.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (s.structureType === STRUCTURE_CONTAINER)});
                                if (container[0]) {
                                    Memory.rooms[room.name].structure.container.source1 = container[0].id;
                                }
                            }
                        }
                        if (Memory.rooms[room.name].structure.container.source1) {
                            var container = Game.getObjectById(Memory.rooms[room.name].structure.container.source1);
                            if (!container || container === 'undefined') {
                                delete Memory.rooms[room.name].structure.container.source1;
                            }
                        }
                    }


                    //REGISTER TOWERS
                    if (Memory.rooms[room.name].structure.tower) {
                        var towers = room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_TOWER)});
                        if (towers.length > 0) {
                            Memory.rooms[room.name].structure.tower.total = towers.length;
                            var i = 0;
                            while (i < towers.length) {
                                if (!Memory.rooms[room.name].structure.tower[i] || Memory.rooms[room.name].structure.tower[i] === 'undefined') {
                                    Memory.rooms[room.name].structure.tower[i] = towers[i].id;
                                }
                                if (Memory.rooms[room.name].structure.tower[i]) {
                                    var towers = Game.getObjectById(Memory.rooms[room.name].structure.tower[i]);
                                    if (!towers || towers === 'undefined') {
                                        delete Memory.rooms[room.name].structure.tower[i];
                                    }
                                }
                                i++;
                            }
                        }
                    }

                    //REGISTER LINKS
                    if (Memory.rooms[room.name].structure.link) {
                        var link = room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_LINK)});
                        if (link.length > 0) {
                            Memory.rooms[room.name].structure.link.total = link.length;
                            var i = 0;
                            while (i < link.length) {
                                if (!Memory.rooms[room.name].structure.link[i] || Memory.rooms[room.name].structure.link[i] === 'undefined') {
                                    Memory.rooms[room.name].structure.link[i] = link[i].id;
                                }
                                if (Memory.rooms[room.name].structure.link[i]) {
                                    var link = Game.getObjectById(Memory.rooms[room.name].structure.link[i]);
                                    if (!link || link === 'undefined') {
                                        delete Memory.rooms[room.name].structure.link[i];
                                    }
                                }
                                i++;
                            }
                        }
                    }


                    //START CRONJOBS

                    //START CRON 2 [SPAWNER]
                    if (Memory.rooms[spawn.pos.roomName].cron[2].lastrun < (Game.time-Memory.rooms[spawn.pos.roomName].cron[2].interval)) {

                        var repairs = countRepairs(spawn.pos.roomName);
                        var builds = countConstructions(spawn.pos.roomName);

                        //SPAWN RULES UPDATER
                        if (Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner) {

                            //HARVESTERS
                            if (Memory.rooms[spawn.pos.roomName].sources) {
                                var sources = Memory.rooms[spawn.pos.roomName].sources.total;
                                var harvesterQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester;
                                if (sources === 0) {
                                    if (harvesterQty !== 0) {
                                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester = 0;
                                    }
                                }
                                else if (sources === 1) {
                                    if (harvesterQty !== 4) {
                                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester = 4;
                                    }
                                }
                                else {
                                    if (harvesterQty !== sources) {
                                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester = sources;
                                    }
                                }
                            }

                            //TRANSPORTERS
                            var transporterQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter;
                            if (Memory.rooms[spawn.pos.roomName].structure.container.source) {
                                if (transporterQty !== 2) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter = 2;
                                }
                            }
                            else {
                                if (transporterQty !== 0) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter = 0;
                                }
                            }

                            //GUARDS
                            var guardQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard;
                            if (Memory.rooms[spawn.pos.roomName].security.underattack === 'yes') {
                                if (guardQty !== 2) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard = 2;
                                }
                            }
                            else {
                                if (guardQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard = 1;
                                }
                            }

                            //HEALERS
                            var healerQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.healer;
                            if (healerQty !== 1) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.healer = 1;
                            }

                            //UPGRADERS
                            var room = Game.rooms[spawn.pos.roomName];
                            var upgraderQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader;

                            if (room.controller.level === 1) {
                                if (upgraderQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 1;
                                }
                            }
                            else if (room.controller.level === 2) {
                                if (upgraderQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 1;
                                }
                            }
                            else if (room.controller.level === 3) {
                                if (upgraderQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 1;
                                }
                            }
                            else if (room.controller.level === 4) {
                                if (upgraderQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 1;
                                }
                            }
                            else if (room.controller.level >= 5) {
                                if (upgraderQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader = 3;
                                }
                            }

                            //ENGINEER
                            var engineerQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer;
                            if (builds === 0 && repairs < 10) {
                              if (engineerQty !== 0) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 0;
                              }
                            }
                            else {
                              if (engineerQty !== 1) {
                                Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer = 1;
                              }
                            }

                            //MINER
                            if (Memory.rooms[spawn.pos.roomName].mineral) {
                                var minerQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner;
                                if (Memory.rooms[spawn.pos.roomName].mineral.extractor) {
                                  if (minerQty !== 1) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner = 1;
                                  }
                                }
                                else {
                                  if (minerQty !== 0) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner = 0;
                                  }
                                }
                            }
                            //CLAIMER
                            var claimQty = Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer;
                            if (Game.flags.claim) {
                                if (Game.glc > 1) {
                                    if (claimQty !== 1) {
                                        Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer = 1;
                                    }
                                }
                                if (claimQty !== 0) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer = 0;
                                }
                            }
                            else {
                                if (claimQty !== 0) {
                                    Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer = 0;
                                }
                            }
                        }

                        //POPULATE QUEUE LIST
                        var totalHarvesters = countCreeps('harvester', spawn.pos.roomName, 100);
                        if (totalHarvesters < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.harvester) {
                            spawnProtoCreep(spawn.name, 'harvester', spawn.pos.roomName);
                        }
                        else {
                            var totalUpgraders = countCreeps('upgrader', spawn.pos.roomName, 100);
                            if (totalUpgraders < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.upgrader) {
                                spawnProtoCreep(spawn.name, 'upgrader', spawn.pos.roomName);
                            }
                            else {
                                var totalTransporters = countCreeps('transporter', spawn.pos.roomName, 100);
                                if (totalTransporters < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.transporter && Game.rooms[spawn.pos.roomName].controller.level > 1) {
                                    spawnProtoCreep(spawn.name, 'transporter', spawn.pos.roomName);
                                }
                                else {
                                    var totalClaimers = countCreeps('claimer', spawn.pos.roomName, 100);
                                    if (totalClaimers < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.claimer && Game.rooms[spawn.pos.roomName].controller.level > 4) {
                                        spawnProtoCreep(spawn.name, 'claimer', spawn.pos.roomName);
                                    }
                                    else {
                                        var totalGuards = countCreeps('guard', spawn.pos.roomName, 100);
                                        if (totalGuards < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard && Game.rooms[spawn.pos.roomName].controller.level > 1) {
                                            spawnProtoCreep(spawn.name, 'guard', spawn.pos.roomName);
                                        }
                                        else {
                                            var totalEngineers = countCreeps('engineer', spawn.pos.roomName, 100);
                                            if (totalEngineers < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.engineer && Game.rooms[spawn.pos.roomName].controller.level > 1) {
                                                spawnProtoCreep(spawn.name, 'engineer', spawn.pos.roomName);
                                            }
                                            else {
                                                var totalHealers = countCreeps('healer', spawn.pos.roomName, 100);
                                                if (totalHealers < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.guard && Memory.rooms[spawn.pos.roomName].security.underattack === 'yes' && Game.rooms[spawn.pos.roomName].controller.level > 1) {
                                                    spawnProtoCreep(spawn.name, 'healer', spawn.pos.roomName);
                                                }
                                                else {
                                                    if (Memory.rooms[spawn.pos.roomName].mineral) {
                                                        if (Memory.rooms[spawn.pos.roomName].mineral.extractor) {
                                                            var totalMiners = countCreeps('miner', spawn.pos.roomName, 100);
                                                            if (totalMiners < Memory.rooms[spawn.pos.roomName].spawns[spawn.name].spawner.miner && Game.rooms[spawn.pos.roomName].controller.level > 1) {
                                                              spawnProtoCreep(spawn.name, 'miner', spawn.pos.roomName);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //SAVE LAST RUN
                        Memory.rooms[spawn.pos.roomName].cron[2].lastrun = Game.time;

                    }
                    //END CRON 2

                //END CRONJOBS
                }

                //LOAD MODULES
                //spawnProgress(spawn);

            }
        }






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

//GET RAMDOM POSITION WITHOUT WALL
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

//GET RAMDOM POSITION IN ROADS
walkRandomInRoad =
function (startPos, distance, roomName) {
    var x, y;
    do {
        x = startPos.x + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
        y = startPos.y + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
    }
    while ((x + y) % 2 !== (startPos.x + startPos.y) % 2 || Game.map.getTerrainAt(x, y, roomName) === 'wall');
    return new RoomPosition(x, y, roomName);
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


//TOWERS
enableTowers =
    function (room) {
        var towers =  room.find(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_TOWER)});
        for (var tower of towers) {
            var totalGuards = countCreeps('guard', room.name);
            var hostilesHealer = room.find(FIND_HOSTILE_CREEPS, { filter: function (object) { return object.getActiveBodyparts(HEAL) > 0 } });
            if (hostilesHealer.length > 0) {
                tower.attack(hostilesHealer[0]);
            }
            else {
              var hostilesArmed = room.find(FIND_HOSTILE_CREEPS, { filter: function (object) { return object.getActiveBodyparts(ATTACK) > 0 } });
                if (hostilesArmed.length > 0) {
                    tower.attack(hostilesArmed[0]);
                }
                else {
                    var target = room.find(FIND_HOSTILE_CREEPS);
                    if (target.length > 0) {
                        tower.attack(target[0]);
                    }
                    else {
                        var closestWounded = tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (w) => w.hits < w.hitsMax });
                        if (closestWounded) {
                            tower.heal(closestWounded);
                        }
                        else {
                            var hostiles = room.find(FIND_HOSTILE_CREEPS);
                            if (hostiles.length > 0) {
                                tower.attack(hostiles[0]);
                            }
                            else {
                                var repairs = room.find(FIND_STRUCTURES, { filter: (s) => ((s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) && (s.hits < 1000)) });
                                if (repairs.length > 0) {
                                    tower.repair(repairs[0]);
                                }
                                else {
                                    var repairAllRoads = 'true';
                                    var target = room.find(FIND_STRUCTURES, { filter: (s) => ((s.structureType === STRUCTURE_ROAD) && (s.hits < s.hitsMax)) });
                                    if (target.length > 0) {
                                        var i = 0;
                                        var b = 0;
                                        if (b === 0) {
                                            if (repairAllRoads === 'true') {
                                                tower.repair(target[0]);
                                                b++;
                                            }
                                            i++;
                                        }
                                    }
                                    else {
                                        var totalRepairs = countRepairs(room.name);
                                        if (totalRepairs > 0) {
                                            var target = room.find(FIND_STRUCTURES, { filter: (s) => ((s.structureType !== STRUCTURE_ROAD) && (s.hits < s.hitsMax && s.hits < 100)) });
                                            tower.repair(target[0]);
                                        }
                                        else {
                                            for (var creepName in Game.creeps) {
                                                //load creep
                                                var creep = Game.creeps[creepName];
                                                if (creep.memory.type === 'engineer') {
                                                  if (creep.carry.energy === 0) {
                                                    tower.transferEnergy(creep);
                                                  }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
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
        var i = 0;
        for (var path in paths) {
            if (i < 50) {
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
            else {
                delete Memory.rooms[room.name].trail[path];
            }
            i++;
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
                                new RoomVisual(roomName).text('🗺️ ' + roomName, 1, 1, { align: 'left' });
                                new RoomVisual(roomName).text('LVL ' + room.controller.level, 6, 1, { align: 'left' });
                                //ENERGY STATS
                                new RoomVisual(roomName).text('⚡: ' + parseInt((100 / Game.rooms[roomName].energyCapacityAvailable) * Game.rooms[roomName].energyAvailable) + '% [' + Game.rooms[roomName].energyAvailable + '/' + Game.rooms[roomName].energyCapacityAvailable + 'W]', 1, 2, { align: 'left' });
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
                                new RoomVisual(roomName).text('HA: ' + countCreeps('harvester', roomName), 1, 7, { align: 'left' });
                                new RoomVisual(roomName).text('UP: ' + countCreeps('upgrader', roomName), 1, 8, { align: 'left' });
                                new RoomVisual(roomName).text('EN: ' + countCreeps('engineer', roomName), 1, 9, { align: 'left' });
                                new RoomVisual(roomName).text('TR: ' + countCreeps('transporter', roomName), 1, 10, { align: 'left' });
                                new RoomVisual(roomName).text('GU: ' + countCreeps('guard', roomName), 1, 11, { align: 'left' });
                                new RoomVisual(roomName).text('HE: ' + countCreeps('healer', roomName), 1, 12, { align: 'left' });
                                new RoomVisual(roomName).text('CL: ' + countCreeps('claimer', roomName), 1, 13, { align: 'left' });

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
if (Memory.rooms[room.name].config.autobuildroads === 'on') {
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
}
};

//AUTO BUILD
autoBuild =
function (room) {
if (Memory.rooms[room.name].config.autobuild === 'on') {

    //PASSO 0 - SPAWN
    if (Memory.rooms[room.name].info.constructionslevel === 0) {
        if (room.controller.level > 0) {
            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length === 0) {
                var spawn = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_SPAWN)});
                if (spawn.length === 0) {
                    var flag = Game.flags.claim;
                    if (flag) {
                        var spawnPos = new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName);
                        spawnPos.createConstructionSite(STRUCTURE_SPAWN);
                    }
                }
                else {
                    Memory.rooms[room.name].info.constructionslevel = 1;
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
            if (!Memory.rooms[room.name].structure.container.source) {
                var sourceId = Memory.rooms[room.name].sources[0];
                var source = Game.getObjectById(sourceId);
                var getFreePos = getRandomFreePosOutOfRoad(source.pos, 2, room);
                if (getFreePos !== 'searching') {
                    getFreePos.createConstructionSite(STRUCTURE_CONTAINER);
                }
            }
            else {
                if (!Memory.rooms[room.name].structure.container.source1) {
                    var sourceId = Memory.rooms[room.name].sources[1];
                    var source = Game.getObjectById(sourceId);
                    var getFreePos = getRandomFreePosOutOfRoad(source.pos, 2, room);
                    if (getFreePos !== 'searching') {
                        getFreePos.createConstructionSite(STRUCTURE_CONTAINER);
                    }
                }
                else {
                    var haveContainer = Memory.rooms[room.name].structure.container.controller;
                    if (!haveContainer) {
                        var getFreePos = getRandomFreePosOutOfRoad(room.controller.pos, 2, room);
                        if (getFreePos !== 'searching') {
                            getFreePos.createConstructionSite(STRUCTURE_CONTAINER);
                        }
                    }
                    else {
                        Memory.rooms[room.name].info.constructionslevel = 3;
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
            Memory.rooms[room.name].info.constructionslevel = 0;
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
        else {
            Memory.rooms[room.name].info.constructionslevel = 0;
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
            Memory.rooms[room.name].info.constructionslevel = 0;
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
            Memory.rooms[room.name].info.constructionslevel = 0;
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
        else {
            Memory.rooms[room.name].info.constructionslevel = 0;
        }
    }

    //PASSO 8 - STORAGE NEAR MINERAL
    if (Memory.rooms[room.name].info.constructionslevel === 8) {
        if (room.controller.level >= 5) {
            var storage = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_STORAGE)});
            if (storage.length === 0) {
                var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
                if (constructionSites.length === 0) {
                    var mineral = Game.getObjectById(Memory.rooms[room.name].mineral.id);
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
        else {
            Memory.rooms[room.name].info.constructionslevel = 0;
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
            Memory.rooms[room.name].info.constructionslevel = 0;
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
        else {
            Memory.rooms[room.name].info.constructionslevel = 0;
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
}
};

//AUTO BUILD WALLS AND RAMPARTS
autoBuildWalls =
function (room) {
if (Memory.rooms[room.name].config.autobuildwalls === 'on') {
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
}
};

moveToByPath =
function (creep, target) {
    let roomName = creep.pos.roomName;
    let ret = PathFinder.search(
        creep.pos, target.pos,
        {
        plainCost: 2,
        swampCost: 10,

        roomCallback: function(roomName) {

            let room = Game.rooms[roomName];
            if (!room) return;
            let costs = new PathFinder.CostMatrix;

            room.find(FIND_STRUCTURES).forEach(function(struct) {
            if (struct.structureType === STRUCTURE_ROAD) {
                costs.set(struct.pos.x, struct.pos.y, 1);
            } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                        (struct.structureType !== STRUCTURE_RAMPART ||
                        !struct.my)) {
                costs.set(struct.pos.x, struct.pos.y, 0xff);
            }
            });

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
            //DEFINE WALL AND RAMPART POSITIONS
            if (Memory.rooms[room.name].exit) {
                if (!Memory.rooms[room.name].exit.left) {
                    Memory.rooms[room.name].exit.left = {};
                    //SAVE EXIT POSITION
                    var exits = room.find(FIND_EXIT_LEFT);
                    if (exits.length > 0) {
                        for (var exit in exits) {
                            Memory.rooms[room.name].exit.left[exits[exit].y] = exits[exit].y;
                        }
                    }
                    //SAVE RAMPART POSITION
                    var countExits = room.find(FIND_EXIT_LEFT);
                    var rexits = Memory.rooms[room.name].exit.left;
                    var i = 0;
                    for (var exit in rexits) {
                        if (i === parseInt(countExits.length/2)) {
                            delete Memory.rooms[room.name].exit.left[exit];
                        }
                        i++;
                    }
                }
                if (!Memory.rooms[room.name].exit.right) {
                    Memory.rooms[room.name].exit.right = {};
                    //SAVE EXIT POSITION
                    var exits = room.find(FIND_EXIT_RIGHT);
                    if (exits.length > 0) {
                        for (var exit in exits) {
                            Memory.rooms[room.name].exit.right[exits[exit].y] = exits[exit].y;
                        }
                    }
                    //SAVE RAMPART POSITION
                    var countExits = room.find(FIND_EXIT_RIGHT);
                    var rexits = Memory.rooms[room.name].exit.right;
                    var i = 0;
                    for (var exit in rexits) {
                        if (i === parseInt(countExits.length/2)) {
                            delete Memory.rooms[room.name].exit.right[exit];
                        }
                        i++;
                    }
                }
                if (!Memory.rooms[room.name].exit.top) {
                    Memory.rooms[room.name].exit.top = {};
                    //SAVE EXIT POSITION
                    var exits = room.find(FIND_EXIT_TOP);
                    if (exits.length > 0) {
                        for (var exit in exits) {
                            Memory.rooms[room.name].exit.top[exits[exit].x] = exits[exit].x;
                        }
                    }
                    //SAVE RAMPART POSITION
                    var countExits = room.find(FIND_EXIT_TOP);
                    var rexits = Memory.rooms[room.name].exit.top;
                    var i = 0;
                    for (var exit in rexits) {
                        if (i === parseInt(countExits.length/2)) {
                            delete Memory.rooms[room.name].exit.top[exit];
                        }
                        i++;
                    }
                }
                if (!Memory.rooms[room.name].exit.bottom) {
                    Memory.rooms[room.name].exit.bottom = {};
                    //SAVE EXIT POSITION
                    var exits = room.find(FIND_EXIT_BOTTOM);
                    if (exits.length > 0) {
                        for (var exit in exits) {
                            Memory.rooms[room.name].exit.bottom[exits[exit].x] = exits[exit].x;
                        }
                    }
                    //SAVE RAMPART POSITION
                    var countExits = room.find(FIND_EXIT_BOTTOM);
                    var rexits = Memory.rooms[room.name].exit.bottom;
                    var i = 0;
                    for (var exit in rexits) {
                        if (i === parseInt(countExits.length/2)) {
                            delete Memory.rooms[room.name].exit.bottom[exit];
                        }
                        i++;
                    }
                }
            }
    if (creep.carry[RESOURCE_GHODIUM_OXIDE] > 0) {
        creep.drop(RESOURCE_GHODIUM_OXIDE);
        creep.say('🚨🚨');
    }
        if (creep.carry[RESOURCE_GHODIUM_OXIDE] > 0) {
            if (Memory.rooms[creep.room.name].structure.storage.mineral) {
                var target = Game.getObjectById(Memory.rooms[creep.room.name].structure.storage.mineral);
            }
            else {
                var target = null;
            }
            // if one was found
            if (target !== null && (_.sum(target.store) < 1000000)) {
                setTarget(creep, target.id, 'LOWSTO', target.room.name);
            }
        }
        else {

