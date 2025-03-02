import supabase from '../config/supabase.js';

const expenseController = {};

expenseController.createExpense = async (req, res, next) => {
  try {
    const {
      date,
      amount,
      category,
      title,
      description,
      payment_method,
      tags,
      user_id,
    } = req.body;

    console.log('Request body: ', req.body);

    if (!date || !amount || !category || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // create expense object
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
      return res.status(500).json({ error: error.message });
    }

    res.locals.expense = data;
    return next();
  } catch (error) {
    console.error('Error in createExpense: ', error);
    return next(error);
  }
};

export default expenseController;
