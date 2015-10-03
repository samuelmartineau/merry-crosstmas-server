# merry-crosstmas-server

## Scaffolding

```
WorkingDirectory
    remotes
        merry-crosstmas-client
    merry-crosstmas-server
    views(--> ../remotes/merry-crosstmas-client)
    server.js
    package.json
```

## Required

[sub tree](http://tdd.github.io/git-stree/)

## subtree

The views folder is a subtree connected to merry-crosstmas-client remote

Add the subtree

```
git stree add client -P views ../remotes/merry-crosstmas-client master
```

Pull the subtree

````
git stree pull client
```
