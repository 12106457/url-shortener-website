// app/api/shorten/route.ts
import { connectToDatabase } from '@/app/lib/mongodb';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { UrlSchema } from '@/app/model/url';

const Url = mongoose.models.Url || mongoose.model('Url', UrlSchema);

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { originalUrl } = await req.json();

    if (typeof originalUrl !== 'string' || !originalUrl.trim()) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const newUrl = await Url.create({ originalUrl });

    const origin = req.headers.get('origin') || `${process.env.BASE_URL}`; 

    return NextResponse.json({
       shortUrl: `${origin}/${newUrl._id}`,
    });

  } catch (error) {
    console.error('Error shortening URL:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
