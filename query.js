const format_json = "format=application%2Fsparql-results%2Bjson&";
const format_html = "format=text%2Fhtml&";

const historicOrArtisticProperty = "HistoricOrArtisticProperty";
const culturalProperty = "CulturalProperty";
const archaeologicalProperty = "ArchaeologicalProperty";

const maxCardsDisplayed = 50;

const fullCardSize = "12";

function queryConFiltri(parolaChiave, regione){
    var filteredQueryURL = 
    "https://dati.cultura.gov.it/sparql?default-graph-uri=&"
    + format_json
    +"debug=on&query=" 
    +"PREFIX arco-arco: <https://w3id.org/arco/ontology/arco/> "
    +"PREFIX arco-cd: <https://w3id.org/arco/ontology/context-description/> "
    +"PREFIX arco-location: <https://w3id.org/arco/ontology/location/> "
    +"PREFIX CLV: <https://w3id.org/italia/onto/CLV/> "
    +"PREFIX arco-dd: <https://w3id.org/arco/ontology/denotative-description/> "
    +" SELECT DISTINCT * "
    +" FROM <https://w3id.org/arco/ontology> "
    +" FROM <https://w3id.org/arco/data> "
    +" WHERE { "
    +" ?cultpro rdf:type/rdfs:subClassOf* arco-arco:"+ historicOrArtisticProperty + " ; " 
    +" rdfs:label ?label" + " ; "
    +" arco-cd:hasDocumentation ?documentation" + " ; "
    +" foaf:depiction ?foto" + " ; "
    +" arco-cd:hasSubject ?sub . ?sub rdfs:label ?subLabel "
    +" FILTER(lang(?label) = 'it') ";
    if(parolaChiave != ""){
        filteredQueryURL+= "FILTER(REGEX(STR(?subLabel), \"" + parolaChiave + "\", \"i\")) ";
    }
    if(regione != "") {
        filteredQueryURL+=" ?cultpro arco-location:hasCulturalPropertyAddress ?address. "
                        + " ?address CLV:hasRegion ?region. " 
                        + " ?region rdfs:label ?regNome. " 
                        + " ?cultpro arco-dd:hasCulturalPropertyType ?type. " 
                        + " FILTER regex(?regNome, \"" + regione + "\", \"i\") ";
    }
    filteredQueryURL+= "}";
    filteredQueryURL+="LIMIT " + maxCardsDisplayed;
    console.log(filteredQueryURL);
    return filteredQueryURL;
}

function generateCardElement(src,desc,link){
    var card = document.createElement("div");
    card.className="card my-2";

    var img = document.createElement("img");
    img.className = "card-img-top";
    img.src = src;
    img.alt = desc;
    card.appendChild(img);

    var cardBody = document.createElement("div");
    cardBody.className = "card-body text-justify";

    var cardLink = document.createElement("a");
    cardLink.href = link;
    cardLink.text = desc;

    cardBody.appendChild(cardLink);

    card.appendChild(cardBody);

    return card;
}

function generateCards(data){

    var row1 = document.getElementById("row1");
    var row2 = document.getElementById("row2");
    var row3 = document.getElementById("row3");
    var row4 = document.getElementById("row4");

    var genericCol = document.createElement("div");
    genericCol.className = "col-12";

    //divido i risultati nelle 4 righe

    var selectedRow = 0;
    data.results.bindings.forEach(element=> {

        var card = generateCardElement(
            element['foto']['value'],
            element['label']['value'],
            element['cultpro']['value']);

        //eseguire l'append al padre corretto
        var cardCol = genericCol.cloneNode();
        switch(selectedRow){
            case 0:
                cardCol.appendChild(card);
                row1.appendChild(cardCol);
                break;
            case 1:
                cardCol.appendChild(card);
                row2.appendChild(cardCol);
                break;
            case 2:
                cardCol.appendChild(card);
                row3.appendChild(cardCol);
                break;
            case 3:
                cardCol.appendChild(card);
                row4.appendChild(cardCol);
                break;
        }

        selectedRow = (selectedRow + 1) % 4;
    });



}

var selectedRegione = "";
document.getElementById("RegioneCalabria").addEventListener('click', (evt)=>{selectedRegione="Calabria"});
document.getElementById("RegioneLazio").addEventListener('click', (evt)=>{selectedRegione="Lazio"});
document.getElementById("RegioneLiguria").addEventListener('click', (evt)=>{selectedRegione="Liguria"});
document.getElementById("RegioneMarche").addEventListener('click', (evt)=>{selectedRegione="Marche"});
document.getElementById("RegioneMolise").addEventListener('click', (evt)=>{selectedRegione="Molise"});
document.getElementById("RegionePuglia").addEventListener('click', (evt)=>{selectedRegione="Puglia"});
document.getElementById("RegioneSardegna").addEventListener('click', (evt)=>{selectedRegione="Sardegna"});
document.getElementById("RegioneToscana").addEventListener('click', (evt)=>{selectedRegione="Toscana"});
document.getElementById("RegioneVeneto").addEventListener('click', (evt)=>{selectedRegione="Veneto"});
document.getElementById("RegioneEmiliaRomagna").addEventListener('click', (evt)=>{selectedRegione="EmiliaRomagna"});
document.getElementById("RegioneAbruzzo").addEventListener('click', (evt)=>{selectedRegione="Abruzzo"});
document.getElementById("RegioneCampania").addEventListener('click', (evt)=>{selectedRegione="Campania"});
document.getElementById("RegioneLombardia").addEventListener('click', (evt)=>{selectedRegione="Lombardia"});
document.getElementById("RegionePiemonte").addEventListener('click', (evt)=>{selectedRegione="Piemonte"});
document.getElementById("RegioneFriuli-VeneziaGiulia").addEventListener('click', (evt)=>{selectedRegione="Friuli-Venezia Giulia"});
document.getElementById("RegioneUmbria").addEventListener('click', (evt)=>{selectedRegione="Umbria"});
document.getElementById("RegioneTrentino-AltoAdige").addEventListener('click', (evt)=>{selectedRegione="Trentino-Alto Adige"});
document.getElementById("RegioneSicilia").addEventListener('click', (evt)=>{selectedRegione="Sicilia"});
document.getElementById("RegioneBasilicata").addEventListener('click', (evt)=>{selectedRegione="Basilicata"});
document.getElementById("RegioneValleAosta").addEventListener('click', (evt)=>{selectedRegione="Valle d\'Aosta"});

var searchBar = document.getElementById("searchBar");
var searchBarText = "";
searchBar.addEventListener('input', (evt) => {
    searchBarText = searchBar.value;
});

var searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener('click', (evt) => {

    //svuota i risultati attuali

    document.getElementById("row1").replaceChildren();
    document.getElementById("row2").replaceChildren();
    document.getElementById("row3").replaceChildren();
    document.getElementById("row4").replaceChildren();

    //fai partire la nuova query con tutti i parametri

    //query(searchBarText, selectedRegione);
});

function query(keyword,region){
    axios.get(queryConFiltri(keyword,region))
    .then(function(value){
        console.log(value);
        generateCards(value.data);
    })
    .catch(function(error){
        console.log(error);
    });    
}



//query("","");