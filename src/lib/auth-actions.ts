'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(email: string, password: string, username: string, displayName: string) {
  const supabase = await createClient()

  const { data: existingUser } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    return { error: 'Username already taken' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          username,
          display_name: displayName,
        }
      ])

    if (profileError) {
      return { error: 'Failed to create profile' }
    }
  }

  redirect('/dashboard')
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}