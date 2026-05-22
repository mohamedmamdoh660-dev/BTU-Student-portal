const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDocs() {
  const { data: students } = await supabase.from('Student').select('id, documents, email').limit(5);
  console.log("Students JSON docs:", JSON.stringify(students, null, 2));

  const { data: docs } = await supabase.from('Document').select('*').limit(5);
  console.log("Document table rows:", JSON.stringify(docs, null, 2));
}

checkDocs();
