#!/usr/bin/bash
#Disable 'Corsair Sabre RGB Pro WiFi' waking up my shit.
while true
do
sleep 1s;
  mouse_path=$(grep '1ba6' /sys/bus/usb/devices/*/idProduct); #find mouse.
  if [ -n "$mouse_path" ]; then
    echo disabled > "${mouse_path%/*}/power/wakeup"; #string manip and disable.
      break
  else
    echo "no mousey?"
  fi
done


