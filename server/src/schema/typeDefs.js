export const typeDefs = `#graphql
    type Expense {
      id: ID!
      date: String!
      amount: Float!
      category: String!
      title: String!
      description: String 
      payment_method: String
      tags: [String]
      user_id: String!
      created_at: String
    }

    type Query {
      expenses(user_id: String!): [Expense]
      expense(id: ID!): Expense
      filterExpenses(category: String, payment_method: String, tags: [String]): [Expense!]!
    }
  
    type Mutation {
      addExpense(
        date: String!,
        amount: Float!,
        category: String!,
        title: String!,
        description: String,
        payment_method: String,
        tags: [String],
        user_id: String!
      ): Expense
    }

    type Subscription {
      onExpenseAdded: Expense
    }
  `;
