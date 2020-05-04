import {useState} from 'react';

const useLogic = initialState => {
  const [count, setCount] = useState(initialState);
  return {
    count,
    incrementCount: () => setCount(count + 1),
  };
};

export default useLogic;
