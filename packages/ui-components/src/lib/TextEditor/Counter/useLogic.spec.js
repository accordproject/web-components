import {renderHook, act} from '@testing-library/react-hooks';
import useLogic from './useLogic';

describe('lib > Counter > useLogic', () => {
  const initialValue = 0;
  it('renders', () => {
    /**
     * Render hook, using testing-library utility
     * @see https://react-hooks-testing-library.com/reference/api#renderhook
     */
    const {result} = renderHook(() => useLogic(initialValue));

    expect(result.current).toMatchSnapshot();
  });
  it('increments value', () => {
    /**
     * Render hook, using testing-library utility
     * @see https://react-hooks-testing-library.com/reference/api#renderhook
     */
    const {result} = renderHook(() => useLogic(initialValue));

    /**
     * Wrap state update with act
     * @see https://react-hooks-testing-library.com/usage/basic-hooks#updates
     * @see https://fb.me/react-wrap-tests-with-act
     */
    act(() => {
      result.current.incrementCount();
    });

    expect(result.current.count).toBe(initialValue + 1);
  });
});
