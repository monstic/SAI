//CREATE DATABASES
if (!Memory.system || Memory.system === undefined) {
    Memory.system = {};
    console.log('Installing <strong>SAI</strong> (Screepting Artificial Intelligence)');
}

//CREATE SUMMARY AND REGISTER FIRST RUN
if (!Memory.system.summary || Memory.system.summary === undefined) {
    Memory.system.summary = {};
    Memory.system.summary.firstrun = Game.time;
    console.log('Summary database created.');
    console.log('First run registered in summary.');
}

//CREATE CONFIG DATABASE
if (!Memory.system.config || Memory.system.config === undefined) {
    Memory.system.config = {};
    console.log('Configs database created.');
}

//CREATE ROOMS DATABASE
if (!Memory.rooms || Memory.rooms === undefined) {
    Memory.rooms = {};
    console.log('Rooms database created.');
}

//CREATE SPAWNS DATABASE
if (!Memory.spawns || Memory.spawns === undefined) {
    Memory.spawns = {};
    console.log('Spawns database created.');
}

//CREATE FLAGS DATABASE
if (!Memory.flags || Memory.flags === undefined) {
    Memory.flags = {};
    console.log('Flags database created.');
}

