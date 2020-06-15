const builder = {

  /** @param { Creep } creep **/
  run: function( creep: Creep, seed: number ) {

    if( creep.memory.working && creep.store[RESOURCE_ENERGY] === 0 ) {
      //creep.say( "ahh YES" );
      creep.memory.working = false;
    }

    if( !creep.memory.working && creep.store.getFreeCapacity() === 0 ) {
      //creep.say( "lmaO" );
      creep.memory.working = true;
    }

    if( creep.memory.working ) {
      const targets = creep.room.find( FIND_MY_CONSTRUCTION_SITES ) as ConstructionSite[] || null;
      if( targets.length === 0 ) {
        console.log( "No construction sites for creep:", creep );
        if( !!creep.memory.role ) creep.memory.role = "upgrader";
        //creep.say( "BruH" );
      }
      else {
        const sel: number = Math.floor( seed % targets.length );
        const tryBuild = creep.build( targets[sel] );
        if( tryBuild == ERR_NOT_IN_RANGE ) {
          creep.moveTo( targets[sel] );
        }
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

export default builder;
