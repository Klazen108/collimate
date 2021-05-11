# Setup

Requires a git installation. This was tested using the Visual Studio Code NodeJS Dev Container, which has a git installation by default. This project does not depend on git configuration settings; the keys for each workspace are kept with the workspaces.

Create a `workspaces` folder in the working directory of the project - this will contain clones of each repository you want to work with.

Using git, clone repositories into the workspaces folder. Add an `id_rsa` private key in each folder; this is the private key git will use to connect to the repository. Add your public key to the repositories you want to work with.

* To create a keypair: `ssh-keygen -o`
* Adding a public key to github: https://docs.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account

You can clone the repo using your ssh key using the following command:
```bash
GIT_SSH_COMMAND="ssh -i repo1/id_rsa" git clone --no-checkout git@github.com:example/repo.git repo1
```

Example Directory Layout:
```
root
+-src
+-workspaces
  +-repo1
  | +-id_rsa
  | +-.git
  +-repo2
    +-id_rsa
    +-.git
```

To start in dev mode, use `npm run start`

To request repository data for `repo1`, send a request to `host:8080/repo1`. Same for `repo2`.

# About

Created using:
https://code.visualstudio.com/docs/remote/create-dev-container#_automate-dev-container-creation

By Klazen108, 2021

ISC License