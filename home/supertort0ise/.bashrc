#
# ~/.bashrc
#
#neofetch
PS1='\[\e[1;35m\]\w\[\e[0m\] 🔥'
#PS1='\[\e[1;31m\]\u@\h:\# \[\e[0m\]\n\[\e[1;35m\]\w \[\e[0m\]\[\e[1;36m\]🔥\[\e[0m\]'

alias ds='doas'
alias sudo='doas'
alias sudoedit='doas rnano'
alias grub-up='doas grub-install && doas grub-mkconfig -o /boot/grub/grub.cfg'
alias ls='ls --color=auto'
alias ll='ls -lav --ignore=..'   # show long listing of all except ".."
alias l='ls -lav --ignore=.?*'   # show long listing but no hidden dotfiles except "."
complete -cf doas
complete -cf ds
complete -cf sudo
bind '"\e[A":history-search-backward'
bind '"\e[B":history-search-forward'

[[ -z "$FUNCNEST" ]] && export FUNCNEST=100          # limits recursive functions, see 'man bash'


alias rmoph='doas pacman -Rs $(pacman -Qqtd)'
alias pacrmc='paccache -rk2'
alias yayrmc='yay -Sc --aur'
alias fpkrmc='flatpak uninstall --runtime nvidia && flatpak list --runtime'
alias dsu4='doas evdevhook "/home/supertort0ise/.playstation.json"'
alias dsu5='doas dualsensectl -d 48:18:8d:ad:53:cd player-leds 0 && doas dualsensectl -d 48:18:8d:ad:53:cd microphone off && doas dualsensectl -d 48:18:8d:ad:53:cd microphone-led off && doas dualsensectl -d 48:18:8d:ad:53:cd lightbar 40 0 20 && doas evdevhook "/home/supertort0ise/.playstation.json"'
alias dsunin='doas evdevhook "/home/supertort0ise/.nintendo.json"'

################################################################################
## Some generally useful functions.
## Consider uncommenting aliases below to start using these functions.
##
_open_files_for_editing() {
    # Open any given document file(s) for editing (or just viewing).
    # Note1:
    #    - Do not use for executable files!
    # Note2:
    #    - Uses 'mime' bindings, so you may need to use
    #      e.g. a file manager to make proper file bindings.

    if [ -x /usr/bin/exo-open ] ; then
        echo "exo-open $@" >&2
        setsid exo-open "$@" >& /dev/null
        return
    fi
    if [ -x /usr/bin/xdg-open ] ; then
        for file in "$@" ; do
            echo "xdg-open $file" >&2
            setsid xdg-open "$file" >& /dev/null
        done
        return
    fi

    echo "$FUNCNAME: package 'xdg-utils' or 'exo' is required." >&2
}

# alias ef='_open_files_for_editing'     # 'ef' opens given file(s) for editing
# alias pacdiff=eos-pacdiff
################################################################################

