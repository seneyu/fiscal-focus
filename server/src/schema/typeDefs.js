export const typeDefs = `#graphql
    type Query {
      filterExpenses(category: String, payment_method: String, tags: [String]): [Expense!]!
      getBudgets: [Budget!]!
      getBudgetProgress(startDate: String, endDate: String): [BudgetProgress!]!
    }
  
    type Mutation {
      createBudget (
        category: String!
        monthly_limit: Float!
        start_date: String!
      ): Budget!
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

    type Budget {
      id: ID!
      user_id: String!
      category: String!
      monthly_limit: Float!
      start_date: String!
      end_date: String
      created_at: String
    }

    type BudgetProgress {
      category: String!
      monthly_limit: Float!
      current_spending: Float!
      remaining: Float!
    }
  `;
