const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

try {
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your_supabase')) {
        supabase = createClient(supabaseUrl, supabaseKey);
    } else {
        console.warn('⚠️ Supabase credentials missing. API will only work in Demo Mode.');
    }
} catch (error) {
    console.error('❌ Supabase initialization failed:', error.message);
}

module.exports = supabase;
