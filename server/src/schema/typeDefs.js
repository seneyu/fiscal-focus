export const typeDefs = `#graphql
    type Query {
      filterExpenses(category: String, payment_method: String, tags: [String]): [Expense!]!
    }
  
    type Expense {
      id: ID!
      date: String!
      amount: Float!
      category: String!
      title: String!
      description: String
      payment_method: String
      tags: [String]
      created_at: String
      user_id: String
    }
  `;
