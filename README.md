# eos-dots
My dot files and stuff

![you are about to withess somthing incredible.](/home/supertort0ise/Templates/unknown.png)

>you may need to improt the /kde/ files at the end

Clone da repo and re-add the redacted info:

+ ~/.config/spotifyd/spotifyd.conf (username = "")

+ /etc/dnscrypt-proxy/dnscrypt-proxy.toml (server_names = [''],
[static]
  [static.'']
  stamp = '')

Commands to run:
1. `sudo pacman -S htop opendoas`
    1. - `sudo cp "~/eosdots/root/etc/doas.conf" "/etc/"; sudo chown root:root "/etc/doas.conf"; sudo chmod 0400 "/etc/doas.conf"`
    11. - `doas rm "~/eosdots/root/etc/dosa.conf"`

2. `doas cp -r "~/eosdots/root/" "/"`
    1. - `doas chown root:root "/etc/firewalld/firewalld.conf"; doas chmod 0600 "/etc/firewalld/firewalld.conf"; doas chown root:root "/etc/polkit-1/rules.d/10-disable-suspend.rules"; doas chmod 0600 "/etc/polkit-1/rules.d/10-disable-suspend.rules"`
3.    `doas cp -r "~/eosdots/home/supertort0ise/" "~/"`
4.    `doas locale-gen`
5.    `doas pacman -S grub-btrfs dnscrypt-proxy bluez bluez-qt bluez-utils bluedevil`
6.    `doas systemctl enable --now grub-btrfsd; doas systemctl enable --now cronie.service; doas systemctl enable --now dnscrypt-proxy.service; doas systemctl enable --now bluetooth`


My pkgs:
1. system `yay -S timeshift kdeplasma-addons plasma-systemmonitor jamesdsp kvantum klassy-git timeshift-autosnap krename ksystemlog partitionmanager qt6-imageformats qt-gstreamer systemd-kcm evdevhook-git grub-hook libva-nvidia-driver akm gamemode gstreamer-vaapi mpv vdpauinfo libva-utils appimagelauncher plasma-wayland-protocols kimageformats qt5-imageformats filelight plasma-wayland-session dualsensectl rpcs3-udev linuxconsole qpwgraph librewolf noto-fonts-emoji`

2. apps `yay -S vido inkscape kalk kcolorchooser elisa-git brave-bin cemu spotify-qt gamemode flatpak spotifyd armcord-bin yuzu-early-access torbrowser-launcher prismlauncher-qt5 kdenlive nvtop haruna okteta keepassxc goverlay-bin librewolf-extension-plasma-integration mangohud-git obs-studio paru qbittorrent rawtherapee steam vkbasalt meld krita onthespot-git protonup-qt discover`
