import React, { useContext } from 'react';
import { MyContext } from './MyContext';

const Counter: React.FC = () => {
  const context = useContext(MyContext);
  
  if (!context) {
    throw new Error('Counter must be used within a MyContextProvider');
  }

  const { count, setCount } = context;

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default Counter;
