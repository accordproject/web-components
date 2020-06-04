import React from 'react';
import PropTypes from 'prop-types';
import useLogic from './useLogic';
import classes from './Counter.module.css';

const Counter = ({initialValue}) => {
  const {count, incrementCount} = useLogic(initialValue);

  return (
    <div className={classes.counter}>
      <h2 className={classes.header}>Counter</h2>
      <button className={classes.button} type="button" onClick={incrementCount}>
        Increment by one
      </button>
      <div>
        Total value: <strong>{count}</strong>
      </div>
    </div>
  );
};

Counter.propTypes = {
  /**
   * Define initial value for the Counter
   */
  initialValue: PropTypes.number.isRequired,
};

export default Counter;
