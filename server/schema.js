const expenses = [
  {
    id: '1',
    date: '02/02/2025',
    amount: '5.50',
    category: 'Food',
    title: 'Donut',
  },
  {
    id: '2',
    date: '01/09/2025',
    amount: '2000.00',
    category: 'Rent',
    title: 'Pay rent',
  },
  {
    id: '3',
    date: '12/04/2024',
    amount: '45.50',
    category: 'Utilities',
    title: 'Gas',
  },
];

const typeDefs = `
    type Query {
      getExpense: [Expense]
      getExpenseById(id: ID!): Expense
    }
    
    type Mutation {
      createExpense(date: String!, amount: Float!, category: String!, title: String!): Expense
    }
  
    type Expense {
      id: ID!
      date: String!
      amount: Float!
      category: String!
      title: String!
    }
  `;

// resolvers define how to fetch the types defined in schema
const resolvers = {
  Query: {
    getExpense: () => {
      return expenses;
    },
    getExpenseById: (parent, args) => {
      const id = args.id;
      return expenses.find((expense) => expense.id === id);
    },
  },
  Mutation: {
    createExpense: (parent, args) => {
      const { date, amount, category, title } = args;
      const newExpense = {
        id: (expenses.length + 1).toString(),
        date,
        amount,
        category,
        title,
      };
      expenses.push(newExpense);
    },
  },
};

export { typeDefs, resolvers };
