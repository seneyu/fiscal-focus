const { Pool } = require('pg');

const supabase_pw = process.env.SUPABASE_PW;
const PG_URI = `postgresql://postgres:${supabase_pw}@db.dwsjlosdrdjuayqrbjeu.supabase.co:5432/postgres`;

const pool = new Pool({ connectionString: PG_URI });

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
