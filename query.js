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
    +" PREFIX arco-cd: <https://w3id.org/arco/ontology/context-description/> "
    +" SELECT DISTINCT * "
    +" FROM <https://w3id.org/arco/ontology> "
    +" FROM <https://w3id.org/arco/data> "
    +" WHERE { "
    +" ?cultpro rdf:type/rdfs:subClassOf* arco-arco:"+ historicOrArtisticProperty + " ; " 
    +" rdfs:label ?label" + " ; "
    +" arco-cd:hasDocumentation ?documentation" + " ; "
    +" foaf:depiction ?foto "
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
    console.log(data.results.bindings.length);

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

//i parametri da inserire nei filtri vengono presi dai parametri get della pagina index
axios.get(queryConFiltri("",""))
.then(function(value){
    console.log(value);
    generateCards(value.data);
})
.catch(function(error){
    console.log(error);
});
