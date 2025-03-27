
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import * as crypto from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Get the request body
    const { telegramUser } = await req.json() as { telegramUser: TelegramUser }
    
    if (!telegramUser) {
      return new Response(
        JSON.stringify({ error: 'No Telegram user data provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Verify Telegram data
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    if (!botToken) {
      return new Response(
        JSON.stringify({ error: 'Bot token not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Check if the auth_date is not too old (within 1 day)
    const authDate = telegramUser.auth_date;
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      return new Response(
        JSON.stringify({ error: 'Authentication data is too old' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Verify hash
    const hash = telegramUser.hash;
    delete telegramUser.hash;
    
    // Create data check string
    const dataCheckArr = Object.entries(telegramUser)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`);
    
    const dataCheckString = dataCheckArr.join('\n');
    
    // Create secret key
    const secretKey = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(botToken)
    );
    
    // Create HMAC
    const hmacKey = await crypto.subtle.importKey(
      "raw",
      secretKey,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = await crypto.subtle.sign(
      "HMAC",
      hmacKey,
      new TextEncoder().encode(dataCheckString)
    );
    
    // Convert signature to hex
    const hashArr = Array.from(new Uint8Array(signature));
    const calculatedHash = hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (calculatedHash !== hash) {
      return new Response(
        JSON.stringify({ error: 'Data verification failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Get user by Telegram ID or create new user
    const { data: existingUser, error: queryError } = await supabaseAdmin
      .from('users')
      .select('auth_id')
      .eq('telegram_id', telegramUser.id)
      .single();

    let userId;

    if (existingUser?.auth_id) {
      userId = existingUser.auth_id;
    } else {
      // Create a new user in auth.users
      const { data: { user }, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: `telegram_${telegramUser.id}@example.com`,
        password: crypto.randomUUID(),
        email_confirm: true,
        user_metadata: {
          telegram_id: telegramUser.id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          username: telegramUser.username,
          avatar_url: telegramUser.photo_url,
          provider: 'telegram'
        }
      });

      if (createUserError) {
        throw createUserError;
      }

      userId = user?.id;

      // Store Telegram user info in your users table
      await supabaseAdmin.from('users').insert({
        auth_id: userId,
        telegram_id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name || null,
        username: telegramUser.username || null,
        avatar_url: telegramUser.photo_url || null
      });
    }

    // Generate a session for the user
    const { data: { session }, error: sessionError } = await supabaseAdmin.auth.admin.createSession({
      user_id: userId as string,
      expires_in: 604800  // 7 days
    });

    if (sessionError) {
      throw sessionError;
    }

    return new Response(
      JSON.stringify({ session }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
