import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Chip,
  Autocomplete,
} from '@mui/material';

const EntryForm = ({ currencySymbol = '$' }) => {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [tags, setTags] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categoryOptions = [
    { value: 'homeUtilities', label: 'Home & Utilities' },
    { value: 'travel', label: 'Travel' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'social', label: 'Social' },
    { value: 'rent', label: 'Rent' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'dining', label: 'Dining' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'gifts', label: 'Gifts' },
    { value: 'subscriptions', label: 'Subscriptions' },
    { value: 'other', label: 'Other' },
  ];

  const paymentOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'debit', label: 'Debit Card' },
    { value: 'bankTransfer', label: 'Bank Transfer' },
    { value: 'mobilePay', label: 'Mobile Payment' },
    { value: 'other', label: 'Other' },
  ];

  const tagOptions = [
    'essential',
    'discretionary',
    'recurring',
    'one-time',
    'work',
    'personal',
    'family',
    'emergency',
    'planned',
    'unplanned',
    'sale',
    'gift',
  ];

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('');
    setTitle('');
    setAmount('');
    setDescription('');
    setPaymentMethod('');
    setTags([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    const cleanAmount = amount.replace(/[^0-9.-]+/g, '');
    const parsedAmount = parseFloat(cleanAmount);

    try {
      console.log('User: ', user);
      const response = await fetch('/api/expenses', {
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
          tags: tags,
          user_id: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create expense');
      }

      console.log('New expense created: ', data);
      setSuccess(true);
      resetForm();
    } catch (err) {
      console.error('Submission failed: ', err);
      setError(err.message || 'Failed to create expense. Please try again.');
    } finally {
      setLoading(false);
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
            InputLabelProps={{ shrink: true }}
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
            prefix={currencySymbol}
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
              onChange={(e) => setPaymentMethod(e.target.value)}>
              {paymentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Autocomplete
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
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Add tags"
                helperText="Press enter after each tag"
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, width: '15rem' }}>
            {loading ? 'Adding...' : 'Add Expense'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Expense created successfully!
            </Alert>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default EntryForm;
