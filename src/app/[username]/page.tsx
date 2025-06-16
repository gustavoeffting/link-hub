import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type ProfilePageProps = {
  params: { username: string }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', params.username)
    .single()

  if (error || !profile) {
    notFound()
  }

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('position')

  const initials = profile.display_name
    ?.split(' ')
    .map((name: string) => name.charAt(0))
    .join('')
    .toUpperCase() || profile.username.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-bold text-gray-700">{initials}</span>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              {profile.display_name || profile.username}
            </h1>
            
            {profile.bio && (
              <p className="text-white/90 text-lg">
                {profile.bio}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {links && links.length > 0 ? (
              links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white rounded-lg p-4 text-center font-medium text-gray-900 hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {link.title}
                </a>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-white/80">No links available yet</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <p className="text-white/60 text-sm">
              <Link href="/signup" className="hover:text-white transition-colors">
                Create your own link page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('users')
    .select('display_name, bio, username')
    .eq('username', params.username)
    .single()

  if (!profile) {
    return {
      title: 'Profile Not Found'
    }
  }

  return {
    title: `${profile.display_name || profile.username} - Links`,
    description: profile.bio || `Check out ${profile.display_name || profile.username}'s links`,
  }
}