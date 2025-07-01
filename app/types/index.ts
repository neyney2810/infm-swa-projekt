export enum Bundesland {
  BW = 'Baden-W',
  BY = 'Bayern',
  HE = 'Hessen',
  BB = 'Brandenburg',
  BE = 'Berlin',
  HB = 'Bremen',
  HH = 'Hamburg',
  MV = 'Mecklenburg-Vorpommern',
  NI = 'Niedersachsen',
  NW = 'Nordrhein-Westfalen',
  RP = 'Rheinland-Pfalz',
  SH = 'Schleswig-Holstein',
  SL = 'Saarland',
  SN = 'Sachsen',
  ST = 'Sachsen-Anhalt',
  TH = 'Thüringen',
}

export type DataUnit = {
  Jahr: number;
  Bundesland: Bundesland;
  Kennzahl: string;
  Wirtschaftszweig: string;
  Stoffgruppe: string;
  Verwendung: number;
  VerwendungCO2: number;
  Einfuhr: number;
  EinfuhrCO2: number;
  Ausfuhr: number;
  AusfuhrCO2: number;
};

export type MarkerData = {
  values: number[];
  total: number;
  radius: number;
  stroke?: number;
  lon: number;
  lat: number;
  ids?: string[]; // IDs of the Kennzahlen for the pie chart
  bundesland?: Bundesland; // Optional, if the marker is for a specific Bundesland
};

export type BundeslandData = {
  id: Bundesland;
  gesamtAusstoss: number;
  einzelAusstoss: { id: string; name: string; value: number }[]; // id: Kennzahl, value: Verwendung, name: Wirtschaftszweig
};

export type FilterT = {
  bundesland: Bundesland | null;
  wirtschaftszweig: string | null;
  stoffgruppe: string | null;
}

export type MetaDataT = {
  bundesland: { id: Bundesland; lat: number; lon: number }[];
  wirtschaftszweig: string[];
  stoffgruppe: string[];
}


export type LegendItem = {
  color: string;
  name: string;
};

export type LegendProps = {
  items: LegendItem[];
};