# gitlab-token.md
## Generate SSH key (local machine)

```
ssh-keygen -t ed25519 -C "danny@gitlab"
```

Press Enter to accept default path:
```
~/.ssh/id_ed25519
```

(Optional) Enter a passphrase.

---

## Copy public key

```
cat ~/.ssh/id_ed25519.pub
```

Copy the full output.

---

## Add SSH key to GitLab (account danny)

Menu:
- GitLab → Avatar (top right)
- **Preferences**
- **SSH Keys**

Action:
- Paste the public key
- Title: danny-laptop
- **Add key**

---

## Test SSH connection

```
ssh -T git@gitlab.com
```

Expected message:
```
Welcome to GitLab, @danny!
```

---

## Clone repository using SSH

```
git clone git@gitlab.com:fr_kata_sf/test-EXAMPLE01.git
```

SSH authentication is now active.
