const addFolder = (state, payload) => {
  const { file } = payload;
  const index = state.folderList.indexOf(file);
  if (index !== -1) return state;

  console.log('Add file', file);
  return Object.assign({}, state, {
    ...state,
    folderList: [...state.folderList, file]
  });
};

const removeFolder = (state, payload) => {
  const { file } = payload;
  console.log('Remove file', file);
  const index = state.folderList.indexOf(file);
  const newFileList = state.folderList.slice();
  newFileList.splice(index, 1);
  return {
    ...state,
    folderList: newFileList
  };
};

const encryptFolder = (state, payload) => {
  const { zerorpc, folderList } = state;
  const { algo } = payload;
  console.log('RPC call encrypt_folder');
  // TODO: Make await
  folderList.forEach(folder => {
    console.log('CALL: ', folder);
    zerorpc.invoke(
      'encrypt_folder',
      algo,
      folder.path,
      'keyfile.PEM',
      (err, res, more) => {
        console.log(res);
      }
    );
  });
  return Object.assign({}, state, {
    ...state,
    folderList: []
  });
};

const rpcReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case 'rpc/addFolder':
      return addFolder(state, payload);
    case 'rpc/removeFolder':
      return removeFolder(state, payload);
    case 'rpc/encryptFolder':
      return encryptFolder(state, payload);
    default:
      return state;
  }
};

export default rpcReducer;
