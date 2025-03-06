import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  Container,
  Stack,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  TextField,
  Chip,
  Button,
  Alert,
  Paper,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  categoryOptions,
  paymentOptions,
  tagOptions,
} from '../utils/optionsData';
import { FILTER_EXPENSES } from '../apollo/queries';

const Item = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: 4,
  ...(theme.applyStyles('dark', {
    backgroundColor: '#262B32',
  }) || {}),
}));

const CustomSummary = () => {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [filterTags, setFilterTags] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // graphql query
  const [executeFilter, { loading: queryLoading, data }] = useLazyQuery(
    FILTER_EXPENSES,
    {
      onError: (error) => {
        console.error('Error filtering expenses with GraphQL: ', error);
        setError(`Filter error: ${error.message}`);
        setLoading(false);
        setSuccess(false);
      },
      fetchPolicy: 'network-only',
    }
  );

  const filteredExpenses = data?.filterExpenses || [];

  useEffect(() => {
    if (data) {
      setLoading(false);
      setSuccess(true);
    }
  }, [data]);

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handlePaymentChange = (event) => {
    setFilterPayment(event.target.value);
  };

  const handleTagsChange = (event, newValue) => {
    setFilterTags(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const variables = {};
    if (filterCategory) variables.category = filterCategory;
    if (filterPayment) variables.payment_method = filterPayment;
    if (filterTags.length > 0) variables.tags = filterTags;

    console.log('Filter variables:', variables);

    try {
      // execute graphql query
      executeFilter({ variables });
    } catch (error) {
      console.error('Error executing filter: ', error);
      setError(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create your own summary with filters:
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
        component="form"
        onSubmit={handleSubmit}>
        <Item>
          <Box sx={{ minWidth: 180 }}>
            <FormControl fullWidth>
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={filterCategory}
                label="Category"
                onChange={handleCategoryChange}>
                <MenuItem value="">All Categories</MenuItem>
                {categoryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Item>
        <Item>
          <Box sx={{ minWidth: 180 }}>
            <FormControl fullWidth>
              <InputLabel id="payment-filter-label">Payment Method</InputLabel>
              <Select
                labelId="payment-filter-label"
                id="payment-filter"
                value={filterPayment}
                label="Payment Method"
                onChange={handlePaymentChange}>
                <MenuItem value="">All Payment Methods</MenuItem>
                {paymentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Item>
        <Item>
          <Box sx={{ minWidth: 180 }}>
            <Autocomplete
              multiple
              id="filter-tags"
              options={tagOptions}
              freeSolo
              value={filterTags}
              onChange={handleTagsChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
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
                  placeholder="Select Tags"
                />
              )}
            />
          </Box>
        </Item>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || queryLoading}
          sx={{ mt: 0, width: '8rem' }}>
          {loading || queryLoading ? 'Filtering...' : 'Search'}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && filteredExpenses && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Found {filteredExpenses.length} expenses matching your criteria
        </Alert>
      )}

      {/* Display filtered results */}
      {filteredExpenses.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filtered Expenses
          </Typography>
          <List>
            {filteredExpenses.map((expense) => (
              <React.Fragment key={expense.id}>
                <ListItem>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body1" component="div">
                      {expense.title}
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" component="div">
                        ${expense.amount.toFixed(2)} - {expense.category}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" component="div">
                        {expense.date}{' '}
                        {expense.payment_method &&
                          `- ${expense.payment_method}`}
                      </Typography>
                    </Box>

                    {expense.tags && expense.tags.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {expense.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default CustomSummary;
