'use client'

import { useEffect, useState } from 'react'

type Post = {
  id: number,
  title: string,
  content: string
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  
  
  const fetchPosts = () => {
    fetch('http://localhost:3001/api/v1/posts')
    .then(res => res.json())
    .then(data => setPosts(data))
    .catch(err => console.error(err))
  }
  
  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('http://localhost:3001/api/v1/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ post: {title, content} }),
      })
      setTitle('')
      setContent('')
      fetchPosts()
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdate = async (id: number) => {

    try {
      const res = await fetch(`http://localhost:3001/api/v1/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ post: {title: editTitle, content: editContent} }),
      })

      if (!res.ok) {
        console.error('Failed to update')
        return 
      }
      setPosts(posts.map(post =>
        post.id === id ? { ...post, title: editTitle, content: editContent} : post
      ))
      setEditingId(null)
    } catch (err) {
      console.error('Failed to update post: ', err)
    }

  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/api/v1/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json'},
      })
      setPosts(posts.filter(post => post.id !== id))
    } catch (err) {
      console.error("Failed to delete post: ", err);
    }

  }

  return (
    <main className='max-w-3xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-6'>掲示板</h1>
      <form onSubmit={handleSubmit} className='bg-white shadow-md rounded-lg p-6 mb-8'>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="内容"
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            投稿
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">投稿一覧</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white shadow rounded-lg p-4 border border-gray-200 space-y-2">
            { editingId === post.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2"
                />
                <button
                  onClick={() => handleUpdate(post.id)}
                  className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mr-2"
                >
                  保存
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  キャンセル
                </button>
              </>
            ) : (
              <>
                <h3>タイトル: {post.title}</h3>
                <p>内容: {post.content}</p>
                <button
                  type="button"
                  className="bg-green-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
                  onClick={() => {
                    setEditingId(post.id)
                    setEditTitle(post.title)
                    setEditContent(post.content)
                  }
                  }
                >
                  編集
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
                  onClick={() => handleDelete(post.id)}
                >
                  削除
                </button>
              </>
          )}
          </div>
        ))}        
      </div>
    </main>
  )
}
