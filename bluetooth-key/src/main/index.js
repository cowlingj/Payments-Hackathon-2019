import bleno from "bleno"
import { graceful, schedule, force } from "./shutdown";
import { UUID } from "./config";

const shutdownIfNotInitialised = schedule()

let key = new Buffer("")

bleno.on('stateChange', (state) => {

  if (state === "poweredOn") {
      bleno.startAdvertising("name", [UUID], (e) => {
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

  var primaryService = new bleno.PrimaryService({
    uuid: "1825",
    characteristics: [
      new bleno.Characteristic({
        uuid: "2A3D", 
        properties: ["read", "write"],
        onReadRequest: (offset, callback) => {
          callback(bleno.Characteristic.RESULT_SUCCESS, key.slice(offset))
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