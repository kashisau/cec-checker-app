const { createCec, CEC } = require('./cec/cec')
const { createIR, sendCommand } = require('./remote/remote')

const MUSIC_MODE = "260030001b1d3a3b3a1e1c1e1d1d1d1e1d3a1d1e1c1e3a3b1c000b791d1d3a3b3a1d1d1e1d1d1d1e1c3b1d1d1d1e3a3a1d000d05"
const TV_MODE = "260034001d1b1f1c1f1b3c1c1e1c1f1b1f1c1f381f1c1f1b3c1c1e000b941f1b1f1c1e1c3c1b1f1c1f1b1f1c1f381f1b1f1c3c1b1f000d05"

let irDeviceId

function main() {
  createCec().then(
    (cec) => {
      console.info("CEC initialised")
      cec.on( 'REPORT_POWER_STATUS', function (packet, status) {
        switch (status) {
          case CEC.PowerStatus.STANDBY:
            console.log("Powered off")
            if (irDeviceId) {
              sendCommand(MUSIC_MODE)
            }
            break;
            case CEC.PowerStatus.ON:
              console.log("Powered on")
              if (irDeviceId) {
                sendCommand(TV_MODE)
              }
            break;
        }
      });
    }
  )
  console.info("Setting up remote...")
  createIR().then((irDevice) => {
    irDeviceId = irDevice.deviceId
  })
}

main()