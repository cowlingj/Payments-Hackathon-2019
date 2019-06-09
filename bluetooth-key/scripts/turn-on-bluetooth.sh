#!/usr/bin/env bash

set -u -e

[ "$(id -u)" != "0" ] && echo "$0 must be run by root" && exit 1

systemctl start bluetooth.service
bluetoothctl <<< "power on"
