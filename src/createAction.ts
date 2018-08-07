
const createAction = <Payload, PayloadArgs extends any[] = any[], Meta = any>(
  actionName: string,
  payloadReducer?: (...pArgs: PayloadArgs) => Payload,
  metaReducer?: (...mArgs: PayloadArgs) => Meta,
) => {
  function actionCreator(...args: PayloadArgs) {
    const payload = typeof payloadReducer === 'function'
      ? payloadReducer(...args)
      : args[0] as Payload;

    const baseAction = {
      payload,
      type: actionName,
      error: payload instanceof Error,
    };

    if (typeof metaReducer === 'function') {
      const meta = metaReducer(...args);

      return {
        ...baseAction,
        meta,
      };
    }

    return baseAction;
  }

  actionCreator.toString = () => actionName;

  return actionCreator;
};

export default createAction;
