import supabase from '../config/supabase.js';
import { pubsub, EVENTS } from '../utils/subscriptions.js';

// resolvers define how to fetch the types defined in schema
const resolvers = {
  Query: {
    expenses: async (_, { user_id }) => {
      try {
        console.log('Fetching expenses for user: ', user_id);

        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user_id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error: ', error);
          throw new Error('Failed to fetch expenses');
        }

        console.log(`Found ${data ? data.length : 0} expenses`);
        return data;
      } catch (error) {
        console.error('Error fetching expenses: ', error);
        throw new Error('Failed to fetch expenses: ', error.message);
      }
    },
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
        throw new Error('Failed to filter expense: ', error.message);
      }
    },
  },
  Mutation: {
    addExpense: async (
      _,
      {
        date,
        amount,
        category,
        title,
        description,
        payment_method,
        tags,
        user_id,
      }
    ) => {
      try {
        console.log('Request body:', {
          date,
          amount,
          category,
          title,
          description,
          payment_method,
          tags,
          user_id,
        });

        const expenseData = {
          date,
          amount,
          category,
          title,
          user_id,
        };

        if (description) expenseData.description = description;
        if (payment_method) expenseData.payment_method = payment_method;
        if (tags && Array.isArray(tags)) expenseData.tags = tags;

        // insert expense data into database
        const { data, error } = await supabase
          .from('expenses')
          .insert([expenseData])
          .select()
          .single();

        if (error) {
          console.error('Supabase error: ', error);
          throw new Error('Failed to add expense');
        }

        console.log('Data Added: ', data);

        // publish the new expense to subscribers
        pubsub.publish(EVENTS.EXPENSE_ADDED, { onExpenseAdded: data });

        return data;
      } catch (error) {
        console.error('Add expense error: ', error);
        throw new Error('Failed to add expense: ', error.message);
      }
    },
  },
  Subscription: {
    onExpenseAdded: {
      subscribe: () => pubsub.asyncIterator([EVENTS.EXPENSE_ADDED]),
    },
  },
};

export default resolvers;
