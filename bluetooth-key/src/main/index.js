import bleno from "bleno"
import { graceful, schedule, force } from "./shutdown"
import { UUID } from "./config"
import readline from "readline"

const shutdownIfNotInitialised = schedule()

let key = new Buffer("")
let isEnabled = false

bleno.on('stateChange', (state) => {

  if (state === "poweredOn") {
      bleno.startAdvertising("bluetooth_buddy", [UUID], (e) => {
        if (e !== null) {
          console.error("couldn't begin listening a connection")
          force()
          return
        }
        shutdownIfNotInitialised.cancel()
      })
  } else {
    bleno.stopAdvertising(() => {
      if (e != null) {
        force()
        return
      }
      graceful()
    })
  }
})

bleno.on('advertisingStart', (e)=>{
  console.log("advertising started")
  if (e !== null) {
    graceful(1)
  }

  readLoop()

  var primaryService = new bleno.PrimaryService({
    uuid: "1825",
    characteristics: [
      new bleno.Characteristic({
        uuid: "2A3D", 
        properties: ["read", "write"],
        onReadRequest: (offset, callback) => {
          callback(bleno.Characteristic.RESULT_SUCCESS, isEnabled? key.slice(offset) : new Buffer(""))
        },
        onWriteRequest: (data, offset, withoutResponse, callback) => {
          if (offset === 0) {
            key = data
          } else {
            const newKey = Buffer.alloc(data.length + key.length)
            key.copy(newKey)
            data.copy(newKey, key.length)
            key = newKey
          }
          callback(bleno.Characteristic.RESULT_SUCCESS)
        }
      })
    ]
  });
  
  bleno.setServices([ primaryService ], (e) => {
    if (e !== undefined) {
      console.log("err setting service: " + e)
      force()
    }
  })
});

process.on('SIGINT', () => {
  console.info('SIGINT signal received.')
  const timeout = schedule()
  bleno.stopAdvertising(() => {
    timeout.cancel()
    graceful()
  })
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.')
  const timeout = schedule()
  bleno.stopAdvertising(() => {
    timeout.cancel()
    graceful()
  })
});

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const helpText = `commands:
  help: display this message
  status: the current lock status of the device
  set [locked|unlocked]: set the lock status of the device 
`

reader.on("close", () => {
  console.log("")
  graceful()
})

function readLoop() {
  reader.question(`# `, (answer) => {
    if (answer === "help") {
      console.log(helpText)
    } else if (answer === "status") {
      console.log(`device is currently ${isEnabled? "unlocked" : "locked"}`)
    } else if (answer === "set unlocked") {
      isEnabled = true
    } else if (answer === "set locked") {
      isEnabled = false
    } else {
      console.log("command not recognised, enter \"help\" for list of commands")
    }

  
  readLoop()
})
}