import Papa from "papaparse";
import { readFileSync } from "fs";

const existingHeaders =
  "Tabelle: 32421-0011\nVerwendung, Einfuhr und Ausfuhr klimawirksamer Stoffe: Bundesl�nder, Jahre, Wirtschaftszweig des Unternehmens, Stoffgruppen;;;;;;;;;;\n" +
  "Erhebung bestimmter klimawirksamer Stoffe;;;;;;;;;;\n" +
  ";;;;;Verwendung klimawirksamer Stoffe;Verwendung klimawirksamer Stoffe (CO2-�quivalente);Einfuhr klimawirksamer Stoffe;Einfuhr klimawirksamer Stoffe (CO2-�quivalente);Ausfuhr klimawirksamer Stoffe;Ausfuhr klimawirksamer Stoffe (CO2-�quivalente)\n;;;;;t;1000 t;t;1000 t;t;1000 t"; //TODO: Find regex for this
const targetHeaders = "jahr;bundesland;kennummer_wz;wirtschaftszweig;stoffgruppe;verwendung;verwendung_co2aequi;einfuhr;einfuhr_co2aequi;ausfuhr;ausfuhr_co2aequi";
const existingFooters = "__________\n� Statistisches Bundesamt (Destatis), 2025\nStand: 09.01.2025 / 19:19:53";
const targetFooters = "";
const zeroValue = ";-";
const zeroString = ";0";

export function CSVReader(data: string) {
  return new Promise(function (complete, error) {
    Papa.parse(data, { complete, error, delimiter: ";", dynamicTyping: true, header: true });
  });
}

export function prepareHeader(file: string) {
  var rawData = readFileSync(file, "utf8");
  var usableData = rawData.replaceAll(existingHeaders, targetHeaders).replaceAll(existingFooters, targetFooters).replaceAll(zeroValue, zeroString);
  // console.log(usableData);
  return usableData;
}

export function ReadCSVFromServer() {
  var data = prepareHeader("/utils/data-copy.csv");
  return CSVReader(data).then(function (results) {
    alert(JSON.stringify(results)); /*replace with display function*/
  });
}

export async function GET() {
  var currentDir = process.cwd();
  var rawData = prepareHeader(`${currentDir}/public/utils/data-copy.csv`);
  var data = Papa.parse(rawData, { delimiter: ";", dynamicTyping: true, header: true });
  return Response.json({ data });
}
