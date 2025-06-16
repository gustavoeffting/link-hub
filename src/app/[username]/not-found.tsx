export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Profile Not Found</h1>
        <p className="text-white/80 mb-8">This username doesn't exist.</p>
        <a 
          href="/"
          className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}