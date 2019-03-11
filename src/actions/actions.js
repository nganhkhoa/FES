const rpcEncrypt = folder => {
  return {
    type: 'rpc/encrypt',
    payload: {
      folder
    }
  };
};

export { rpcEncrypt };
