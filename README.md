# File Encryption System

## Requirements

- node
- yarn
- python3

## Build

```bash
yarn install
node_modules/.bin/electron-rebuild
```

## Run

In one terminal:
```bash
yarn start
```

In another terminal:
```bash
python src/python/rpc.py
```

## Development

- Everything should be in `src/components`
- Python backend should be in `src/python`
- Redux store is in `src/store.js`
- Reducer should be named after its namespace in `src/reducers` and export to `src/reducers/index.js`

This project has Saga installed, but no use yet.


## How?

React runs a server and electron open the link, in production, react is built and index.html is used. Electron should start python  backend binary, this backend will provide a tcp connection using zerorpc. At react code, get zerorpc from electron.remote (nodejs native code import), and call backend.
