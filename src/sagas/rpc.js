import {
  put,
  takeLatest,
  call,
  cps,
  fork,
  select,
  all
} from 'redux-saga/effects';

import { message } from 'antd';

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
  const { zerorpc } = rpc;
  const { algo, fileList, key } = payload;

  console.log(key);
  console.log('RPC call encrypt');
  yield all(
    fileList.map(file => {
      console.log('CALL: ', file);
      return fork(zerorpc.invoke, 'encrypt', algo, file, key, rpc_callback);
    })
  );
  yield put({ type: 'rpc/clearFile' });
}

function* decryptFile({ payload }) {
  const { rpc } = yield select();
  const { zerorpc } = rpc;
  const { algo, fileList, key } = payload;

  console.log('RPC call decrypt');
  yield all(
    fileList.map(file => {
      console.log('CALL: ', file);
      return fork(zerorpc.invoke, 'decrypt', algo, file, key, rpc_callback);
    })
  );
  yield put({ type: 'rpc/clearFile' });
}

function* createKey({ payload }) {
  const { rpc } = yield select();
  const { zerorpc } = rpc;
  const { algo, key: passphrase } = payload;
  let key = [];

  console.log('RPC call create key');
  try {
    key = yield cps(zerorpc.invoke, 'generate_key', algo, passphrase);
    console.log(key);
    message.success('Create new key success');
  } catch (err) {
    console.log(err);
    message.error('Error create new key');
  }
  yield put({
    type: 'rpc/newKey',
    payload: {
      key: key,
      success: key.length > 0
    }
  });
}

function* actionWatcher() {
  yield takeLatest('rpc/encrypt', encryptFile);
  yield takeLatest('rpc/decrypt', decryptFile);
  yield takeLatest('rpc/createKey', createKey);
}

export default actionWatcher;
