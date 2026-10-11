/**
 * The sharks drawn on the site, imported rather than linked from /public, so
 * each is served at an address with a hash of what's in it: browsers keep
 * them for good, and a changed picture gets a new address of its own. The
 * files stay in /public too, for what reads them from disk (the shared
 * pictures, see lib/og.tsx) or links to them from elsewhere.
 */
import blahajFloat from '../../public/blahaj-float.webp';
import blahajHeart from '../../public/blahajHeart.webp';
import blahajHug from '../../public/blahajHug.webp';
import blahajSmall from '../../public/blahajSmall.webp';
import blahajSpinSmall from '../../public/blahajSpinSmall.gif';
import blahajThink from '../../public/blahajThink.webp';

export const SHARKS = {
  float: blahajFloat,
  heart: blahajHeart,
  hug: blahajHug,
  small: blahajSmall,
  spinSmall: blahajSpinSmall,
  think: blahajThink,
};
