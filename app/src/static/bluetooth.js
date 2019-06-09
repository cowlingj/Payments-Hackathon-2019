var bluetoothName = "bluetooth buddy"

function writeKeyToDevice(key) {
  return navigator.bluetooth.requestDevice({
    filters: [{ name: bluetoothName }]
  }).then(function (device) {
    return device.gatt.connect();
  }).then(function (server) {
    return server.getPrimaryService(0x1825);
  }).then(function (service) {
    return service.getCharacteristic(0x2A3D);
  }).then(function (characteristic) {
    return characteristic.writeValue(new Buffer(key));
  }).catch(function (error) {
    console.error('Connection failed!', error);
  });
}

function readKeyFromDevice(key) {

  return navigator.bluetooth.requestDevice({
    filters: [{ name: bluetoothName }]
  }).then(function (device) {
    return device.gatt.connect();
  }).then(function (server) {
    return server.getPrimaryService(0x1825);
  }).then(function (service) {
    return service.getCharacteristic(0x2A3D);
  }).then(function (characteristic) {
    return characteristic.readValue();
  }).catch(function (error) {
    console.error('Connection failed!', error);
  });
}