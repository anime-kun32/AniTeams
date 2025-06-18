import { cookies } from 'next/headers';
import { db } from '@lib/firebaseAdmin';
import { NextResponse } from 'next/server';

// POST: Add a comment
export async function POST(req, { params }) {
  try {
    const { id: animeSlug } = params;
    const { searchParams } = new URL(req.url);
    const episodeId = searchParams.get('ep');

    const formattedId = animeSlug && episodeId ? `${animeSlug}?ep=${episodeId}` : animeSlug;

    const { text, parentId } = await req.json();
    const cookieStore = cookies();
    const uid = cookieStore.get('uid')?.value;

    if (!uid || !text) {
      return NextResponse.json({ error: 'Missing UID or text' }, { status: 400 });
    }

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { username, avatar: profilePic } = userDoc.data();

    const commentData = {
      uid,
      username,
      profilePic,
      text,
      likes: [],
      dislikes: [],
      timestamp: Date.now(),
    };

    const threadsRef = db.collection('comments').doc(formattedId).collection('threads');

    if (parentId) {
      await threadsRef.doc(parentId).collection('replies').add(commentData);
    } else {
      await threadsRef.add(commentData);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[COMMENT_POST_ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET: Fetch comments
export async function GET(req, { params }) {
  try {
    const { id: animeSlug } = params;
    const { searchParams } = new URL(req.url);
    const episodeId = searchParams.get('ep');

    const formattedId = animeSlug && episodeId ? `${animeSlug}?ep=${episodeId}` : animeSlug;

    const threadSnapshot = await db
      .collection('comments')
      .doc(formattedId)
      .collection('threads')
      .orderBy('timestamp', 'desc')
      .get();

    const threads = await Promise.all(
      threadSnapshot.docs.map(async (doc) => {
        const repliesSnapshot = await db
          .collection('comments')
          .doc(formattedId)
          .collection('threads')
          .doc(doc.id)
          .collection('replies')
          .orderBy('timestamp', 'asc')
          .get();

        return {
          id: doc.id,
          ...doc.data(),
          replies: repliesSnapshot.docs.map((replyDoc) => ({
            id: replyDoc.id,
            ...replyDoc.data(),
          })),
        };
      })
    );

    return NextResponse.json({ success: true, comments: threads }, { status: 200 });
  } catch (err) {
    console.error('[COMMENT_FETCH_ERROR]', err);
    return NextResponse.json({ success: false, comments: [] }, { status: 500 });
  }
}
