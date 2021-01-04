import React, { Dispatch, useReducer, Reducer } from 'react';

import { contextFactory } from './contextFactory';

export const updatableActionContextFactory = <Data, Actions>(initialState: Data, reducer: Reducer<Data, Actions>) => {
  const [ValueProvider, useContextValue] = contextFactory<Data>();
  const [DispatchProvider, useDispatch] = contextFactory<Dispatch<Actions>>();

  const Provider: React.FC = (props) => {
    const [state, update] = useReducer(reducer, initialState);

    return (
      <DispatchProvider value={update}>
        <ValueProvider value={state} {...props} />
      </DispatchProvider>
    );
  };

  return [Provider, useContextValue, useDispatch] as const;
};
