const nodecec = require('node-cec');

const NodeCec = nodecec.NodeCec;
const CEC     = nodecec.CEC;

const createCec = () => new Promise((resolve, reject) => {
  var cec = new NodeCec( 'node-cec-monitor' );

  process.on( 'SIGINT', function() {
    if ( cec != null ) {
      cec.stop();
    }
    process.exit();
  });


  // -------------------------------------------------------------------------- //
  //- CEC EVENT HANDLING

  cec.once( 'ready', function(client) {
    console.log( ' -- READY -- ' );
    client.sendCommand( 0xf0, CEC.Opcode.GIVE_DEVICE_POWER_STATUS );
    resolve(cec)
  });

  cec.on( 'ROUTING_CHANGE', function(packet, fromSource, toSource) {
    console.log( 'Routing changed from ' + fromSource + ' to ' + toSource + '.' );
  });


  // -------------------------------------------------------------------------- //
  //- START CEC CLIENT

  // -m  = start in monitor-mode
  // -d8 = set log level to 8 (=TRAFFIC) (-d 8)
  // -br = logical address set to `recording device`
  cec.start( 'cec-client', '-m', '-d', '8', '-b', 'r' );
})

module.exports = {
  createCec,
  CEC
}