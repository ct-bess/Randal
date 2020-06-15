const upgrader = {

  /** @param { Creep } creep **/
  run: function( creep: Creep, seed: number ) {

    if( creep.memory.working && creep.store[RESOURCE_ENERGY] === 0 ) {
      //creep.say( "YES." );
      creep.memory.working = false;
    }

    if( !creep.memory.working && creep.store.getFreeCapacity() === 0 ) {
      //creep.say( "good" );
      creep.memory.working = true;
    }

    if( creep.memory.working ) {
      const controller = creep.room.controller as StructureController || null;
      const tryUpgrade = creep.upgradeController( controller );
      if( tryUpgrade == ERR_NOT_IN_RANGE ) {
        creep.moveTo( controller );
      }
    }
    else {
      const sources: Source[] = creep.room.find( FIND_SOURCES );
      const sel: number = Math.floor( seed % sources.length );
      const tryHarvest = creep.harvest( sources[sel] );
      if( tryHarvest == ERR_NOT_IN_RANGE ) {
        creep.moveTo( sources[sel] );
      }
    }

  }

};

export default upgrader;
