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
  },
};

export default resolvers;
