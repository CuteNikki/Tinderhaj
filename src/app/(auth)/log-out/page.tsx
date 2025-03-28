import { LogOutButton } from '@/components/auth/logout-button';
import { getCurrentUser } from '@/lib/actions';

export default async function LogOutPage() {
  await getCurrentUser({ redirectIfNotFound: true });

  return <LogOutButton />;
}
