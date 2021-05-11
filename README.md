# Setup

Create a `workspaces` folder in the working directory of the project - this will contain clones of each repository you want to work with.

Using git, clone repositories into the workspaces folder. Add an `id_rsa` private key in each folder; this is the private key git will use to connect to the repository.

For example:
```
root
+-workspaces
  +-repo1
  | +-id_rsa
  | +-.git
  +-repo2
    +-id_rsa
    +-.git
```

To request repository data for `repo1`, send a request to `host:8080/repo1`. Same for `repo2`.

# About

Created using:
https://code.visualstudio.com/docs/remote/create-dev-container#_automate-dev-container-creation

By Klazen108, 2021

ISC License