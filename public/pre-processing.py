import codecs
location = r".\public\inputFile\32421-0011_00.csv"
target = r".\public\utils\data.csv"
target_trimmed = r".\public\utils\data_trimmed.csv"

with codecs.open(location, "r", encoding="windows-1252") as infile, open(target , "w", encoding="utf-8") as outfile, open(target_trimmed, "w", encoding="utf-8") as outfile_trimmed:
    outfile.write("Jahr;Bundesland;Kennzahl;Wirtschaftszweig;Stoffgruppe;Verwendung;VerwendungCO2;Einfuhr;EinfuhrCO2;Ausfuhr;AusfuhrCO2\n")
    outfile_trimmed.write("Jahr;Bundesland;Kennzahl;Wirtschaftszweig;Stoffgruppe;Verwendung;VerwendungCO2;Einfuhr;EinfuhrCO2;Ausfuhr;AusfuhrCO2\n")
    for line in infile:
        if line.startswith("2"):
            trim_include = True
            line = line.replace(";-", ";N/A")
            line = line.replace(";.", ";N/A")
            line = line.replace("\n", "")
            outfile.write(line)
            if(line.__contains__(";N/A;N/A;N/A;N/A;N/A;N/A")):
                trim_include= False
            if(trim_include):
                outfile_trimmed.write(line)