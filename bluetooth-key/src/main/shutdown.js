import bleno from "bleno"
import { platform } from "os"

export function graceful(exitCode = 0) {
  if (platform === "linux") {
    bleno.disconnect()
  }
  process.exit(exitCode)
}

export function force(exitCode = 1) {
  process.exit(exitCode)
}

export function schedule(timeout = 3000, exitCode = 1) {
  const timeoutId = setTimeout(() => {
    force(exitCode)
  }, timeout)
  return {
    cancel() { clearTimeout(timeoutId) }
  }
}