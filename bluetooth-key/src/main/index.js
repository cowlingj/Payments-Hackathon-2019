import bleno from "bleno"

function shutdownOnTimeout(timeout = 3000, exitCode = 1) {
  const timeoutId = setTimeout(()=>{
    process.exit(exitCode)
  }, timeout)
  return {
    cancel() { clearTimeout(timeoutId) }
  }
}

const shutdownIfNotInitialised = shutdownOnTimeout()

bleno.on('stateChange', (state) => {
  if (state == "poweredOn") {
    bleno.startAdvertising("name", ["uuid1", "uuid2"], (e) => {
      if (e !== null) {
        console.error("couldn't begin listening a connection")
        process.exit(1)
        return
      }
      shutdownIfNotInitialised.cancel()
    })
  }
})

process.on('SIGINT', () => {
  console.info('SIGINT signal received.')
  const timeout = shutdownOnTimeout()
  bleno.stopAdvertising(() => {
    timeout.cancel()
    process.exit(0)
  })
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.')
  const timeout = shutdownOnTimeout()
  bleno.stopAdvertising(() => {
    timeout.cancel()
    process.exit(0)
  })
});