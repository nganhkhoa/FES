const routeReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case "route/change":
      return Object.assign({}, state, {
        current: payload.page
      });
    default:
      return state;
  }
};

export default routeReducer;
