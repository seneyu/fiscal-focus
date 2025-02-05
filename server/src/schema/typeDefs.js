export const typeDefs = `#graphql
    type Query {
      getExpenses: [Expense!]!
      getExpenseById(id: ID!): Expense
    }
    
    type Mutation {
      createExpense(
        date: String!
        amount: Float!
        category: String!
        title: String!
      ): Expense
    }
  
    type Expense {
      id: ID!
      date: String!
      amount: Float!
      category: String!
      title: String!
      created_at: String
    }
  `;
