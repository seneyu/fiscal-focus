import { gql } from '@apollo/client';

export const CREATE_EXPENSE = gql`
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
