import { NextResponse } from 'next/server';
import { db } from '@lib/firebaseAdmin';

// PUT: To update or create resume data for the user
export async function PUT(req) {
  try {
    const { uid, animeId, time, anilistId, duration } = await req.json();

    if (!uid || !animeId || typeof time !== 'number' || !anilistId || typeof duration !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid fields (uid, animeId, time, anilistId, duration)' },
        { status: 400 }
      );
    }

    const userRef = db.collection('users').doc(uid);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: `User with UID ${uid} not found` },
        { status: 404 }
      );
    }

    const resumeRef = userRef.collection('resumes').doc(animeId);
    const resumeDoc = await resumeRef.get();

    const resumeData = { time, anilistId, duration };

    if (!resumeDoc.exists) {
      await resumeRef.set(resumeData);
    } else {
      await resumeRef.update(resumeData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating resume data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: To fetch specific resume data for a user
export async function POST(req) {
  try {
    const { uid, animeId } = await req.json();

    if (!uid || !animeId) {
      return NextResponse.json(
        { error: 'Missing fields (uid, animeId)' },
        { status: 400 }
      );
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: `User with UID ${uid} not found` },
        { status: 404 }
      );
    }

    const resumeRef = userRef.collection('resumes').doc(animeId);
    const resumeDoc = await resumeRef.get();

    if (!resumeDoc.exists) {
      return NextResponse.json({ time: 0, anilistId: '', duration: 0 });
    }

    const resumeData = resumeDoc.data();
    return NextResponse.json({
      time: resumeData?.time || 0,
      anilistId: resumeData?.anilistId || '',
      duration: resumeData?.duration || 0
    });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: To list all resume data for the user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'Missing UID parameter' },
        { status: 400 }
      );
    }

    const userRef = db.collection('users').doc(uid);
    const resumesRef = userRef.collection('resumes');

    const snapshot = await resumesRef.get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: 'No resume data found for this user' },
        { status: 404 }
      );
    }

    const resumes = snapshot.docs.map(doc => ({
      animeId: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: resumes });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: To delete specific resume data for a user
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');
    const animeId = searchParams.get('animeId');

    if (!uid || !animeId) {
      return NextResponse.json(
        { error: 'Missing parameters (uid, animeId)' },
        { status: 400 }
      );
    }

    const resumeRef = db.collection('users').doc(uid).collection('resumes').doc(animeId);
    const resumeDoc = await resumeRef.get();

    if (!resumeDoc.exists) {
      return NextResponse.json(
        { error: `No resume data found for animeId "${animeId}" under user "${uid}"` },
        { status: 404 }
      );
    }

    await resumeRef.delete();

    return NextResponse.json({ success: true, message: `Resume data for "${animeId}" deleted` });
  } catch (error) {
    console.error('Error deleting resume data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
