import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

describe('environment > App', () => {
  it('renders without crashing', () => {
    /**
     * `asFragment`:
     * @see https://testing-library.com/docs/react-testing-library/api#asfragment
     */
    const {asFragment} = render(<App />);

    /**
     * Basic snapshot test to make sure, that rendered component
     * matches expected footprint.
     */
    expect(asFragment()).toMatchSnapshot();
  });
});
