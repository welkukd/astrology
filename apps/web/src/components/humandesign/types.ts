/**
 * Human Design Types - Frontend types mirroring backend schemas
 */

export type HDType =
  | 'Manifestor'
  | 'Generator'
  | 'Manifesting Generator'
  | 'Projector'
  | 'Reflector';

export type HDAuthority =
  | 'Emotional'
  | 'Sacral'
  | 'Splenic'
  | 'Ego'
  | 'Self-Projected'
  | 'Mental'
  | 'Lunar';

export type DefinitionType =
  | 'Single'
  | 'Split'
  | 'Triple Split'
  | 'Quadruple Split'
  | 'No Definition';

export type CenterType =
  | 'Head'
  | 'Ajna'
  | 'Throat'
  | 'G Center'
  | 'Heart/Ego'
  | 'Solar Plexus'
  | 'Spleen'
  | 'Sacral'
  | 'Root';

export type CenterStatus = 'defined' | 'undefined' | 'open';

export type VariableArrow = 'left' | 'right';

export interface HDCenter {
  id: CenterType;
  name: string;
  status: CenterStatus;
  defined: boolean;
  gates: number[];
  description?: string;
  theme?: string;
  shadow?: string;
}

export interface HDChannel {
  id: string; // e.g., "1-8", "34-20"
  name: string;
  gate_start: number;
  gate_end: number;
  center_start: CenterType;
  center_end: CenterType;
  defined: boolean;
  description?: string;
  theme?: string;
  shadow?: string;
  circuit?: string; // Individual, Tribal, Collective
}

export interface HDGate {
  number: number;
  name: string;
  center: CenterType;
  line: number; // 1-6
  color: number; // 1-6
  tone: number; // 1-6
  base: number; // 1-5
  defined: boolean;
  conscious: boolean; // Personality (black) vs Design (red)
  description?: string;
  keynotes: string[];
  harmonic_gate?: number;
}

export interface HDVariable {
  name: string; // "PHS", "Environment", "Perspective", "Motivation"
  arrow: VariableArrow;
  color: number;
  tone: number;
  base: number;
  description?: string;
}

export interface HDIncarnationCross {
  name: string;
  conscious_sun_gate: number;
  conscious_earth_gate: number;
  unconscious_sun_gate: number;
  unconscious_earth_gate: number;
  quarter: string;
  theme?: string;
}

export interface HDProfileLine {
  line: number;
  name: string;
  description?: string;
  keynotes: string[];
}

export interface HDProfile {
  profile: string; // e.g., "1/3", "2/4"
  conscious_line: HDProfileLine;
  unconscious_line: HDProfileLine;
  description?: string;
}

export interface HDBodygraphData {
  centers: HDCenter[];
  channels: HDChannel[];
  gates: HDGate[];
  variables: HDVariable[];
  profile?: HDProfile;
  incarnation_cross?: HDIncarnationCross;
  definition_type?: DefinitionType;
}

export interface HDChartData {
  id: string;
  user_id: string;
  subject_name: string;
  birth_datetime_utc: string;
  birth_latitude: number;
  birth_longitude: number;
  birth_timezone: string;
  time_unknown: boolean;
  hd_type: HDType;
  authority: HDAuthority;
  profile: string;
  strategy: string;
  signature: string;
  not_self_theme: string;
  bodygraph_data: HDBodygraphData;
  definition_type?: DefinitionType;
  incarnation_cross?: string;
  created_at: string;
  updated_at: string;
}

// SVG Bodygraph coordinate types
export interface BodygraphCenterPosition {
  center: CenterType;
  x: number;
  y: number;
  radius: number;
}

export interface BodygraphChannelPath {
  channelId: string;
  path: string; // SVG path data
  gateStart: number;
  gateEnd: number;
  defined: boolean;
}

// Bodygraph layout constants - standard Human Design bodygraph coordinates
export const BODYGRAPH_CENTER_POSITIONS: Record<CenterType, BodygraphCenterPosition> = {
  Head: { center: 'Head', x: 500, y: 120, radius: 60 },
  Ajna: { center: 'Ajna', x: 500, y: 260, radius: 55 },
  Throat: { center: 'Throat', x: 500, y: 400, radius: 50 },
  'G Center': { center: 'G Center', x: 500, y: 540, radius: 65 },
  'Heart/Ego': { center: 'Heart/Ego', x: 300, y: 400, radius: 55 },
  'Solar Plexus': { center: 'Solar Plexus', x: 700, y: 400, radius: 55 },
  Spleen: { center: 'Spleen', x: 300, y: 540, radius: 55 },
  Sacral: { center: 'Sacral', x: 500, y: 680, radius: 60 },
  Root: { center: 'Root', x: 500, y: 820, radius: 55 },
};

// Channel connections (center pairs)
export const CHANNEL_CONNECTIONS: Array<{
  id: string;
  gateStart: number;
  gateEnd: number;
  centerStart: CenterType;
  centerEnd: CenterType;
}> = [
  { id: '1-8', gateStart: 1, gateEnd: 8, centerStart: 'Ajna', centerEnd: 'Throat' },
  { id: '2-14', gateStart: 2, gateEnd: 14, centerStart: 'G Center', centerEnd: 'Sacral' },
  { id: '3-60', gateStart: 3, gateEnd: 60, centerStart: 'Sacral', centerEnd: 'Root' },
  { id: '4-63', gateStart: 4, gateEnd: 63, centerStart: 'Ajna', centerEnd: 'Head' },
  { id: '5-15', gateStart: 5, gateEnd: 15, centerStart: 'Sacral', centerEnd: 'G Center' },
  { id: '6-59', gateStart: 6, gateEnd: 59, centerStart: 'Solar Plexus', centerEnd: 'Sacral' },
  { id: '7-31', gateStart: 7, gateEnd: 31, centerStart: 'G Center', centerEnd: 'Throat' },
  { id: '8-1', gateStart: 8, gateEnd: 1, centerStart: 'Throat', centerEnd: 'Ajna' },
  { id: '9-52', gateStart: 9, gateEnd: 52, centerStart: 'Sacral', centerEnd: 'Root' },
  { id: '10-20', gateStart: 10, gateEnd: 20, centerStart: 'G Center', centerEnd: 'Throat' },
  { id: '10-57', gateStart: 10, gateEnd: 57, centerStart: 'G Center', centerEnd: 'Spleen' },
  { id: '11-56', gateStart: 11, gateEnd: 56, centerStart: 'Ajna', centerEnd: 'Throat' },
  { id: '12-22', gateStart: 12, gateEnd: 22, centerStart: 'Throat', centerEnd: 'Solar Plexus' },
  { id: '13-33', gateStart: 13, gateEnd: 33, centerStart: 'G Center', centerEnd: 'Throat' },
  { id: '14-2', gateStart: 14, gateEnd: 2, centerStart: 'Sacral', centerEnd: 'G Center' },
  { id: '15-5', gateStart: 15, gateEnd: 5, centerStart: 'G Center', centerEnd: 'Sacral' },
  { id: '16-48', gateStart: 16, gateEnd: 48, centerStart: 'Throat', centerEnd: 'Spleen' },
  { id: '17-62', gateStart: 17, gateEnd: 62, centerStart: 'Ajna', centerEnd: 'Throat' },
  { id: '18-58', gateStart: 18, gateEnd: 58, centerStart: 'Spleen', centerEnd: 'Root' },
  { id: '19-49', gateStart: 19, gateEnd: 49, centerStart: 'Root', centerEnd: 'Solar Plexus' },
  { id: '20-10', gateStart: 20, gateEnd: 10, centerStart: 'Throat', centerEnd: 'G Center' },
  { id: '20-34', gateStart: 20, gateEnd: 34, centerStart: 'Throat', centerEnd: 'Sacral' },
  { id: '21-45', gateStart: 21, gateEnd: 45, centerStart: 'Heart/Ego', centerEnd: 'Throat' },
  { id: '22-12', gateStart: 22, gateEnd: 12, centerStart: 'Solar Plexus', centerEnd: 'Throat' },
  { id: '23-43', gateStart: 23, gateEnd: 43, centerStart: 'Ajna', centerEnd: 'Throat' },
  { id: '24-61', gateStart: 24, gateEnd: 61, centerStart: 'Ajna', centerEnd: 'Head' },
  { id: '25-51', gateStart: 25, gateEnd: 51, centerStart: 'G Center', centerEnd: 'Heart/Ego' },
  { id: '26-44', gateStart: 26, gateEnd: 44, centerStart: 'Heart/Ego', centerEnd: 'Spleen' },
  { id: '27-50', gateStart: 27, gateEnd: 50, centerStart: 'Sacral', centerEnd: 'Spleen' },
  { id: '28-38', gateStart: 28, gateEnd: 38, centerStart: 'Spleen', centerEnd: 'Root' },
  { id: '29-46', gateStart: 29, gateEnd: 46, centerStart: 'Sacral', centerEnd: 'G Center' },
  { id: '30-41', gateStart: 30, gateEnd: 41, centerStart: 'Solar Plexus', centerEnd: 'Root' },
  { id: '31-7', gateStart: 31, gateEnd: 7, centerStart: 'Throat', centerEnd: 'G Center' },
  { id: '32-54', gateStart: 32, gateEnd: 54, centerStart: 'Spleen', centerEnd: 'Root' },
  { id: '33-13', gateStart: 33, gateEnd: 13, centerStart: 'Throat', centerEnd: 'G Center' },
  { id: '34-20', gateStart: 34, gateEnd: 20, centerStart: 'Sacral', centerEnd: 'Throat' },
  { id: '34-57', gateStart: 34, gateEnd: 57, centerStart: 'Sacral', centerEnd: 'Spleen' },
  { id: '35-36', gateStart: 35, gateEnd: 36, centerStart: 'Throat', centerEnd: 'Solar Plexus' },
  { id: '36-35', gateStart: 36, gateEnd: 35, centerStart: 'Solar Plexus', centerEnd: 'Throat' },
  { id: '37-40', gateStart: 37, gateEnd: 40, centerStart: 'Solar Plexus', centerEnd: 'Heart/Ego' },
  { id: '38-28', gateStart: 38, gateEnd: 28, centerStart: 'Root', centerEnd: 'Spleen' },
  { id: '39-55', gateStart: 39, gateEnd: 55, centerStart: 'Root', centerEnd: 'Solar Plexus' },
  { id: '40-37', gateStart: 40, gateEnd: 37, centerStart: 'Heart/Ego', centerEnd: 'Solar Plexus' },
  { id: '41-30', gateStart: 41, gateEnd: 30, centerStart: 'Root', centerEnd: 'Solar Plexus' },
  { id: '42-53', gateStart: 42, gateEnd: 53, centerStart: 'Root', centerEnd: 'Sacral' },
  { id: '43-23', gateStart: 43, gateEnd: 23, centerStart: 'Throat', centerEnd: 'Ajna' },
  { id: '44-26', gateStart: 44, gateEnd: 26, centerStart: 'Spleen', centerEnd: 'Heart/Ego' },
  { id: '45-21', gateStart: 45, gateEnd: 21, centerStart: 'Throat', centerEnd: 'Heart/Ego' },
  { id: '46-29', gateStart: 46, gateEnd: 29, centerStart: 'G Center', centerEnd: 'Sacral' },
  { id: '47-64', gateStart: 47, gateEnd: 64, centerStart: 'Ajna', centerEnd: 'Head' },
  { id: '48-16', gateStart: 48, gateEnd: 16, centerStart: 'Spleen', centerEnd: 'Throat' },
  { id: '49-19', gateStart: 49, gateEnd: 19, centerStart: 'Solar Plexus', centerEnd: 'Root' },
  { id: '50-27', gateStart: 50, gateEnd: 27, centerStart: 'Spleen', centerEnd: 'Sacral' },
  { id: '51-25', gateStart: 51, gateEnd: 25, centerStart: 'Heart/Ego', centerEnd: 'G Center' },
  { id: '52-9', gateStart: 52, gateEnd: 9, centerStart: 'Root', centerEnd: 'Sacral' },
  { id: '53-42', gateStart: 53, gateEnd: 42, centerStart: 'Root', centerEnd: 'Root' },
  { id: '54-32', gateStart: 54, gateEnd: 32, centerStart: 'Root', centerEnd: 'Spleen' },
  { id: '55-39', gateStart: 55, gateEnd: 39, centerStart: 'Solar Plexus', centerEnd: 'Root' },
  { id: '56-11', gateStart: 56, gateEnd: 11, centerStart: 'Throat', centerEnd: 'Ajna' },
  { id: '57-10', gateStart: 57, gateEnd: 10, centerStart: 'Spleen', centerEnd: 'G Center' },
  { id: '57-34', gateStart: 57, gateEnd: 34, centerStart: 'Spleen', centerEnd: 'Sacral' },
  { id: '58-18', gateStart: 58, gateEnd: 18, centerStart: 'Root', centerEnd: 'Spleen' },
  { id: '59-6', gateStart: 59, gateEnd: 6, centerStart: 'Sacral', centerEnd: 'Solar Plexus' },
  { id: '60-3', gateStart: 60, gateEnd: 3, centerStart: 'Root', centerEnd: 'Sacral' },
  { id: '61-24', gateStart: 61, gateEnd: 24, centerStart: 'Head', centerEnd: 'Ajna' },
  { id: '62-17', gateStart: 62, gateEnd: 17, centerStart: 'Throat', centerEnd: 'Ajna' },
  { id: '63-4', gateStart: 63, gateEnd: 4, centerStart: 'Head', centerEnd: 'Ajna' },
  { id: '64-47', gateStart: 64, gateEnd: 47, centerStart: 'Head', centerEnd: 'Ajna' },
];

// Center gate assignments (which gates belong to which center)
export const CENTER_GATES: Record<CenterType, number[]> = {
  Head: [61, 63, 64],
  Ajna: [4, 11, 17, 23, 24, 43, 47, 62],
  Throat: [8, 12, 13, 16, 20, 23, 31, 33, 35, 43, 45, 56, 62],
  'G Center': [1, 2, 7, 10, 13, 15, 25, 29, 46],
  'Heart/Ego': [21, 25, 26, 40, 51],
  'Solar Plexus': [6, 12, 19, 22, 30, 36, 37, 39, 41, 49, 55],
  Spleen: [16, 18, 28, 38, 44, 48, 50, 54, 57, 58],
  Sacral: [3, 5, 9, 14, 20, 27, 29, 34, 42, 52, 53, 59, 60],
  Root: [18, 19, 38, 39, 41, 42, 52, 53, 54, 58, 60],
};

// Center display labels
export const CENTER_LABELS: Record<CenterType, string> = {
  Head: 'Head',
  Ajna: 'Ajna',
  Throat: 'Throat',
  'G Center': 'G Center',
  'Heart/Ego': 'Heart/Ego',
  'Solar Plexus': 'Solar Plexus',
  Spleen: 'Spleen',
  Sacral: 'Sacral',
  Root: 'Root',
};