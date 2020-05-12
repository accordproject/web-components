import React from 'react';
import { MarkdownEditor } from 'lib';
import classes from './App.module.css';

const App = () => (
  <div className={classes.container}>
    <MarkdownEditor/>
  </div>
);

export default App;
