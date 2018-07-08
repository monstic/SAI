module.exports = function (spawn) {
    
    if (Memory.spawns) {
    
        //CREATE CRONJOBS        
        if (!Memory.spawns[spawn.name].cron || Memory.spawns[spawn.name].cron === 'undefined') {
            Memory.spawns[spawn.name].cron = {};
        }

        if (!Memory.spawns[spawn.name].cron[0] || Memory.spawns[spawn.name].cron[0] === 'undefined') {
            Memory.spawns[spawn.name].cron[0] = {};
            Memory.spawns[spawn.name].cron[0].lastrun = Game.time;
            Memory.spawns[spawn.name].cron[0].interval = 15;
        }


        if (Memory.spawns) {
            if (Memory.spawns[spawn.name].cron[0].lastrun < (Game.time-Memory.spawns[spawn.name].cron[0].interval)) {
                Memory.spawns[spawn.name].cron[0].lastrun = Game.time;

                var spawnObject = Game.getObjectById(spawn.id);
                //REGISTER NEW SPAWN
                if (spawnObject) {
                    if (!Memory.spawns[spawn.name] || Memory.spawns[spawn.name] === undefined) {
                        Memory.spawns[spawn.name] = {};
                        Memory.spawns[spawn.name] = spawnObject;
                    }
                    console.log('Spawner ' + spawn.name + ' registered in database.');
                    //CREATE SPAWN RULES
                    if (!Memory.spawns[spawn.name].spawner || Memory.spawns[spawn.name].spawner === undefined) {
                        Memory.spawns[spawn.name].spawner = {};
                        Memory.spawns[spawn.name].spawner.harvester = 0;
                        Memory.spawns[spawn.name].spawner.filler = 0;
                        Memory.spawns[spawn.name].spawner.transporter = 0;
                        Memory.spawns[spawn.name].spawner.upgrader = 0;
                        Memory.spawns[spawn.name].spawner.engineer = 0;
                        Memory.spawns[spawn.name].spawner.miner = 0;
                        Memory.spawns[spawn.name].spawner.guard = 0;
                        Memory.spawns[spawn.name].spawner.claimer = 0;
                        Memory.spawns[spawn.name].spawner.healer = 0;
                        console.log('Spawner ' + spawn.name + ' configured.');
                    }
                }
            }
        }
    }
    else {
        Memory.spawns = {};
    }
};
