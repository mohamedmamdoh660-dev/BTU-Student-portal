require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.from('Document').insert({
        id: crypto.randomUUID(),
        fileName: 'test.pdf',
        fileType: 'application/pdf',
        fileUrl: 'https://example.com/test.pdf'
    });
    console.log(error);
}

test();
