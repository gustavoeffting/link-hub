'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Link = {
  id: string
  title: string
  url: string
  position: number
  is_active: boolean
}

type LinkManagerProps = {
  initialLinks: Link[]
  userId: string
}

export default function LinkManager({ initialLinks, userId }: LinkManagerProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const supabase = createClient()

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newUrl) return

    setLoading(true)
    
    const { data, error } = await supabase
      .from('links')
      .insert([
        {
          user_id: userId,
          title: newTitle,
          url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
          position: links.length,
        }
      ])
      .select()
      .single()

    if (data && !error) {
      setLinks([...links, data])
      setNewTitle('')
      setNewUrl('')
    }
    
    setLoading(false)
  }

  const updateLink = async (id: string) => {
    if (!editTitle || !editUrl) return
  
    const { error } = await supabase
      .from('links')
      .update({ 
        title: editTitle, 
        url: editUrl.startsWith('http') ? editUrl : `https://${editUrl}` 
      })
      .eq('id', id)
  
    if (!error) {
      setLinks(links.map(link => 
        link.id === id ? { ...link, title: editTitle, url: editUrl } : link
      ))
      setEditingId(null)
      setEditTitle('')
      setEditUrl('')
    }
  }
  
  const startEdit = (link: Link) => {
    setEditingId(link.id)
    setEditTitle(link.title)
    setEditUrl(link.url)
  }
  
  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditUrl('')
  }

  const deleteLink = async (id: string) => {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id)

    if (!error) {
      setLinks(links.filter(link => link.id !== id))
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('links')
      .update({ is_active: !isActive })
      .eq('id', id)

    if (!error) {
      setLinks(links.map(link => 
        link.id === id ? { ...link, is_active: !isActive } : link
      ))
    }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null)
      return
    }

    const draggedIndex = links.findIndex(link => link.id === draggedItem)
    const targetIndex = links.findIndex(link => link.id === targetId)
    
    const newLinks = [...links]
    const [draggedLink] = newLinks.splice(draggedIndex, 1)
    newLinks.splice(targetIndex, 0, draggedLink)

    const updatedLinks = newLinks.map((link, index) => ({
      ...link,
      position: index
    }))

    setLinks(updatedLinks)
    setDraggedItem(null)

    const updates = updatedLinks.map(link => 
      supabase
        .from('links')
        .update({ position: link.position })
        .eq('id', link.id)
    )

    await Promise.all(updates)
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Your Links</h3>
      
      <form onSubmit={addLink} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Link title (e.g., My Website)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />
          <input
            type="url"
            placeholder="URL (e.g., https://example.com)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Adding...' : 'Add Link'}
        </button>
      </form>

      <div className="space-y-3">
        {links.length === 0 ? (
          <p className="text-gray-500">No links yet. Add your first link above!</p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              draggable={editingId !== link.id}
              onDragStart={(e) => handleDragStart(e, link.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, link.id)}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                editingId === link.id ? 'bg-blue-50 border-blue-200' : 
                link.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'
              } ${draggedItem === link.id ? 'opacity-50' : ''} ${editingId === link.id ? '' : 'cursor-move hover:shadow-md'} transition-shadow`}
            >
              <div className="flex items-center flex-1">
                {editingId !== link.id && (
                  <div className="mr-3 text-gray-400">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm2-6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                  </div>
                )}
                
                {editingId === link.id ? (
                  <div className="flex-1 space-y-2 m-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Link title"
                    />
                    <input
                      type="url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="URL"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <h4 className={`font-medium ${link.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                      {link.title}
                    </h4>
                    <p className={`text-sm ${link.is_active ? 'text-gray-600' : 'text-gray-400'}`}>
                      {link.url}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {editingId === link.id ? (
                  <>
                    <button
                      onClick={() => updateLink(link.id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(link)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(link.id, link.is_active)}
                      className={`px-3 py-1 text-sm rounded ${
                        link.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {link.is_active ? 'Active' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}