Papa.parse("https://www-genesis.destatis.de/genesis-old/downloads/00/tables/32421-0011_00.csv", {download:true, 
    complete: function(results, file) {
	console.log("Parsing complete:", results, file);
}
});// functionality for download only works in browser, needs to be embedded in html.
/*var fileBuffer = new Array();
var file = new File(fileBuffer,"app\\utils\\32421-0011_00 (2).csv");
Papa.parse(file, {
    complete: function(results, file) {
	    console.log("Parsing complete:", results, file);
    }
});*/