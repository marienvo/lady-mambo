# Git: project binnenhalen en updaten (clone + pull)

Deze repo staat op GitHub: `https://github.com/marienvo/lady-mambo.git`

## 1) Installeer Git

### Linux

- Fedora: `sudo dnf install git`
- Ubuntu/Debian: `sudo apt install git`
- Arch: `sudo pacman -S git`

### macOS

- `xcode-select --install`  
  (of, als je Homebrew gebruikt: `brew install git`)

### Windows

- Installeer **Git for Windows** en gebruik daarna **Git Bash**: [git-scm.com/download/win](https://git-scm.com/download/win)

## 2) Eén keer: clone (project ophalen)

Kies een map waar je projecten bewaart en run:

```bash
git clone https://github.com/marienvo/lady-mambo.git
cd lady-mambo
```

## 3) Daarna: pull (project updaten)

Ga in de projectmap staan en run:

```bash
git pull
```

## Als `git pull` faalt door lokale wijzigingen

Check eerst:

```bash
git status
```

Snelste “ik wil alleen updaten” optie:

```bash
git stash -u
git pull
git stash pop
```
