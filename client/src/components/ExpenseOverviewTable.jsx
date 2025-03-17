import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
} from '@mui/material';
import { getCategoryLabel, getPaymentMethodLabel } from '../utils/optionsData';

const ExpenseOverviewTable = ({
  expenses,
  loading: parentLoading,
  onExpenseDeleted,
}) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log('expenses: ', expenses);

  // update internal state when expenses prop changes
  useEffect(() => {
    if (parentLoading !== undefined) {
      setLoading(parentLoading);
    } else {
      // if expenses array has data, change loading to false
      setLoading(expenses.length === 0 && !Array.isArray(expenses));
    }

    if (Array.isArray(expenses)) {
      setTableData(expenses);
    }
  }, [expenses, parentLoading]);

  const handleClick = async (id) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete expense');
      }

      setTableData((prevData) =>
        prevData.filter((expense) => expense.id !== id)
      );

      if (onExpenseDeleted) {
        onExpenseDeleted(id);
      }
    } catch (err) {
      console.error('Deletion failed: ', err);
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: -5 }}>
      {/* {console.log(expenses)} */}
      <Table sx={{ minWidth: 650 }} aria-label="expenses table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Description</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Loading expenses...
              </TableCell>
            </TableRow>
          ) : tableData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No expenses found
              </TableCell>
            </TableRow>
          ) : (
            tableData.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell>{getCategoryLabel(row.category)}</TableCell>
                <TableCell>{row.title || 'N/A'}</TableCell>
                <TableCell>${row.amount?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>
                  {getPaymentMethodLabel(row.payment_method)}
                </TableCell>
                <TableCell>{row.description || '--'}</TableCell>
                <TableCell>
                  <button onClick={() => handleClick(row.id)}>x</button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExpenseOverviewTable;
