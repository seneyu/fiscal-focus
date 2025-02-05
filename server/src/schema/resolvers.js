import supabase from '../config/supabase.js';

// resolvers define how to fetch the types defined in schema
const resolvers = {
  Query: {
    getExpenses: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error: ', error);
        throw new Error('Failed to fetch expenses');
      }

      return data;
    },
    getExpenseById: async (_, { id }) => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error: ', error);
        throw new Error('Failed to fetch expense');
      }

      return data;
    },
  },
  Mutation: {
    createExpense: async (_, { date, amount, category, title }) => {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .insert([{ date, amount, category, title }])
          .select()
          .single();

        if (error) {
          console.error('Supabase error: ', error);
          throw new Error(error.message);
        }
        return data;
      } catch (error) {
        console.error('Server error: ', error);
        throw new Error('Failed to create expense');
      }
    },
  },
};

export default resolvers;
