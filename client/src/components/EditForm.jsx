import React, { useState, useEffect } from 'react';
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
  Chip,
  Autocomplete,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import {
  categoryOptions,
  paymentOptions,
  tagOptions,
} from '../utils/optionsData';

const EditForm = ({ expense, onClose, onUpdate }) => {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (expense) {
      setDate(expense.date || '');
      setCategory(expense.category || '');
      setTitle(expense.title || '');
      setAmount(expense.amount?.toString() || '');
      setDescription(expense.description || '');
      setPaymentMethod(expense.payment_method || '');
      setTags(expense.tags || []);
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // convert amount to clean and then paresFloat it
    const cleanAmount = amount.toString().replace(/[$,]/g, '');
    const parsedAmount = parseFloat(cleanAmount);

    console.log('Parsed amount:', parsedAmount);

    try {
      console.log('Attempting to update expense:', expense.id);
      console.log('Sending data:', {
        date,
        amount,
        category,
        title,
        description,
        payment_method: paymentMethod,
        tags,
      });

      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          amount: parsedAmount,
          category,
          title,
          description,
          payment_method: paymentMethod,
          tags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update expense');
      }

      const data = await response.json();
      console.log('onUpdate data: ', data);

      onUpdate(data);
      setSuccess(true);
    } catch (err) {
      setError('Failed to update expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="subtitle">Edit your entry:</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Stack spacing={2} alignItems="center">
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
              onChange={(e) => setCategory(e.target.value)}
              required>
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
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
            required
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
            // prefix={currencySymbol}
            required
          />

          <TextField
            sx={{ width: '15rem' }}
            id="entry-description"
            label="Description"
            type="text"
            variant="standard"
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormControl sx={{ width: '15rem' }}>
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              id="entry-payment-method"
              value={paymentMethod}
              label="Payment Method"
              variant="standard"
              onChange={(e) => setPaymentMethod(e.target.value)}>
              {paymentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Autocomplete
            sx={{ width: '15rem' }}
            multiple
            id="entry-tags"
            options={tagOptions}
            freeSolo
            value={tags}
            onChange={(event, newValue) => {
              setTags(newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  color="primary"
                  variant="outlined"
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Tags" />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, width: '15rem' }}>
            {loading ? 'Updating...' : 'Update Expense'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Expense updated successfully!
            </Alert>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default EditForm;
