import Discord from 'next-auth/providers/discord';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import type { NextAuthConfig } from 'next-auth';

export default { providers: [Discord, GitHub, Google] } satisfies NextAuthConfig;
