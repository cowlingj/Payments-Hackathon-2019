function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2);
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function writeKeyToDevice(key) {
  return navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [0x1825]
  }).then(function (device) {
    return device.gatt.connect();
  }).then(function (server) {
    return server.getPrimaryService(0x1825);
  }).then(function (service) {
    return service.getCharacteristic(0x2A3D);
  }).then(function (characteristic) {
    return characteristic.writeValue(str2ab(key));
  }).catch(function (error) {
    console.error('Connection failed!', error);
  });
}

function readKeyFromDevice() {

  return navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [0x1825],
  }).then(function (device) {
    return device.gatt.connect();
  }).then(function (server) {
    return server.getPrimaryService(0x1825);
  }).then(function (service) {
    return service.getCharacteristic(0x2A3D);
  }).then(function (characteristic) {
    return characteristic.readValue();
  }).then(function (dataView) {
     return ab2str(dataView.buffer)
  }).catch(function (error) {
    console.error('Connection failed!', error);
  });
}