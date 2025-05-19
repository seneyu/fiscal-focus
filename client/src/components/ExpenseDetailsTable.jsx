import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Button,
  Modal,
  Box,
} from '@mui/material';
import { getCategoryLabel, getPaymentMethodLabel } from '../utils/optionsData';
import supabase from '../config/supabase';
import EditForm from './editForm';

const ExpenseDetailsTable = ({
  expenses,
  loading: parentLoading,
  onExpenseDeleted,
  onExpenseUpdated,
}) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
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

  const handleUpdate = async (id) => {
    try {
      console.log('Edit expense entry ID: ', id);
      // retrieve expense entry info by id
      const { data, error } = await supabase
        .from('expenses')
        .select()
        .eq('id', id)
        .single();
      console.log('Entry data: ', data);

      if (error) throw error;

      setEditingExpense(data);
      setModalOpen(true);
    } catch (err) {
      console.error('Update failed: ', err);
    }
  };

  const handleClosesModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  const handleDelete = async (id) => {
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

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="expenses table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ pl: '2rem' }}>Date</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Description</TableCell>
            <TableCell></TableCell>
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
                <TableCell component="th" scope="row" sx={{ pl: '2rem' }}>
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
                  <Button onClick={() => handleUpdate(row.id)}>Edit</Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(row.id)}>x</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="edit-expense-modal"
        aria-describedby="modal-to-edit-expense-details">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
          <EditForm
            expense={editingExpense}
            onClose={handleCloseModal}
            onUpdate={(updatedExpense) => {
              setTableData((prevData) =>
                prevData.map((exp) =>
                  exp.id === updatedExpense.id ? updatedExpense : exp
                )
              );
              handleClosesModal();
              if (onExpenseUpdated) {
                onExpenseUpdated(updatedExpense);
              }
            }}
          />
        </Box>
      </Modal>
    </TableContainer>
  );
};

export default ExpenseDetailsTable;
