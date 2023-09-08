# eos-dots
My dot files and stuff

Clone da repo and edit add this stuff.
Redacted info:
~/.config/spotifyd/spotifyd.conf [
    username = ""
 ]
/etc/dnscrypt-proxy/dnscrypt-proxy.toml [
server_names = ['']
[static]
  [static.'']
  stamp = ''
]

Commands to run:
sudo pacman -S htop opendoas
sudo cp "~/eosdots/root/etc/dosa.conf" "/etc/"; sudo chown root:root "/etc/doas.conf"; sudo chmod 0400 "/etc/doas.conf"; doas rm "~/eosdots/root/etc/dosa.conf"
doas cp -r "~/eosdots/root/" "/"
doas chown root:root "/etc/firewalld/firewalld.conf"; doas chmod 0600 "/etc/firewalld/firewalld.conf"; doas chown root:root "/etc/polkit-1/rules.d/10-disable-suspend.rules"; doas chmod 0600 "/etc/polkit-1/rules.d/10-disable-suspend.rules"
doas cp -r "~/eosdots/home/supertort0ise/" "~/"
doas locale-gen
doas pacman -S grub-btrfs dnscrypt-proxy bluez bluez-qt bluez-utils bluedevil
doas systemctl enable --now grub-btrfsd; doas systemctl enable --now cronie.service; doas systemctl enable --now dnscrypt-proxy.service; doas systemctl enable --now bluetooth


My pkgs:
yay -S timeshift kdeplasma-addons plasma-systemmonitor jamesdsp kvantum klassy-git timeshift-autosnap krename ksystemlog partitionmanager qt6-imageformats qt-gstreamer systemd-kcm evdevhook-git grub-hook libva-nvidia-driver akm gamemode gstreamer-vaapi mpv vdpauinfo libva-utils appimagelauncher plasma-wayland-protocols kimageformats qt5-imageformats filelight plasma-wayland-session dualsensectl rpcs3-udev linuxconsole qpwgraph librewolf noto-fonts-emoji

yay -S vido inkscape kalk kcolorchooser elisa-git brave-bin cemu spotify-qt gamemode flatpak spotifyd armcord-bin yuzu-early-access torbrowser-launcher prismlauncher-qt5 kdenlive nvtop haruna okteta keepassxc goverlay-bin librewolf-extension-plasma-integration mangohud-git obs-studio paru qbittorrent rawtherapee steam vkbasalt meld krita onthespot-git protonup-qt discover
