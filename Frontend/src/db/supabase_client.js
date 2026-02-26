// Frontend/src/db/supabase_client.js
import { createClient } from '@supabase/supabase-js';

// Use the same credentials as your Backend .env
const supabaseUrl = 'https://jtkqxmjyrhlelnnibqom.supabase.co';
const supabaseKey = 'sb_publishable_i5UbCCAGqhiwDzpsioh22w_W76mnH8r';

export const supabase = createClient(supabaseUrl, supabaseKey);