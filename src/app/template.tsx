import { Replay } from '@/components/common/replay';

/** Around every page: its opening animations play again when you come back to it. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <Replay>{children}</Replay>;
}
