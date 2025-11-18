// Brand configurations used across the app
// How to add a new brand (future-proof):
// 1) Drop the logo image into `src/assets/brands/`.
// 2) Import it below (Vite will fingerprint + serve correctly in prod).
// 3) Add an entry with a unique `key`, display `name`, and imported `logo`.
// 4) The selector + preview will update automatically.
import aparLogo from '../assets/brands/apar-logo.png';
import finolexLogo from '../assets/brands/finolex-logo.png';
import gmLogo from '../assets/brands/gm-logo.png';
import goldmedalLogo from '../assets/brands/goldmedal-logo.png';
import havellsLogo from '../assets/brands/havells-logo.png';
import fybrosLogo from '../assets/brands/fybros-logo.png';
import polycabLogo from '../assets/brands/polycab-logo.png';
import vguardLogo from '../assets/brands/vguard-logo.png';

export const BRANDS = [
  { key: 'apar', name: 'APAR', logo: aparLogo },
  { key: 'finolex', name: 'FINOLEX', logo: finolexLogo },
  { key: 'gm', name: 'GM', logo: gmLogo },
  { key: 'goldmedal', name: 'GOLDMEDAL', logo: goldmedalLogo },
  { key: 'havels', name: 'HAVELS', logo: havellsLogo },
  { key: 'fybros', name: 'FYBROS', logo: fybrosLogo },
  { key: 'polycab', name: 'POLYCAB', logo: polycabLogo },
  { key: 'vguard', name: 'V-GUARD', logo: vguardLogo },
];
