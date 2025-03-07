import { gql } from '@apollo/client';

// export const EXPENSE_QUERY = gql`
//   mutation CreateExpense(
//     $date: String!
//     $amount: Float!
//     $category: String!
//     $title: String!
//   ) {
//     createExpense(
//       date: $date
//       amount: $amount
//       category: $category
//       title: $title
//     ) {
//       id
//       date
//       amount
//       category
//       title
//     }
//   }
// `;

export const EXPENSE_ADDED = gql`
  mutation AddExpense(
    $date: String!
    $amount: Float!
    $category: String!
    $title: String!
    $description: String
    $payment_method: String
    $tags: [String]
    $user_id: String!
  ) {
    addExpense(
      date: $date
      amount: $amount
      category: $category
      title: $title
      description: $description
      payment_method: $payment_method
      tags: $tags
      user_id: $user_id
    ) {
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
