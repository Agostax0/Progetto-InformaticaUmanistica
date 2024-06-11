const format_json = "format=application%2Fsparql-results%2Bjson&";

const historicOrArtisticProperty = "HistoricOrArtisticProperty";
const culturalProperty = "CulturalProperty";
const archaeologicalProperty = "ArchaeologicalProperty";

const maxCardsDisplayed = 50;

function queryConFiltri(parolaChiave, regione){
    var filteredQueryURL = 
    "https://dati.cultura.gov.it/sparql?default-graph-uri=&"
    + format_json
    +"debug=on&query=" 
    +"PREFIX arco-arco: <https://w3id.org/arco/ontology/arco/> "
    +"PREFIX arco-cd: <https://w3id.org/arco/ontology/context-description/> "
    if(regione != "") {
        filteredQueryURL+=
        "PREFIX arco-location: <https://w3id.org/arco/ontology/location/> "
        +"PREFIX CLV: <https://w3id.org/italia/onto/CLV/> "
        +"PREFIX arco-dd: <https://w3id.org/arco/ontology/denotative-description/> "
    }
    filteredQueryURL+=" SELECT DISTINCT * "
    +" FROM <https://w3id.org/arco/ontology> "
    +" FROM <https://w3id.org/arco/data> "
    +" WHERE {  ?cultpro rdf:type/rdfs:subClassOf* arco-arco:"+ historicOrArtisticProperty + " ;  rdfs:label ?label" + " ; foaf:depiction ?foto" + " FILTER(lang(?label) = 'it') ";

    if(parolaChiave != ""){
        filteredQueryURL+= "?cultpro arco-cd:hasSubject ?sub . ?sub rdfs:label ?subLabel FILTER(REGEX(STR(?subLabel), \"" + parolaChiave + "\", \"i\")) ";
    }
    if(regione != "") {
        filteredQueryURL+=" ?cultpro arco-location:hasCulturalPropertyAddress ?address. "
                        + " ?address CLV:hasRegion ?region. " 
                        + " ?region rdfs:label ?regNome. " 
                        + " ?cultpro arco-dd:hasCulturalPropertyType ?type. " 
                        + " FILTER regex(?regNome, \"" + regione + "\", \"i\") ";
    }
    filteredQueryURL+= "}  LIMIT " + maxCardsDisplayed + " OFFSET " + currentOffset;

    //query da mostrare nella pagina
    
    var queryText = "PREFIX arco-arco: <https://w3id.org/arco/ontology/arco/>\n"+"PREFIX arco-cd: <https://w3id.org/arco/ontology/context-description/>\n";
    if(regione != ""){
        queryText+="PREFIX arco-location: <https://w3id.org/arco/ontology/location/>\n"
        +"PREFIX CLV: <https://w3id.org/italia/onto/CLV/>\n"
        +"PREFIX arco-dd: <https://w3id.org/arco/ontology/denotative-description/>\n";
    }
    queryText+= "SELECT DISTINCT *\n"
    +"FROM <https://w3id.org/arco/ontology>\n"
    +"FROM <https://w3id.org/arco/data>\n"
    +"WHERE {\n"
    +"    ?cultpro rdf:type/rdfs:subClassOf* arco-arco:"+ historicOrArtisticProperty + " ;\n"
    +"    rdfs:label ?label" + " ;\n"
    +"    foaf:depiction ?foto" + " ;\n"
    +"    FILTER(lang(?label) = 'it') \n";
    if(parolaChiave != ""){
        queryText+= " ?cultpro arco-cd:hasSubject ?sub . ?sub rdfs:label ?subLabel\n FILTER(REGEX(STR(?subLabel), \"" + parolaChiave + "\", \"i\")) \n";
    }
    if(regione != "") {
        queryText+="    ?cultpro arco-location:hasCulturalPropertyAddress ?address.\n"
                        + "    ?address CLV:hasRegion ?region.\n" 
                        + "    ?region rdfs:label ?regNome.\n" 
                        + "    ?cultpro arco-dd:hasCulturalPropertyType ?type.\n" 
                        + "    FILTER regex(?regNome, \"" + regione + "\", \"i\")\n";
    }
    queryText+= "}\nLIMIT " + maxCardsDisplayed + "\nOFFSET " + currentOffset;

    insertQueryText(queryText);

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

function insertQueryText(queryText){
    const queryTextDiv = document.getElementById("queryCollapseText");

    //TODO classi di bootstrap per evidenziare le keyword

    queryTextDiv.innerText = queryText;
}

var selectedRegione = "";
const calabria = document.getElementById("RegioneCalabria");
calabria.addEventListener('click', (evt)=>{selectedRegione="Calabria"; addNewRegexFilter("RegioneCalabria")});
const lazio = document.getElementById("RegioneLazio");
lazio.addEventListener('click', (evt)=>{selectedRegione="Lazio"; addNewRegexFilter("RegioneLazio")});
const liguria = document.getElementById("RegioneLiguria");
liguria.addEventListener('click', (evt)=>{selectedRegione="Liguria"; addNewRegexFilter("RegioneLiguria")});
const marche = document.getElementById("RegioneMarche");
marche.addEventListener('click', (evt)=>{selectedRegione="Marche"; addNewRegexFilter("RegioneMarche")});
const molise = document.getElementById("RegioneMolise");
molise.addEventListener('click', (evt)=>{selectedRegione="Molise"; addNewRegexFilter("RegioneMolise")});
const puglia = document.getElementById("RegionePuglia");
puglia.addEventListener('click', (evt)=>{selectedRegione="Puglia"; addNewRegexFilter("RegionePuglia")});
const sardegna = document.getElementById("RegioneSardegna");
sardegna.addEventListener('click', (evt)=>{selectedRegione="Sardegna"; addNewRegexFilter("RegioneSardegna")});
const toscana = document.getElementById("RegioneToscana");
toscana.addEventListener('click', (evt)=>{selectedRegione="Toscana"; addNewRegexFilter("RegioneToscana")});
const veneto = document.getElementById("RegioneVeneto");
veneto.addEventListener('click', (evt)=>{selectedRegione="Veneto"; addNewRegexFilter("RegioneVeneto")});
const emiliaRomagna = document.getElementById("RegioneEmiliaRomagna");
emiliaRomagna.addEventListener('click', (evt)=>{selectedRegione="EmiliaRomagna"; addNewRegexFilter("RegioneEmiliaRomagna")});
const abruzzo = document.getElementById("RegioneAbruzzo");
abruzzo.addEventListener('click', (evt)=>{selectedRegione="Abruzzo"; addNewRegexFilter("RegioneAbruzzo")});
const campania = document.getElementById("RegioneCampania");
campania.addEventListener('click', (evt)=>{selectedRegione="Campania"; addNewRegexFilter("RegioneCampania")});
const lombardia = document.getElementById("RegioneLombardia");
lombardia.addEventListener('click', (evt)=>{selectedRegione="Lombardia"; addNewRegexFilter("RegioneLombardia")});
const piemonte = document.getElementById("RegionePiemonte");
piemonte.addEventListener('click', (evt)=>{selectedRegione="Piemonte"; addNewRegexFilter("RegionePiemonte")});
const fruiliVeneziaGiulia = document.getElementById("RegioneFriuli-VeneziaGiulia");
fruiliVeneziaGiulia.addEventListener('click', (evt)=>{selectedRegione="Friuli-Venezia Giulia"; addNewRegexFilter("RegioneFriuli-VeneziaGiulia")});
const umbria = document.getElementById("RegioneUmbria");
umbria.addEventListener('click', (evt)=>{selectedRegione="Umbria"; addNewRegexFilter("RegioneUmbria")});
const trentinoAltoAdige = document.getElementById("RegioneTrentino-AltoAdige");
trentinoAltoAdige.addEventListener('click', (evt)=>{selectedRegione="Trentino-Alto Adige"; addNewRegexFilter("RegioneTrentino-AltoAdige")});
const sicilia = document.getElementById("RegioneSicilia");
sicilia.addEventListener('click', (evt)=>{selectedRegione="Sicilia"; addNewRegexFilter("RegioneSicilia")});
const basilicata = document.getElementById("RegioneBasilicata");
basilicata.addEventListener('click', (evt)=>{selectedRegione="Basilicata"; addNewRegexFilter("RegioneBasilicata")});
const valleAosta = document.getElementById("RegioneValleAosta");
valleAosta.addEventListener('click', (evt)=>{selectedRegione="Valle d\'Aosta"; addNewRegexFilter("RegioneValleAosta")});

const searchBar = document.getElementById("searchBar");
var searchBarText = "";
searchBar.addEventListener('input', (evt) => {
    searchBarText = searchBar.value;
});

function addNewRegexFilter(regioneSelezionata){

    document.getElementById("FiltriAttivi").replaceChildren();

    if(searchBarText!=""){
        const newFilter = document.createElement("div");
        newFilter.className="col";
        
        const btn = document.createElement("button");
        btn.className="btn";

        btn.innerText=" "+ searchBarText + " ";
        const img = document.createElement("img");img.src="https://icons.getbootstrap.com/assets/icons/x-lg.svg";img.width=11;img.height=11;

        btn.appendChild(img);

        btn.addEventListener('click',(evt)=>{
            //ripulisce il filtro e la searchBar
            searchBarText = ""; 
            searchBar.value = "";
            emptyQueryResultDiv();
            //fa ripartire la query senza il filtro regex
            query("",selectedRegione);
            //ripulisce i filtri regex
            addNewRegexFilter();
        });
        newFilter.appendChild(btn);
        document.getElementById("FiltriAttivi").appendChild(newFilter);
    }

    if(selectedRegione!=""){
        const newFilter = document.createElement("div");
        newFilter.className="col";
        
        const btn = document.createElement("button");
        btn.className="btn";

        btn.innerText=" "+ selectedRegione + " ";
        const img = document.createElement("img");img.src="https://icons.getbootstrap.com/assets/icons/x-lg.svg";img.width=11;img.height=11;

        btn.appendChild(img);

        btn.addEventListener('click',(evt)=>{
            //ripulisce il radio checkbox e la regione
            selectedRegione = "";
            document.getElementById(regioneSelezionata).checked=false; 
            emptyQueryResultDiv();
            //fa ripartire la query senza la regione
            query(searchBarText,"");
            //ripulisce i filtri regex
            addNewRegexFilter();
        });
        newFilter.appendChild(btn);
        document.getElementById("FiltriAttivi").appendChild(newFilter);
    }
}

function emptyQueryResultDiv(){
    //svuota i risultati attuali

    document.getElementById("row1").replaceChildren();
    document.getElementById("row2").replaceChildren();
    document.getElementById("row3").replaceChildren();
    document.getElementById("row4").replaceChildren();
}

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener('click', (evt) => {

    emptyQueryResultDiv();

    //fai partire la nuova query con tutti i parametri

    query(searchBarText, selectedRegione);

    //aggiungi i nuovi filtri nella barra dei filtri

    if(searchBarText != ""){
        addNewRegexFilter();
    }else{
        document.getElementById("FiltriAttivi").replaceChildren();
    }
});

const loadingAnimation = document.getElementById("loadingAnimation");

var currentOffset = 0;
const queryPageBeforeBtn = document.getElementById("queryPageBefore");
const queryPageAfterBtn = document.getElementById("queryPageAfter");

queryPageAfterBtn.addEventListener('click',(evt)=>{
    emptyQueryResultDiv();

    currentOffset+=maxCardsDisplayed;

    query(searchBarText, selectedRegione);
});
queryPageBeforeBtn.addEventListener('click',(evt)=>{

    emptyQueryResultDiv();

    currentOffset-= (currentOffset < 50 ) ? 0 : maxCardsDisplayed;

    query(searchBarText, selectedRegione);

});



function query(keyword,region){

    //la barra di carimento diventa visibile
    loadingAnimation.className = loadingAnimation.className.replace("invisible", "visible");

    axios.get(queryConFiltri(keyword,region))
    .then(function(value){

        //la barra di carimento diventa invisibile
        loadingAnimation.className = loadingAnimation.className.replace("visible", "invisible");

        console.log(value);
        generateCards(value.data);
    })
    .catch(function(error){
        console.log(error);
    });    
}
//document.getElementById("flexCheckChecked").checked=false;
//console.log(document.getElementById("flexCheckChecked").checked);


//query("","");