const { spawn } = require('child_process')

let irDeviceId

const createIR = () => new Promise((resolve, reject) => {
  console.info(`Initiating discovery`);
  const blInstall = spawn('pip3', ['install', 'broadlink']);
  blInstall.stderr.on('data', function (data) {
    const errorLine = data.toString();
    console.error(errorLine)
  })
  blInstall.stdout.on('data', function (data) {
    const errorLine = data.toString();
    console.info(errorLine)
  })
  blInstall.on("close", (data) => {
    const outputLine = data.toString();
    console.log(outputLine)
    const python = spawn('broadlink_discovery');
    // collect data from script
    python.stderr.on('data', function (data) {
      const errorLine = data.toString();
      console.error(errorLine)
    })
    python.stdout.on('data', function (data) {
      const outputLine = data.toString();
      console.log(outputLine)
      const addressMatch = outputLine.match(/^(0x[\da-f]{4})\s((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s([\da-f]{12})$/gm)
      if (addressMatch) {
        irDeviceId = addressMatch[0]
        resolve({
          deviceId: irDeviceId
        })
      }
    })
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
      console.info(`Closed discovery`);
    })

  })
  
})

const sendCommand = (commandData) => {
  const shellCommand = `broadlink_cli --device "${irDeviceId}" --send "${commandData}`
  const python = spawn("broadlink_cli", [
    '--device',
    irDeviceId,
    '--send',
    commandData
  ]);
    // collect data from script
    python.stderr.on('data', function (data) {
      const errorLine = data.toString();
      console.error(errorLine)
    })
    python.stdout.on('data', function (data) {
      const outputLine = data.toString();
      console.log(outputLine)
      const addressMatch = outputLine.match(/^(0x[\da-f]{4})\s((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s([\da-f]{12})$/gm)
      if (addressMatch) {
        resolve({
          deviceId: addressMatch[0]
        })
      }
    })
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
      console.info(`Send finished`);
      console.info(code)
    })
}

module.exports = {
  createIR,
  sendCommand
}