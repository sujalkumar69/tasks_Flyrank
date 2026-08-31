require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your_supabase_anon_key';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase client initialized.');

module.exports = supabase;
