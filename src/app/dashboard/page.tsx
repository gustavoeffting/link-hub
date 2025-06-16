import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth-actions'
import LinkManager from '@/components/LinkManager'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('position')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end h-16">
            <div className="flex items-center space-x-4">
              <a 
                href={`/${profile?.username}`}
                target="_blank"
                className="text-indigo-600 hover:text-indigo-500"
              >
                View Public Profile
              </a>
              <form action={signOut}>
                <button 
                  type="submit"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Profile</h2>
            <p className="text-gray-600">
              Your public page: <a href={`/${profile?.username}`} className="text-indigo-600" target="_blank">
                {typeof window !== 'undefined' ? window.location.origin : 'yoursite.com'}/{profile?.username}
              </a>
            </p>
          </div>

          <LinkManager initialLinks={links || []} userId={user.id} />
        </div>
      </main>
    </div>
  )
}