const { Pool } = require('pg');
require('dotenv').config();

const supabase_pw = process.env.SUPABASE_PW;
const PG_URI = `postgresql://postgres.dwsjlosdrdjuayqrbjeu:${supabase_pw}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

const pool = new Pool({ connectionString: PG_URI });

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
