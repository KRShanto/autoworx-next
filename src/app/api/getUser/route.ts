
import { NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/getCurrentUser';

export async function GET() {
  try {
    const user = await getUserFromSession();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error();
  }
}
