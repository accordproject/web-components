import React from 'react';
import { render, screen } from '@testing-library/react';
import Leaf from './Leaf';

const children = 'Hello World';
const leaf = {};

test('load leaf and check content', () => {
  render(
    <Leaf leaf={leaf}>{children}</Leaf>
  );

  expect(screen.getByText('Hello World')).toBeTruthy();
});
