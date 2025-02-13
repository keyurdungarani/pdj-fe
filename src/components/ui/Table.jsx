import React from 'react';

const Table = ({ children }) => {
  return (
    <table className="min-w-full bg-white">
      {children}
    </table>
  );
};

export default Table;