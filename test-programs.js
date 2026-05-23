require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const tables = ['Degree', 'Faculty', 'Language', 'City', 'Country'];
  for (const table of tables) {
    const { data } = await supabase.from(table).select('*').limit(1);
    console.log(`\nTable: ${table}`);
    if (data && data.length) {
      console.log(Object.keys(data[0]));
      if (data[0].translations) {
        console.log('Translations field exists:', data[0].translations);
      } else {
        const trKeys = Object.keys(data[0]).filter(k => k.includes('Ar') || k.includes('Tr') || k.includes('Ru') || k.includes('Fr'));
        if (trKeys.length) console.log('Possible translation fields:', trKeys);
      }
    }
  }
}

test();
