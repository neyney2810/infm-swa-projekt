"use client";

import React, { CSSProperties } from "react";

import { useCSVReader } from "react-papaparse";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10
  } as CSSProperties,
  browseFile: {
    width: "20%"
  } as CSSProperties,
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%"
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: "0 20px"
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: "red"
  } as CSSProperties
};

export function DataParsing(data: string) {
  const { CSVReader } = useCSVReader();

  return (
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
  );
}
export function prepareHeader(file: string) {
  var rawData = readFileSync(file , "utf8");
  var usableData = rawData.replace(existingHeaders, targetHeaders).replace(existingFooters, targetFooters).replace(zeroValue, zeroString);
  return usableData;
}

export function ReadCSVFromServer() 
{
  var data = prepareHeader("E:\\Github-Projekte\\infm-swa-projekt\\public\\utils\\data.csv")
  return CSVReader(data).then(function(results) {
    alert(JSON.stringify(results)); /*replace with display function*/})
}

export default function DisplayButton()
{
  return <button type="button" {...ReadCSVFromServer()}>Read and alert</button>
}
