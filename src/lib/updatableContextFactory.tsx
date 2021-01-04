import React, { useState, Dispatch, SetStateAction, ReactNode } from 'react';

import { contextFactory } from './contextFactory';

export const updatableContextFactory = <Data,>(initialValue: Data) => {
  const [ValueProvider, useContextValue] = contextFactory<Data>();
  const [DispatchProvider, useDispatch] = contextFactory<Dispatch<SetStateAction<Data>>>();

  const Provider = ({ children }: { children: ReactNode }) => {
    const [state, update] = useState<Data>(initialValue);

    return (
      <DispatchProvider value={update}>
        <ValueProvider value={state}>{children}</ValueProvider>
      </DispatchProvider>
    );
  };

  return [Provider, useContextValue, useDispatch] as const;
};
