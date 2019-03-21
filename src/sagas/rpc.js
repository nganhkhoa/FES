import {
  put,
  takeLatest,
  call,
  cps,
  fork,
  select,
  all
} from 'redux-saga/effects';

const rpc_callback = (err, res, more) => {
  if (!more) {
    console.log(res);
    console.log('done');
  } else {
    console.log(res);
  }
};

function* encryptFile({ payload }) {
  const { rpc } = yield select();
  const { zerorpc, fileList } = rpc;
  const { algo } = payload;

  console.log('RPC call encrypt');
  yield all(
    fileList.map(file => {
      console.log('CALL: ', file);
      return fork(
        zerorpc.invoke,
        'encrypt',
        algo,
        file.path,
        'keyfile.PEM',
        rpc_callback
      );
    })
  );
  yield put({ type: 'rpc/clearFile' });
}

function* decryptFile({ payload }) {
  const { rpc } = yield select();
  const { zerorpc, fileList } = rpc;
  const { algo } = payload;
  console.log('RPC call decrypt');
  yield all(
    fileList.map(file => {
      console.log('CALL: ', file);
      return fork(
        zerorpc.invoke,
        'decrypt',
        algo,
        file.path,
        'keyfile.PEM',
        rpc_callback
      );
    })
  );
  yield put({ type: 'rpc/clearFile' });
}

function* createKey({ payload }) {
  const { rpc } = yield select();
  const { zerorpc } = rpc;
  const { algo } = payload;
  console.log('RPC call create key');
  const key = yield cps(zerorpc.invoke, 'generate_key', algo);
  console.log(key);
  yield put({
    type: 'rpc/newKey',
    payload: {
      pubkey: key[0],
      prikey: key[1]
    }
  });
}

function* actionWatcher() {
  yield takeLatest('rpc/encrypt', encryptFile);
  yield takeLatest('rpc/decrypt', decryptFile);
  yield takeLatest('rpc/createKey', createKey);
}

export default actionWatcher;
