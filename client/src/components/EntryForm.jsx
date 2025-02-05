import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import {
  Typography,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Button,
  Alert,
  Container,
} from '@mui/material';

import { useMutation } from '@apollo/client';
import { CREATE_EXPENSE } from '../apollo/mutations.js';

const EntryForm = ({ currencySymbol = '$' }) => {
  const [createExpense] = useMutation(CREATE_EXPENSE);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log(date, category, title, amount);

    const cleanAmount = amount.replace(/[^0-9.-]+/g, '');
    const parsedAmount = parseFloat(cleanAmount);

    try {
      const { data } = await createExpense({
        variables: {
          date,
          amount: parsedAmount,
          category,
          title,
        },
      });

      console.log('New expense created: ', data.createExpense);

      // reset form
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('');
      setTitle('');
      setAmount('');
    } catch (err) {
      console.error('Submission failed: ', err);
      setError(err.message || 'Failed to create expense. Please try again.');
    }
  };

  return (
    <Container>
      <Typography variant="h3">Entry Form</Typography>
      <Typography variant="subtitle">
        Pleasse fill out the details of your expense:
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8 }}>
        <Stack spacing={4} alignItems="center">
          <TextField
            sx={{ width: '15rem' }}
            id="entry-date"
            label="Date"
            type="date"
            variant="standard"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <FormControl sx={{ width: '15rem' }}>
            <InputLabel id="category">Category</InputLabel>
            <Select
              labelId="category"
              id="entry-category"
              value={category}
              label="Category"
              variant="standard"
              onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="homeUtilities">Home & Utilities</MenuItem>
              <MenuItem value="travel">Travel</MenuItem>
              <MenuItem value="groceries">Groceries</MenuItem>
              <MenuItem value="social">Social</MenuItem>
              <MenuItem value="rent">Rent</MenuItem>
            </Select>
          </FormControl>

          <TextField
            sx={{ width: '15rem' }}
            id="entry-title"
            label="Title"
            type="text"
            variant="standard"
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <NumericFormat
            customInput={TextField}
            sx={{ width: '15rem' }}
            label="Amount"
            variant="standard"
            thousandSeparator={true}
            fixedDecimalScale={true}
            value={amount}
            decimalScale={2}
            autoComplete="off"
            defaultValue="0.00"
            onChange={(e) => setAmount(e.target.value)}
            onValueChange={(values) => setAmount(values.value)}
            isAllowed={(values) => {
              const { floatValue } = values;
              return floatValue >= 0;
            }}
            prefix={currencySymbol}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, width: '15rem' }}>
            Add Entry
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default EntryForm;
