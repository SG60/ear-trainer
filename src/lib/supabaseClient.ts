import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://weajrtbsntmezicrvolh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYWpydGJzbnRtZXppY3J2b2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjA4MzE5NTcsImV4cCI6MTk3NjQwNzk1N30.qeCt7aUoFq4Uj3gGqggSLDq9Ab9RgWyhwCgfj_Ku56k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
