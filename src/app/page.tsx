import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Your links in one place!
          </h1>
          
          <div className="flex justify-center gap-2 flex-wrap">
            <Link 
              href="/signup"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
            >
              Create an account
            </Link>
            <Link 
              href="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors inline-block"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-20">
            <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-2xl">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">GE</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gustavo Effting</h3>
              <p className="text-gray-600 mb-6">Frontend Developer</p>
              
              <div className="space-y-3">
                <div className="bg-gray-100 rounded-lg p-3 text-gray-700 font-medium">
                  📱 My Instagram
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-gray-700 font-medium">
                  🐦 Follow me on Twitter
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-gray-700 font-medium">
                  💼 My Portfolio
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}