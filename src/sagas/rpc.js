import { put, takeLatest, select } from "redux-saga/effects";

function* encryptFolder({ payload }) {
  const { rpc } = yield select();
  const { zerorpc, folderList } = rpc;
  const { algo } = payload;
  console.log("RPC call encrypt_folder");
  // TODO: Make await
  folderList.forEach(folder => {
    console.log("CALL: ", folder);
    zerorpc.invoke(
      "encrypt_folder",
      algo,
      folder.path,
      "keyfile.PEM",
      (err, res, more) => {
        console.log(res);
      }
    );
  });
  yield put({ type: "rpc/clearFolder" });
}

function* actionWatcher() {
  yield takeLatest("rpc/encryptFolder", encryptFolder);
}

export default actionWatcher;
