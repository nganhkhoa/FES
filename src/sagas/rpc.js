import { put, takeLatest, call, fork, select, all } from 'redux-saga/effects';

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

function* actionWatcher() {
  yield takeLatest('rpc/encrypt', encryptFile);
  yield takeLatest('rpc/decrypt', decryptFile);
}

export default actionWatcher;
