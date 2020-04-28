---
title: "Promt customization"
date: 2020-04-28
categories:
  - Linux
---

I've been customizing my own prompt for a long time, and the main customizations were: adding the current time and color to the production server (Yes, I had and still have pet servers, where can I go without them). After that, I added the simplest scripts to display the current git branch and the repository status (whether there are changes or not). And here is in another times having looked in its .bashrc I decided to update the appearance and simplify the script that deals with filling PS1, as a result, I got new knowledge about what PS1-4 is, how to use PROMPT_COMMAND and most importantly - the types of $TERM and the use of colors in them. Below is an example of my PS1 and useful links.

So PS1, PS1 is responsible for prompt output in the console, for example:

```bash
user@host:~$ PS1="test> "
test>
```

Using Escape Sequences you can add useful information to PS1:

```bash
user@host:~$ PS1="test> "
test> PS1="\l \A \u@\h \w"
0 11:23 user@host ~
```

Where:

```bash
\l - the number of the terminal
\A - time
\u - user
\h - host
\w - directory
```

Full [list](https://www.tldp.org/HOWTO/Bash-Prompt-HOWTO/bash-prompt-escape-sequences.html) of bash escape sequences.

But, what if you want to add something other than this limited set? You can use variables!

```bash
user@host:~$ PS1="$(pwd) "
/home/user cd nginx
/home/user PS1="$(pwd) "
/home/user/nginx
```

But, as you can see, there is a problem with updating variables inside PS1, going to a different directory, the value in PS1 is not updated. Just to solve this problem, there is a `PROMPT_COMMAND` variable, its contents are executed every time before bash displays PS1:

```bash
user@host:~$ function __prompt() { PS1="$(pwd) $ "; };
user@host:~$ PROMPT_COMMAND=__prompt
/home/user $ cd nginx
/home/user/nginx $
```

Inside the `__prompt ' function, you can add your own logic and customize the PS1 in a huge number of ways. One way is to change the color.

You can use ANSI Control Dequences to work with color, for example:

```bash
red="\e[31m"
reset="\e[0m"
echo -e "${red}Hello${reset} World"
```

[List of control sequences](https://misc.flogisoft.com/bash/tip_colors_and_formatting)

Or tput:

```bash
for C in {0..255}; do
  # set foreground
  tput setaf $C;
  echo -n "$C ";
done

# reset
tput sgr 0

for C in {0..255}; do
  # set background
  tput setab $C;
  echo -n "$C ";
done

# reset
tput sgr 0
```

Using these basic blocks, you can make any complex PS1, below I will give the code of my PS1:

```bash
# ----------------------------------------------------------------
# CUSTOM PROMPT

# https://github.com/jimeh/git-aware-prompt
function find_git_info() {
  # Based on: http://stackoverflow.com/a/13003854/170413
  local status
  status=$(git status --porcelain 2>/dev/null)
  local branch
  if branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null); then
    if [[ "${branch}" == "HEAD" ]]; then
      branch="detached*"
    fi

    if [[ "$status" != "" ]]; then
      git_info=" (${branch})* "
    else
      git_info=" (${branch}) "
    fi
  else
    git_info=""
  fi
}

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
  debian_chroot=$(cat /etc/debian_chroot)
fi

PS2="~> "

PROMPT_COMMAND=__prompt_command

function __prompt_command() {
  local EXIT="$?"

  local color_prompt

  # set a fancy prompt (non-color, unless we know we "want" color)
  case "$TERM" in
  xterm-color | *-256color) color_prompt=yes ;;
  esac

  # https://askubuntu.com/questions/372849/what-does-debian-chrootdebian-chroot-do-in-my-terminal-prompt
  local visual_debian_chroot="${debian_chroot:+" (${debian_chroot}) "}"

  # If this is an xterm set the title to user@host:dir
  case "$TERM" in
  xterm* | rxvt*)
    [ -n "$__vte_prompt_command" ] && __vte_prompt_command
    local terminalTitle="[\l] ${visual_debian_chroot}\u@\h: \w"
    local setTerminalTitle="\[\e]0;${terminalTitle}\a\]"
    PS1="$setTerminalTitle"
    ;;
  *) ;;
  esac

  # save and update history in every window instantly
  history -a
  history -n

  find_git_info

  if [ "$color_prompt" = yes ]; then
    # https://misc.flogisoft.com/bash/tip_colors_and_formatting
    local defaultFg blackFg redFg greenFg yellowFg blueFg magentaFg cyanFg lightGrayFg
    defaultFg="\[$(tput setaf 0)\]"
    blackFg="\[$(tput setaf 16)\]"
    redFg="\[$(tput setaf 1)\]"
    greenFg="\[$(tput setaf 2)\]"
    yellowFg="\[$(tput setaf 3)\]"
    blueFg="\[$(tput setaf 4)\]"
    magentaFg="\[$(tput setaf 5)\]"
    cyanFg="\[$(tput setaf 6)\]"
    lightGrayFg="\[$(tput setaf 7)\]"

    local defaultBg blackBg redBg greenBg yellowBg blueBg magentaBg cyanBg lightGrayBg
    defaultBg="\[$(tput setab 0)\]"
    blackBg="\[$(tput setab 16)\]"
    redBg="\[$(tput setab 1)\]"
    greenBg="\[$(tput setab 2)\]"
    yellowBg="\[$(tput setab 3)\]"
    blueBg="\[$(tput setab 4)\]"
    magentaBg="\[$(tput setab 5)\]"
    cyanBg="\[$(tput setab 6)\]"
    lightGrayBg="\[$(tput setab 7)\]"

    local reset
    reset="\[$(tput sgr 0)\]"

    function addText() {
      local fg="${1}"
      local bg="${2}"
      local text="${3}"

      PS1+="$fg$bg$text$reset"
    }

    function addSeparator() {
      local separator=$'\uE0B0'
      local bg="${1}"
      local fg="${2}"

      PS1+="$bg$fg$separator$reset"
    }

    local prevFg=""

    addText "" "${blackBg}" " \l "
    prevFg="${blackFg}"

    # debian_chroot="test"
    if [ -n "$debian_chroot" ]; then
      addSeparator "${magentaBg}" "${blackFg}"
      addText "" "${magentaBg}" "${visual_debian_chroot}"
      prevFg="${magentaFg}"
    else
      true
    fi

    if [ -n "$prevFg" ]; then
      addSeparator "${yellowBg}" "${prevFg}"
    else
      true
    fi

    addText "" "${yellowBg}" " \A "
    addSeparator "${greenBg}" "${yellowFg}"
    addText "" "${greenBg}" " \u@\h "
    addSeparator "${blueBg}" "${greenFg}"
    addText "" "${blueBg}" " \w "

    if [ -n "$git_info" ]; then
      addSeparator "${cyanBg}" "${blueFg}"
      addText "" "${cyanBg}" "${git_info}"
      prevFg="${cyanFg}"
    else
      prevFg="${blueFg}"
    fi

    if [ $EXIT != 0 ]; then
      addSeparator "${redBg}" "${prevFg}"
      addText "" "${redBg}" " \$ "
      addSeparator "${reset}" "${redFg}"
    else
      addSeparator "${lightGrayBg}" "${prevFg}"
      addText "${blackFg}" "${lightGrayBg}" " \$ "
      addSeparator "${reset}" "${lightGrayFg}"
    fi

    addText "${reset}" "${reset}" " "
  else
    PS1="${visual_debian_chroot}\A \u@\h:\w${git_info}"

    if [ $EXIT != 0 ]; then
      PS1+="\$?↵ \$ "
    else
      PS1+="\$ "
    fi
  fi
}
```

## Some not obvious things that was used in my PS1

When I was developing my PS1 I noticed that PROMPT_COMMAND by default has the value `__the_prompt_command`, what it is? Let's see:

```
$ type __vte_prompt_command
__vte_prompt_command is a function
__vte_prompt_command ()
{
    local command=$(HISTTIMEFORMAT= history 1 | sed 's/^ *[0-9]\+ *//');
    command="${command//;/ }";
    local pwd='~';
    [ "$PWD" != "$HOME" ] && pwd=${PWD/#$HOME\//\~\/};
    printf '\033]777;notify;Command completed;%s\033\\\033]0;%s@%s:%s\033\\%s' "${command}" "${USER}" "${HOSTNAME%%.*}" "${pwd}" "$(__vte_osc7)"
}
```

It turned out that this is a function that will send `notify` if **PROMPT_COMMAND** is started, but the terminal is not in focus, for example, when you run a long command and do something else in another window. The source code located in the file `/etc/profile.d/vte.sh`

`"\[\e]0;${terminalTitle}\a\]"` - this escape sequence sets the title of the terminal window. for convenience, I have separated the escape sequence, and the title itself.

## Conclusion

Yes, you can always install oh-my-zsh/bash, roll a beautiful theme on top and get the same thing, but sometimes it's nice to figure out the topic yourself and do something on your own.

![my prompt](./shell.png)

## References:

* [Bash Prompt HOWTO](http://en.tldp.org/HOWTO/Bash-Prompt-HOWTO/)
* [ArchWiki: Bash/Prompt customization](https://wiki.archlinux.org/index.php/Bash/Prompt_customization)
* [Oh-my-zsh Themes](https://github.com/ohmyzsh/ohmyzsh/wiki/themes)
