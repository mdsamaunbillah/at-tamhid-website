// lib/supabaseClient.js
// এই ফাইল তোর Next.js প্রজেক্টের lib/ ফোল্ডারে বসাবি।
// এটাই Supabase-এর সাথে পুরো অ্যাপের একমাত্র "সংযোগ পয়েন্ট"।

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lbommemjhxdxwbyvmfkm.supabase.co";
const supabaseKey = "sb_publishable_2F6jq_rbIE0FVg0CP6rAtg_BWO3Twhn";

export const supabase = createClient(supabaseUrl, supabaseKey);
