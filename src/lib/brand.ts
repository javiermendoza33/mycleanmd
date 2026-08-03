/**
 * Single source of truth for brand name and colours.
 *
 * This exists because the brand has already changed twice (XeebiHealth →
 * MyCleanMD, with The Labo Method coming) and each rename meant hunting the
 * name across a dozen files. That is exactly how production ended up saying
 * MyCleanMD while the code still said XeebiHealth. Rename here, not in pages.
 *
 * The wordmark renders as three parts — a small uppercase prefix above an
 * italic word joined to a bold word: "MY" over "CleanMD".
 */
export const BRAND = {
  /** Full name, for metadata, legal lines and prose */
  name: 'MyCleanMD',
  /** Small uppercase line above the wordmark */
  prefix: 'My',
  /** Italic, teal half of the wordmark */
  nameItalic: 'Clean',
  /** Bold, ink half of the wordmark */
  nameBold: 'MD',
  tagline: 'Medical weight loss with GLP-1 prescriptions, delivered to your door.',
  title: 'MyCleanMD — Telehealth Portal',
  domain: 'mycleanmd.com',
} as const

/** Palette, lifted from the production build so nothing shifts visually. */
export const C = {
  ink: '#1C2D26',      // headings, body text
  teal: '#7ECFCF',     // brand accent
  paper: '#F4F7F5',    // page + alternating section background
  line: '#E2ECE7',     // borders and rules
  muted: '#7A9386',    // secondary text
  white: '#FFFFFF',
} as const

/** The gold CTA gradient, exactly as production renders it. */
export const GOLD = {
  backgroundImage:
    'linear-gradient(175deg, #FFFBE8 0%, #EEC040 18%, #A87800 50%, #EEC040 82%, #FFFBE8 100%)',
  color: '#3A1A00',
  border: '1px solid rgba(255,238,120,0.6)',
  boxShadow:
    '0 15px 35px rgba(120,80,0,0.36), 0 4px 11px rgba(120,80,0,0.26), inset 0 1px 0 rgba(255,252,220,0.9), inset 0 -1px 0 rgba(80,40,0,0.3)',
} as const
