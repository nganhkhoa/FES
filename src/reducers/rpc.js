const addFile = (state, payload) => {
  const { file } = payload;
  const index = state.fileList.indexOf(file);
  if (index !== -1) return state;

  console.log('Add file', file);
  return Object.assign({}, state, {
    ...state,
    fileList: [...state.fileList, file]
  });
};

const removeFile = (state, payload) => {
  const { file } = payload;
  console.log('Remove file', file);
  const index = state.fileList.indexOf(file);
  const newFileList = state.fileList.slice();
  newFileList.splice(index, 1);
  return {
    ...state,
    fileList: newFileList
  };
};

const rpcReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case 'rpc/addFile':
      return addFile(state, payload);
    case 'rpc/removeFile':
      return removeFile(state, payload);
    case 'rpc/clearFile':
      return Object.assign({}, state, {
        ...state,
        fileList: []
      });
    case 'rpc/newKey':
      return Object.assign({}, state, {
        ...state,
        key: payload.key,
        createKeySuccess: payload.success
      });
    default:
      return state;
  }
};

export default rpcReducer;
