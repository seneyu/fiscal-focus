import supabase from '../config/supabase.js';

// resolvers define how to fetch the types defined in schema
const resolvers = {
  Query: {
    filterExpenses: async (_, { category, payment_method, tags }) => {
      try {
        console.log('GraphQL Filter Request:', {
          category,
          payment_method,
          tags,
        });

        let query = supabase.from('expenses').select('*');

        if (category) {
          console.log(`Filtering by category: "${category}"`);
          query = query.eq('category', category);
        }

        if (payment_method) {
          console.log(`Filtering by payment_method: "${payment_method}"`);
          query = query.ilike('payment_method', payment_method);
        }

        if (tags && tags.length > 0) {
          console.log(`Filtering by tags:`, tags);
          query = query.contains('tags', tags);
        }

        const { data, error } = await query.order('created_at', {
          ascending: false,
        });

        if (error) {
          console.error('Supabase error: ', error);
          throw new Error('Failed to filter expenses');
        }

        console.log(`Filter returned ${data ? data.length : 0} results`);
        console.log('data: ', data);
        return data;
      } catch (error) {
        console.error('Filter error: ', error);
        throw error;
      }
    },

    getBudgets: async (_, __, { user }) => {
      const { data } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);
      return data;
    },
  },

  Mutation: {
    createBudget: async (_, args, { user }) => {
      try {
        const { category, monthly_limit, start_date } = args;

        console.log('User ID:', user?.id);
        console.log('Inserting:', args);

        if (!user || !user.id) {
          throw new Error(
            'Authentication required. User not found in context.'
          );
        }

        const { data, error } = await supabase
          .from('budgets')
          .insert([{ category, monthly_limit, start_date, user_id: user.id }])
          .select('id, category, monthly_limit, start_date')
          .single();

        console.log('Supabase Response:', { data, error });

        if (error) throw new Error(`Supabase error: ${error.message}`);
        if (!data) throw new Error('No data returned from insertion.');

        return data;
      } catch (error) {
        console.error('Budget creation error: ', error);
        throw new Error(`Failed to create budget: ${error.message}`);
      }
    },
  },
};

export default resolvers;
