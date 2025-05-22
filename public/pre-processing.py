import os
import codecs
location = r".\public\inputFile\32421-0011_00.csv"
target = r".\public\utils\data.csv"

with codecs.open(location, "r", encoding="windows-1252") as infile, open(target , "w", encoding="utf-8") as outfile:
    outfile.write("Jahr;Bundesland;Kennzahl;Wirtschaftszweig;Stoffgruppe;Verwendung;VerwendungCO2;Einfuhr;EinfuhrCO2;Ausfuhr;AusfuhrCO2\n")
    for line in infile:
        if line.startswith("2"):
            line = line.replace(";-", ";0")
            line = line.replace(";.", ";0")
            line = line.replace("\n", "")
            outfile.write(line)