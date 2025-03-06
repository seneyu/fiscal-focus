import { gql } from '@apollo/client';

export const FILTER_EXPENSES = gql`
  query FilterExpenses(
    $category: String
    $payment_method: String
    $tags: [String]
  ) {
    filterExpenses(
      category: $category
      payment_method: $payment_method
      tags: $tags
    ) {
      id
      date
      amount
      category
      title
      description
      payment_method
      tags
      created_at
      user_id
    }
  }
`;
