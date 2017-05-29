//CREATE DATABASES
if (!Memory.system || Memory.system === undefined) {
    Memory.system = {};
    sai.log('Installing <strong>SAI</strong> (Screepting Artificial Intelligence)');
}

//CREATE SUMMARY AND REGISTER FIRST RUN
if (!Memory.system.summary || Memory.system.summary === undefined) {
    Memory.system.summary = {};
    Memory.system.summary.firstrun = Game.time;
    sai.log('Summary database created.');
    sai.log('First run registered in summary.');
}

//CREATE CONFIG DATABASE
if (!Memory.system.config || Memory.system.config === undefined) {
    Memory.system.config = {};
    sai.log('Configs database created.');
}

//CREATE ROOMS DATABASE
if (!Memory.rooms || Memory.rooms === undefined) {
    Memory.rooms = {};
    sai.log('Rooms database created.');
}

//CREATE SPAWNS DATABASE
if (!Memory.spawns || Memory.spawns === undefined) {
    Memory.spawns = {};
    sai.log('Spawns database created.');
}

//CREATE FLAGS DATABASE
if (!Memory.flags || Memory.flags === undefined) {
    Memory.flags = {};
    sai.log('Flags database created.');
}

