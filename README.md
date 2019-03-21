# File Encryption System

## Requirements

- node
- yarn
- python3

## Build

```bash
yarn install
node_modules/.bin/electron-rebuild
pip install zerorpc
```

For auto format of python, `pip install autopep8`.

If you cannot run electron-rebuild:

Make sure you have installed `libzmq3-dev` on debian based machine (other machine can try find zmq on google).

If you are using old node version, (v8.x.x), then libzmq must be rebuild manually.

```bash
cd node_modules/zeromq
yarn run build # or npm run build
cp Release/lib/libzmq.a  lib/
cd ../../
node_modules/.bin/electron-rebuild
```

We need to rebuild electron to work with zeromq.

## Run

In one terminal:
```bash
yarn start
# will run react and electron
```

In another terminal:
```bash
python src/python/rpc.py
# will run the python server
```

## Development

- Everything should be in `src/components`
- Python backend should be in `src/python`
- Redux store is in `src/store.js`
- Reducer should be named after its namespace in `src/reducers` and export to `src/reducers/index.js`
- Sagas should be placed in `src/sagas`

> After everything is done, run `yarn run format`, to format your code.

## How?

React runs a server and electron open the link, in production, react is built and index.html is used. Electron should start python  backend binary, this backend will provide a tcp connection using zerorpc. At react code, get zerorpc from electron.remote (nodejs native code import), and call backend.
