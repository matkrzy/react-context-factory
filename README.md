# React context factory
This package simplifies building of the contexts and checks for proper usage 
of the context value.

#### Inspired by [sw-yx gist](https://gist.github.com/sw-yx/f18fe6dd4c43fddb3a4971e80114a052)

### contextFactory
```JSX
import React from 'react';
import { contextFactory } from 'react-context-factory/dist';

type Value = { name: string };

const [ContextProvider, useContextValue] = contextFactory<Value>();

const Example = () => {
  const data = useContextValue();

  return <div>User name: {data.name}</div>;
};

const App = () => {
  const contextValue: Value = { name: 'John' };

  return (
    <ContextProvider value={contextValue}>
      <Example />
    </ContextProvider>
  );
};
```

### updatableContextFactory
```JSX
import React from 'react';
import { updatableContextFactory } from 'react-context-factory/dist';

type Value = { name: string } | null;

const [ContextProvider, useContextValue, useSetState] = updatableContextFactory<Value>(null);

const Example = () => {
  const data = useContextValue();

  if (data) {
    return <div>User name: {data.name}</div>;
  }
s
  return null;
};

const App = () => {
  const setContextValue = useSetState();

  const handleOnClick = () => setContextValue({ name: 'John' });

  return (
    <ContextProvider>
      <Example />
      <button onClick={handleOnClick}>change name to John</button>
    </ContextProvider>
  );
};
```

### updatableActionContextFactory
```JSX

type State = {
  count: number;
};

const initialState: State = {
  count: 0,
};

const increment = () =>
  ({
    type: 'INCREMENT',
  } as const);

const decrement = () =>
  ({
    type: 'DECREMENT',
  } as const);

type Actions = ReturnType<typeof decrement> | ReturnType<typeof increment>;

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      return state;
  }
};

const [Provider, useContextValue, useDispatch] = updatableActionContextFactory(initialState, reducer);

```
