import React, { createContext, useContext, Context, ReactNode } from 'react';

import { ProviderValueError, InvalidContextUsage } from './errors';

type ProviderProps<T> = {
  value: T;
  children?: ReactNode;
};

const useContextValue = <Value,>(context: Context<Value>) => {
  const value = useContext<Value>(context);

  if (value === undefined) {
    throw new InvalidContextUsage();
  }

  return value;
};

const createProvider = <Value,>({ children, value }: ProviderProps<Value>, context: Context<Value>) => {
  const ContextProvider = context.Provider;

  if (value === undefined) {
    throw new ProviderValueError();
  }

  return <ContextProvider value={value}>{children}</ContextProvider>;
};

export const contextFactory = <Data,>() => {
  const ctx = createContext<Data>((undefined as unknown) as Data);

  const useContextData = () => useContextValue<Data>(ctx);
  const Provider = (props: ProviderProps<Data>) => createProvider(props, ctx);

  return [Provider, useContextData] as const;
};
