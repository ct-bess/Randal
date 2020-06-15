const defender = {

  /** @param { Creep } creep **/
  run: function( creep: Creep, seed: number ) {

    const targets: Creep[] = creep.room.find( FIND_HOSTILE_CREEPS );

    if( !!targets ) {
      const sel: number = Math.floor( seed % targets.length );
      const tryAttack = creep.attack( targets[sel] );
      if( tryAttack == ERR_NOT_IN_RANGE ) {
        creep.moveTo( targets[sel] );
      }
    }
    /*
    else {
      const flags: Flag[] = creep.room.find( FIND_FLAGS );
      const sel: number = Math.floor( seed % flags.length );
      if( !!flags ) creep.moveTo( flags[sel] );
    }
    */

  }

};

export default defender;
