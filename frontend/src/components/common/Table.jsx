import React from 'react';
import './Table.css';

const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, index) => renderRow(row, index))
          ) : (
            <tr>
              <td colSpan={headers.length} className="table-empty">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
