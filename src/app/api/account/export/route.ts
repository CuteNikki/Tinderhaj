import { NextResponse, type NextRequest } from 'next/server';

import { auth } from '@/lib/auth';
import { buildDataExport } from '@/lib/data-export';

/**
 * A copy of everything kept about the signed-in account, as a JSON file to
 * save (see buildDataExport). Only ever their own.
 */
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new NextResponse(null, { status: 401 });

  const data = await buildDataExport(session.user.id);
  const day = new Date().toISOString().slice(0, 10);
  // Only letters, digits, - and _ in a file name, whatever the username
  const name = session.user.name.replace(/[^\w-]/g, '-');
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="tinderhaj-${name}-${day}.json"`,
      // Personal: never kept by a cache on the way
      'Cache-Control': 'private, no-store',
    },
  });
}
