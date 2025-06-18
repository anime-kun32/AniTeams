import { NextResponse } from 'next/server';
import { db } from '@lib/firebaseAdmin';

// Utility: parse seriesId and episode from animeId string like "tower-of-god-866?ep=15024"
function parseAnimeId(fullId) {
  if (!fullId) return { seriesId: null, ep: null };

  const [seriesId, query] = fullId.split('?');
  if (!query) return { seriesId, ep: null };

  const params = new URLSearchParams(query);
  const ep = params.get('ep');
  return { seriesId, ep };
}

// PUT: Create or update resume data per anime series, storing the current episode inside
export async function PUT(req) {
  try {
    const { uid, animeId, time, anilistId, duration } = await req.json();

    if (!uid || !animeId || typeof time !== 'number' || !anilistId || typeof duration !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid fields (uid, animeId, time, anilistId, duration)' },
        { status: 400 }
      );
    }

    // Parse anime series ID and episode from animeId
    const { seriesId, ep } = parseAnimeId(animeId);

    if (!seriesId || !ep) {
      return NextResponse.json(
        { error: 'Invalid animeId format, missing episode info' },
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

    const resumeRef = userRef.collection('resumes').doc(seriesId);

    const resumeData = {
      time,
      anilistId,
      duration,
      episode: ep, // current episode number stored here
      lastUpdated: new Date().toISOString(),
    };

    await resumeRef.set(resumeData, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating resume data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Fetch resume data for an anime series
export async function POST(req) {
  try {
    const { uid, animeId } = await req.json();

    if (!uid || !animeId) {
      return NextResponse.json(
        { error: 'Missing fields (uid, animeId)' },
        { status: 400 }
      );
    }

    const { seriesId } = parseAnimeId(animeId);

    if (!seriesId) {
      return NextResponse.json(
        { error: 'Invalid animeId format' },
        { status: 400 }
      );
    }

    const userRef = db.collection('users').doc(uid);
    const resumeRef = userRef.collection('resumes').doc(seriesId);

    const resumeDoc = await resumeRef.get();

    if (!resumeDoc.exists) {
      return NextResponse.json({ time: 0, anilistId: '', duration: 0, episode: null });
    }

    const resumeData = resumeDoc.data();

    return NextResponse.json({
      time: resumeData?.time || 0,
      anilistId: resumeData?.anilistId || '',
      duration: resumeData?.duration || 0,
      episode: resumeData?.episode || null,
    });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: List all resume data for a user (per series)
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

// DELETE: Delete resume data for a given anime series
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

    const { seriesId } = parseAnimeId(animeId);

    if (!seriesId) {
      return NextResponse.json(
        { error: 'Invalid animeId format' },
        { status: 400 }
      );
    }

    const resumeRef = db.collection('users').doc(uid).collection('resumes').doc(seriesId);
    const resumeDoc = await resumeRef.get();

    if (!resumeDoc.exists) {
      return NextResponse.json(
        { error: `No resume data found for animeId "${seriesId}" under user "${uid}"` },
        { status: 404 }
      );
    }

    await resumeRef.delete();

    return NextResponse.json({ success: true, message: `Resume data for "${seriesId}" deleted` });
  } catch (error) {
    console.error('Error deleting resume data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
