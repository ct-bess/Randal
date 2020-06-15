import harvester from "./harvester";
import builder from "./builder";
import upgrader from "./upgrader";
import defender from "./defender";

/*
WHAT HAVE WE LEARNED???
- CANT USE FOLDERS IN BUILD, BUT CAN USE SEPERATE FILES IN ROOT DIR
- CANT USE LOG LEVELS, CAN ONLY CALL CONSOLE.LOG
- DONT LOOP THRU MEMORY TO GET YOUR GAME ELEMENTS, LOOP THRU THE DAMN GAME YOU IDIOT
- COMMONJS WORKS WELL FROM TS CONFIG
- YOU GOTTA HAVE A ROLE THAT REPAIRS SHIT ... STRUCTURES DONT LAST FOREVER (EXCEPT FOR TOWERS?)
- YOU ARE SPAWNING WAY TO MANY MINIONS ... LITERALLY CLOGGING UP THE RESOURCES
- MORE OVER YOU PROBABLY ONLY NEED A FEW MAITENENCE MINION TYPES PER ROOM, AND A HAND FULL OF DEFENDERS
*/

const totalCreepTypes: number = 4;

export const loop = () => {

  // -- Run Towers Routine
  for( const name in Game.rooms ) {

    const towers = Game.rooms[name].find( FIND_MY_STRUCTURES, {
      filter: ( structure: StructureTower ) => ( structure.structureType == STRUCTURE_TOWER )
    }) as StructureTower[] || null;

    if( !!towers ) {
      for( const tower of towers ) {

        const closestHurtStruct = tower.pos.findClosestByRange( FIND_MY_STRUCTURES, {
          filter: ( structure: Structure ) => ( structure.hits < structure.hitsMax )
        }) as AnyOwnedStructure || null;
        const closestHostile = tower.pos.findClosestByRange( FIND_HOSTILE_CREEPS ) as Creep || null;

        if( !!closestHostile ) tower.attack( closestHostile );

        if( !!closestHurtStruct ) tower.repair( closestHurtStruct );

      }
    }
  } // EO Towers Routine

  // -- Spawn Creeps Routine
  for( const name in Game.spawns ) {

    // -- Might need this if we run into memory issues
    //if( name in Game.spawns == false ) {
      //delete Memory.spawns[name];
    //}

    // 300 energy max spawn w/o containers. each container adds 50 extra energy to spawn with
    const spawnEnergy = Game.spawns[name].store.getUsedCapacity( RESOURCE_ENERGY );
    if( spawnEnergy >= 300 ) {
      let seed: number = Game.time;
      let creepName: string = "";
      let role: string = "";
      const sel: number = Math.floor( Math.random() * ( totalCreepTypes ) ) + 1;
      let body: BodyPartConstant[] = [];
      body.push( MOVE );

      // THIS IS TOO WET
      // maybe select random parts or select from a LUT
      switch( sel ) {
        case 1:
          body.push( WORK );
          body.push( CARRY );
          role = "harvester";
          break;
        case 2:
          body.push( WORK );
          body.push( CARRY );
          role = "upgrader";
          break;
        case 3:
          body.push( WORK );
          body.push( CARRY );
          role = "builder";
          break;
        case 4:
          body.push( ATTACK );
          body.push( MOVE );
          role = "defender";
          break;
        case 5:
          body.push( ATTACK );
          body.push( MOVE );
          role = "attacker";
          break;
        case 6:
          body.push( MOVE );
          body.push( MOVE );
          role = "scout";
          break;
      }

      // Genetics loads the gun, but enviromnet pulls the trigger

      creepName = `${role}:${seed}`;
      Game.spawns[name].spawnCreep( body, creepName );
      seed = Math.floor( seed / ( new Date() ).getUTCMilliseconds() );
      Memory.creeps[creepName].role = role;
      Memory.creeps[creepName].seed = seed;
      Game.creeps[creepName].say( "HELLO FRIENDS" );
      console.log( "New creep spawned:", Game.creeps[creepName] );

      // Unclog spawn, or move em to a flag
      const initMove = ( Math.floor( Math.random() * 4 ) + 1 ) as DirectionConstant;
      Game.creeps[creepName].move( initMove );

    }
  } // EO Spawn Creeps Routine

  // -- Run Creeps Routine
  for( const name in Game.creeps ) {

    //if( name in Game.creeps == false ) {
      //delete Memory.creeps[name];
    //}

    const creep: Creep = Game.creeps[name];
    const role: string = creep.memory.role;
    const seed: number = creep.memory.seed;
    switch( role ) {
      case "harvester":
        harvester.run( creep, seed );
        break;
      case "upgrader":
        upgrader.run( creep, seed );
        break;
      case "builder":
        builder.run( creep, seed );
        break;
      case "scout":
        break;
      case "defender":
        defender.run( creep, seed );
        break;
      case "attacker":
        break;
      default:
        break;
    }

    if( !!creep.ticksToLive && creep.ticksToLive < 3 ) {
      creep.say( "F" );
      console.log( "Our creep is about to die... F", creep );
    }

  } // EO Run Creeps Routine

  // -- ROLLLLLL CALLLLLLL
  if( Game.time % 10585 === 0 ) {
    console.log( "ROLL CALL:", Game.time );

    // SO WET
    for( const name in Memory.creeps ) {
      const creep: Creep = Game.creeps[name];
      const role: string = creep.memory.role;
      const seed: number = creep.memory.seed;

      // -- Ungabunga Seed swaps
      for( const i in Memory.creeps ) {
        Game.creeps[i].memory.seed ^= seed;
      }

      creep.say( "yuHh" );

      // Dont swap roles that use different bodies
      const roleCheck: boolean = ( role === "harvester" ) || ( role === "upgrader" ) || ( role === "builder" );
      if( roleCheck ) {

        const newRole: number = ( Math.floor( Math.random() * 3 ) + 1 ) && Math.floor( Math.random() * 2 );

        switch( newRole ) {
          case 1:
            creep.memory.role = "harvester";
            break;
          case 2:
            creep.memory.role = "upgrader";
            break;
          case 3:
            creep.memory.role = "builder";
            break;
          default:
            break;
        }

        console.log( `Role swap: ${role} --> ${creep.memory.role}`, newRole );

      }

    }

  } // EO Roll Call

} // EO Game Loop
