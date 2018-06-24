import { BatchedMeta } from './batchActions';

/**
 * Unpackes some types:
 * - promise resolve type
 */
export type Unpacked<T> =
  T extends Promise<infer U> ? U :
  T;

/**
 * When you want to unpack action payload type.
 * For example in a middleware, where action may be any type and you want to cast to action type with unpacked payload field.
 * @example UnpackActionPayloadType<typeof someAction>
 */
export type UnpackActionPayloadType<ModusActionType extends (...args: any[]) => any> = {
  [T in keyof ReturnType<ModusActionType>]: T extends 'payload'
    ? Unpacked<ReturnType<ModusActionType>[T]>
    : ReturnType<ModusActionType>[T];
};

type DefaultMetaType = BatchedMeta | undefined;

/**
 * FSA-compatible action type
 */
export interface FSA<P, M = DefaultMetaType> {
  type: string;
  payload?: P;
  error?: boolean;
  meta?: M;
}

export type ReduceFunction<S, P = any, M = DefaultMetaType> = (state: S, payload: Unpacked<P>, meta: M) => S;

export type SimpleOptArgActionCreator<P, M = DefaultMetaType> = (arg?: P) => FSA<P, M>;
export type ComplexNoArgActionCreator<P, M = DefaultMetaType> = () => FSA<P, M>;
/**
 * Argument count more than 3 ones is anti-pattern
 */
export type ComplexArg1ActionCreator<Arg1, P, M = DefaultMetaType> = (arg1: Arg1) => FSA<P, M>;
export type ComplexArg2ActionCreator<Arg1, Arg2, P, M = DefaultMetaType> = (arg1: Arg1, arg2: Arg2) => FSA<P, M>;
export type ComplexArg3ActionCreator<Arg1, Arg2, Arg3, P, M = DefaultMetaType> = (arg1: Arg1, arg2: Arg2, arg3: Arg3) => FSA<P, M>;

export type MetaReducer<M> = (...args: any[]) => M;

export type PayloadReducerNoArg<P> = () => P;
export type PayloadReducerArg1<Arg1, P> = (arg1: Arg1) => P;
export type PayloadReducerArg2<Arg1, Arg2, P> = (arg1: Arg1, arg2: Arg2) => P;
export type PayloadReducerArg3<Arg1, Arg2, Arg3, P> = (arg1: Arg1, arg2: Arg2, arg3: Arg3) => P;

export interface Reducer<S> {
  (state: S | undefined, action: FSA<any>): S;

  on<P, M = DefaultMetaType>(actionCreator: ComplexNoArgActionCreator<P, M> | string, reduceFunction: ReduceFunction<S, P, M>): Reducer<S>;
  on<Arg1, P, M = DefaultMetaType>(actionCreator: ComplexArg1ActionCreator<Arg1, P, M> | string, reduceFunction: ReduceFunction<S, P, M>): Reducer<S>;

  on<Arg1, Arg2, P, M = DefaultMetaType>(
    actionCreator: ComplexArg2ActionCreator<Arg1, Arg2, P, M> | string,
    reduceFunction: ReduceFunction<S, P, M>,
  ): Reducer<S>;

  on<Arg1, Arg2, Arg3, P, M = DefaultMetaType>(
    actionCreator: ComplexArg3ActionCreator<Arg1, Arg2, Arg3, P, M> | string,
    reduceFunction: ReduceFunction<S, P, M>,
  ): Reducer<S>;

  on<P, M = DefaultMetaType>(actionCreator: SimpleOptArgActionCreator<P> | string, reduceFunction: ReduceFunction<S, P, M>): Reducer<S>;
}

export interface CreateAction {
  <P>(actionName: string): SimpleOptArgActionCreator<P>;

  <P>(actionName: string, payloadReducer: PayloadReducerNoArg<P>): ComplexNoArgActionCreator<P>;
  <Arg1, P>(actionName: string, payloadReducer: PayloadReducerArg1<Arg1, P>): ComplexArg1ActionCreator<Arg1, P>;
  <Arg1, Arg2, P>(actionName: string, payloadReducer: PayloadReducerArg2<Arg1, Arg2, P>): ComplexArg2ActionCreator<Arg1, Arg2, P>;
  <Arg1, Arg2, Arg3, P>(actionName: string, payloadReducer: PayloadReducerArg3<Arg1, Arg2, Arg3, P>): ComplexArg3ActionCreator<Arg1, Arg2, Arg3, P>;

  <P, M>(actionName: string, payloadReducer: PayloadReducerNoArg<P>, metaReducer: MetaReducer<M>): ComplexNoArgActionCreator<P, M>;
  <Arg1, P, M>(actionName: string, payloadReducer: PayloadReducerArg1<Arg1, P>, metaReducer: MetaReducer<M>): ComplexArg1ActionCreator<Arg1, P, M>;

  <Arg1, Arg2, P, M>(
    actionName: string,
    payloadReducer: PayloadReducerArg2<Arg1, Arg2, P>,
    metaReducer: MetaReducer<M>,
  ): ComplexArg2ActionCreator<Arg1, Arg2, P, M>;

  <Arg1, Arg2, Arg3, P, M>(
    actionName: string,
    payloadReducer: PayloadReducerArg3<Arg1, Arg2, Arg3, P>,
    metaReducer: MetaReducer<M>,
  ): ComplexArg3ActionCreator<Arg1, Arg2, Arg3, P, M>;
}

export type ActionFactory = (namespace: string) => CreateAction;
