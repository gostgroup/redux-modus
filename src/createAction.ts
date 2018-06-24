import { CreateAction } from './types';

const createAction: CreateAction = (actionName: any, payloadReducer?: any, metaReducer?: any) => {

  function actionCreator(...args: any[]) {
    const payload = typeof payloadReducer === 'function'
      ? payloadReducer(...args)
      : args[0];

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
