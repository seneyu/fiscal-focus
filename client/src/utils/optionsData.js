export const categoryOptions = [
  { value: 'rent', label: 'Rent' },
  { value: 'home', label: 'Home' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'travel', label: 'Travel' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'social', label: 'Social' },
  { value: 'dining', label: 'Dining' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'gifts', label: 'Gifts' },
  { value: 'subscriptions', label: 'Subscriptions' },
  { value: 'other', label: 'Other' },
];

export const paymentOptions = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
  { value: 'bankTransfer', label: 'Bank Transfer' },
  { value: 'mobilePay', label: 'Mobile Payment' },
  { value: 'other', label: 'Other' },
];

export const tagOptions = [
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

// helper functions for mapping values to labels
export const getCategoryLabel = (categoryValue) => {
  const category = categoryOptions.find((cat) => cat.value === categoryValue);
  return category ? category.label : categoryValue;
};

export const getPaymentMethodLabel = (paymentValue) => {
  const payment = paymentOptions.find((pay) => pay.value === paymentValue);
  return payment ? payment.label : paymentValue;
};
