const harvester = {

  /** @param { Creep } creep **/
  run: function( creep: Creep, seed: number ) {

    if( creep.store.getFreeCapacity() > 0 ) {

      let sources: Source[] = creep.room.find( FIND_SOURCES );
      const sel: number = Math.floor( seed % sources.length );

      if( creep.harvest( sources[sel] ) == ERR_NOT_IN_RANGE ) {
        creep.moveTo( sources[sel] );
      }

    }

    else { // Capacity is full

      let targets: Structure[] = creep.room.find( FIND_MY_STRUCTURES, {
        filter: ( structure: any ) => {
          const validStruct: boolean = (
            structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER ) && 
            structure.store.getFreeCapacity( RESOURCE_ENERGY ) > 0;
          return( validStruct );
        }
      });

      if( targets.length > 0 ) {

        const sel: number = Math.floor( seed % targets.length );

        if( creep.transfer( targets[sel], RESOURCE_ENERGY ) == ERR_NOT_IN_RANGE ) {
          creep.moveTo( targets[sel] );
        }

      }
      else {
        // -- Send em to a different room
        creep.say( "BruH" );
      }

    }

  }

};

export default harvester;
