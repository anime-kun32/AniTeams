import { db } from '@lib/firebaseAdmin'
import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
  try {
    const { commentId, type } = await req.json()
    const { id } = params 
    const uid = req.cookies.get('uid')?.value
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['like', 'dislike'].includes(type)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 })
    }

    const commentRef = db.collection('comments').doc(id).collection('items').doc(commentId)
    const commentSnap = await commentRef.get()

    if (!commentSnap.exists) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    const comment = commentSnap.data()

    const likes = new Set(comment.likes || [])
    const dislikes = new Set(comment.dislikes || [])

    // Remove from both
    likes.delete(uid)
    dislikes.delete(uid)

    // Then add to selected
    if (type === 'like') likes.add(uid)
    else dislikes.add(uid)

    await commentRef.update({
      likes: Array.from(likes),
      dislikes: Array.from(dislikes),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[COMMENT_REACT_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Failed to update reaction' }, { status: 500 })
  }
}
