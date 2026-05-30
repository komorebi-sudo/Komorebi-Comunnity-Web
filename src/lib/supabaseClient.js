import { createClient } from '@supabase/supabase-js'

// Estas variables deberían venir de un archivo .env en un entorno de producción,
// pero por ahora las pondremos aquí para que puedas probar rápidamente.
// ¡IMPORTANTE! Reemplaza esto con tus verdaderas llaves de Supabase
const supabaseUrl = 'https://cgerbazevbfdxpnhvsft.supabase.co/rest/v1/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZXJiYXpldmJmZHhwbmh2c2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTQxNzcsImV4cCI6MjA5NTczMDE3N30.1ycBNwp_zgfWuhHv9A9gMk7GpLpNKjw-4ZkMnBgMMsU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)