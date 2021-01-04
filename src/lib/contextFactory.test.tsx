import { renderHook } from '@testing-library/react-hooks';

import { contextFactory } from './contextFactory';
import { ProviderValueError, InvalidContextUsage } from './errors';

describe('contextFactory', () => {
  it('should throw error because of lack of the Provider', () => {
    const [, useContextValue] = contextFactory();

    const { result, waitForNextUpdate } = renderHook(() => useContextValue());

    waitForNextUpdate();

    expect(result.error).toEqual(new InvalidContextUsage());
  });

  it('should throw error because of incorrect provider value', () => {
    const [Provider, useContextValue] = contextFactory<undefined>();

    expect(() =>
      renderHook(() => useContextValue(), {
        wrapper: ({ children }) => <Provider value={undefined}>{children}</Provider>,
      }),
    ).toThrow(new ProviderValueError());
  });

  it('should create context with value', () => {
    type ContextValue = {
      data: string;
    };

    const [Provider, useContextValue] = contextFactory<ContextValue>();
    const contextValue: ContextValue = {
      data: 'test',
    };

    const { result } = renderHook(() => useContextValue(), {
      wrapper: ({ children }) => <Provider value={contextValue}>{children}</Provider>,
    });

    expect(result.current.data).toBe(contextValue.data);
  });
});
