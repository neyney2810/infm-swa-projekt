import Papa from "papaparse"
import { readFileSync } from "fs";

// const styles = {
//   csvReader: {
//     display: "flex",
//     flexDirection: "row",
//     marginBottom: 10
//   } as CSSProperties,
//   browseFile: {
//     width: "20%"
//   } as CSSProperties,
//   acceptedFile: {
//     border: "1px solid #ccc",
//     height: 45,
//     lineHeight: 2.5,
//     paddingLeft: 10,
//     width: "80%"
//   } as CSSProperties,
//   remove: {
//     borderRadius: 0,
//     padding: "0 20px"
//   } as CSSProperties,
//   progressBarBackgroundColor: {
//     backgroundColor: "red"
//   } as CSSProperties
// };

const existingHeaders = "Tabelle: 32421-0011\nVerwendung, Einfuhr und Ausfuhr klimawirksamer Stoffe: Bundesl�nder, Jahre, Wirtschaftszweig des Unternehmens, Stoffgruppen;;;;;;;;;;\n"+"Erhebung bestimmter klimawirksamer Stoffe;;;;;;;;;;\n"+ ";;;;;Verwendung klimawirksamer Stoffe;Verwendung klimawirksamer Stoffe (CO2-�quivalente);Einfuhr klimawirksamer Stoffe;Einfuhr klimawirksamer Stoffe (CO2-�quivalente);Ausfuhr klimawirksamer Stoffe;Ausfuhr klimawirksamer Stoffe (CO2-�quivalente)\n;;;;;t;1000 t;t;1000 t;t;1000 t" //TODO: Find regex for this
const targetHeaders = "jahr;bundesland;kennummer_wz;wirtschaftszweig;stoffgruppe;verwendung;verwendung_co2aequi;einfuhr;einfuhr_co2aequi;ausfuhr;ausfuhr_co2aequi"
const existingFooters= "__________\n� Statistisches Bundesamt (Destatis), 2025\nStand: 09.01.2025 / 19:19:53"
const targetFooters = ""
const zeroValue = ";-"
const zeroString = ";0"

export function CSVReader(data: string)  {
  
  /*return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        alert(JSON.stringify(results));
      }}>
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }: any) => (
        <>
          <div style={styles.csvReader}>
            <button type="button" {...getRootProps()} style={styles.browseFile}>
              Browse file
            </button>
            <div style={styles.acceptedFile}>{acceptedFile && acceptedFile.name}</div>
            <button {...getRemoveFileProps()} style={styles.remove}>
              Remove
            </button>
          </div>
          <ProgressBar style={styles.progressBarBackgroundColor} />
        </>
      )}
    </CSVReader>
  );*/
  return new Promise (function (complete, error) {
     Papa.parse(data ,{complete, error, delimiter:";", dynamicTyping: true, header: true});
    }) 
}

export function prepareHeader(file: string) {
  var rawData = readFileSync(file , "utf8");
  var usableData = rawData.replaceAll(existingHeaders, targetHeaders).replaceAll(existingFooters, targetFooters).replaceAll(zeroValue, zeroString);
  console.log(usableData);
  return usableData;
}

export function ReadCSVFromServer() 
{
  var data = prepareHeader("E:\\Github-Projekte\\infm-swa-projekt\\public\\utils\\32421-0011_00 (2).csv")
  return CSVReader(data).then(function(results) {
    alert(JSON.stringify(results)); /*replace with display function*/})
}

export async function GET() {
    var rawData = prepareHeader("E:\\Github-Projekte\\infm-swa-projekt\\public\\utils\\32421-0011_00 (2).csv");
    var data = Papa.parse(rawData ,{delimiter:";", dynamicTyping: true, header: true});;
    

    return Response.json({data});
}