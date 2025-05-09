export enum Bundesland {
  BW = "Baden-W",
  BY = "Bayern",
  HE = "Hessen",
  BB = "Brandenburg",
  BE = "Berlin",
  HB = "Bremen",
  HH = "Hamburg",
  MV = "Mecklenburg-Vorpommern",
  NI = "Niedersachsen",
  NW = "Nordrhein-Westfalen",
  RP = "Rheinland-Pfalz",
  SH = "Schleswig-Holstein",
  SL = "Saarland",
  SN = "Sachsen",
  ST = "Sachsen-Anhalt",
  TH = "Thüringen"
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
