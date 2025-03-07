import { gql } from '@apollo/client';

export const EXPENSE_ADDED = gql`
  subscription onExpenseAdded {
    onExpenseAdded {
      id
      date
      amount
      category
      title
      description
      payment_method
      tags
      user_id
    }
  }
`;
