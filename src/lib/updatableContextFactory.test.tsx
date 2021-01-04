import { renderHook, act } from '@testing-library/react-hooks';

import { updatableContextFactory } from './updatableContextFactory';
import { InvalidContextUsage } from './errors';

describe('contextFactory', () => {
  it('should throw error because of lack of the Provider', () => {
    const [, useContextValue] = updatableContextFactory<null>(null);

    const { result, waitForNextUpdate } = renderHook(() => useContextValue());

    waitForNextUpdate();

    expect(result.error).toEqual(new InvalidContextUsage());
  });

  it('create context with initial value', () => {
    type ContextValue = {
      data: string;
    };

    const initialValue: ContextValue = { data: 'test' };

    const [Provider, useContextValue] = updatableContextFactory<ContextValue>(initialValue);

    const { result } = renderHook(() => useContextValue(), {
      wrapper: ({ children }) => <Provider>{children}</Provider>,
    });

    expect(result.current).toEqual(initialValue);
  });

  it('create context with initial value and update it', () => {
    type ContextValue = {
      data: string;
    };

    const initialValue: ContextValue = { data: 'test' };

    const [Provider, useContextValue, useUpdateValue] = updatableContextFactory<ContextValue>(initialValue);

    const { result } = renderHook(
      () => {
        const update = useUpdateValue();

        return { value: useContextValue(), updateValue: update };
      },
      {
        wrapper: ({ children }) => <Provider>{children}</Provider>,
      },
    );

    expect(result.current.value).toEqual(initialValue);

    const nextData: ContextValue = {
      data: 'nextData',
    };
    act(() => {
      result.current.updateValue(nextData);
    });

    expect(result.current.value).toEqual(nextData);
  });
});
