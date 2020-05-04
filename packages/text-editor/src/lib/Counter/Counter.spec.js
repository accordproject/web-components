import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import Counter from './Counter';

describe('lib > Counter', () => {
  /**
   * Jest hook which runs before each test,
   * @see https://jestjs.io/docs/en/api#beforeeachfn-timeout
   */
  beforeEach(() => {});

  it('renders without crashing', () => {
    /**
     * `asFragment`:
     * @see https://testing-library.com/docs/react-testing-library/api#asfragment
     * `baseElement`:
     * @see https://testing-library.com/docs/react-testing-library/api#baseelement
     */
    const {asFragment, baseElement} = render(<Counter initialValue={6} />);

    /**
     * Basic snapshot test to make sure, that rendered component
     * matches expected footprint.
     */
    expect(asFragment()).toMatchSnapshot();

    /** More precise test for counter value */
    expect(baseElement.querySelector('strong').textContent).toBe('6'); // 6 is value we expect, we need to convert Number to String, because HTMLElement textContent method returns string value
  });

  it('dispatches an action on button click', () => {
    const value = 1;

    /**
     * `getByRole`:
     * @see https://testing-library.com/docs/dom-testing-library/api-queries#byrole
     */
    const {getByRole, baseElement} = render(<Counter initialValue={value} />);

    /**
     * Search for the button and make testing library click on it
     * @see https://testing-library.com/docs/react-testing-library/cheatsheet#events
     */
    fireEvent.click(getByRole('button'));

    /** Check if counter was incremented  */
    expect(baseElement.querySelector('strong').textContent).toBe(
      `${value + 1}`
    );
  });
});
