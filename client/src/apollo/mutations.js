import { gql } from '@apollo/client';

export const EXPENSE_QUERY = gql`
  mutation CreateExpense(
    $date: String!
    $amount: Float!
    $category: String!
    $title: String!
  ) {
    createExpense(
      date: $date
      amount: $amount
      category: $category
      title: $title
    ) {
      id
      date
      amount
      category
      title
    }
  }
`;
