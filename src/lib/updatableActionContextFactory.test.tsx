import { renderHook, act } from '@testing-library/react-hooks';

import { updatableActionContextFactory } from './updatableActionContextFactory';
import { InvalidContextUsage } from './errors';

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

describe('updatableActionContextFactory', () => {
  it('should throw error because of lack of the Provider', () => {
    const [, useContextValue] = updatableActionContextFactory(initialState, reducer);

    const { result, waitForNextUpdate } = renderHook(() => useContextValue());

    waitForNextUpdate();

    expect(result.error).toEqual(new InvalidContextUsage());
  });

  it('create context with initial value', () => {
    const [Provider, useContextValue] = updatableActionContextFactory(initialState, reducer);

    const { result } = renderHook(() => useContextValue(), {
      wrapper: ({ children }) => <Provider>{children}</Provider>,
    });

    expect(result.current).toEqual(initialState);
  });

  fit('create context with initial value and update it', () => {
    const [Provider, useContextValue, useDispatch] = updatableActionContextFactory(initialState, reducer);

    const { result } = renderHook(
      () => {
        const dispatch = useDispatch();

        return { ...useContextValue(), dispatch };
      },
      {
        wrapper: ({ children }) => <Provider>{children}</Provider>,
      },
    );

    expect(result.current.count).toEqual(initialState.count);

    act(() => {
      result.current.dispatch(increment());
    });

    expect(result.current.count).toEqual(initialState.count + 1);

    act(() => {
      result.current.dispatch(decrement());
    });

    expect(result.current.count).toEqual(initialState.count);
  });
});
