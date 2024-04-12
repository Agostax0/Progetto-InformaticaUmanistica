const format_json = "format=application%2Fsparql-results%2Bjson&";
const format_html = "format=text%2Fhtml&";

const historicOrArtisticProperty = "HistoricOrArtisticProperty";
const culturalProperty = "CulturalProperty";
const archaeologicalProperty = "ArchaeologicalProperty";

function queryCaricamentoPagina(){
    var queryURL = 
    "https://dati.cultura.gov.it/sparql?default-graph-uri=&"
    + format_json
    +"debug=on&query=" 
    +"PREFIX arco-arco: <https://w3id.org/arco/ontology/arco/>"
    +"PREFIX arco-cd: <https://w3id.org/arco/ontology/context-description/>"
    +"SELECT DISTINCT *"
    +" FROM <https://w3id.org/arco/ontology>"
    +" FROM <https://w3id.org/arco/data>"
    +" WHERE {"
    +" ?cultpro rdf:type/rdfs:subClassOf* arco-arco:"+ historicOrArtisticProperty + " ; " 
    +" rdfs:label ?label ; "
    +" foaf:depiction ?foto "
    +" FILTER(lang(?label) = 'it')"
    +" }"
    +" LIMIT 10"
    return queryURL;
}

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
    filteredQueryURL+="LIMIT 10";
    console.log(filteredQueryURL);
    return filteredQueryURL;
}

function generateCardElement(src,desc,link){
    var card = document.createElement("div");
    card.className="card";

    var img = document.createElement("img");
    img.className = "card-img-top";
    img.src = src;
    img.alt = desc;
    card.appendChild(img);

    var cardBody = document.createElement("div");
    cardBody.className = "card-body";

    var cardDescription = document.createElement("p");
    cardDescription.textContent = desc;

    var cardLink = document.createElement("a");
    cardLink.href = link;
    cardLink.appendChild(cardDescription);

    cardBody.appendChild(cardLink);

    card.appendChild(cardBody);

    return card;
}

function generateTable(data){
    const tableNode = document.createElement("table");

    tableNode.className = "table table-primary"
    //generate Table Head
    const tableHead = document.createElement("thead");
    var headers = data.head.vars
    var tableHeadRow = document.createElement("tr");
    data.head.vars.forEach(element => {
        //console.log(element);
        var tableHeadHeader = document.createElement("th");
        tableHeadHeader.textContent = element;
        tableHeadRow.appendChild(tableHeadHeader);
    });
    tableHead.appendChild(tableHeadRow)
    tableNode.appendChild(tableHead);



    //generate Table Body
    const tableBody = document.createElement("tbody");
    data.results.bindings.forEach(element=> {
        var tableBodyRow = document.createElement("tr");
        headers.forEach(header =>{
            var tableBodyRowElement = document.createElement("td");
            console.log(element[header]);
            //TODO operazioni sul 'type'
            if(element[header]["type"] == "uri"){
                
                if(header == "foto"){
                    var img = document.createElement("img");
                    img.src = element[header]['value'];
                    img.height = 100;
                    img.width = 100;
                    tableBodyRowElement.appendChild(img);
                }
                else{
                    var a = document.createElement("a");
                    a.href = element[header]['value'];
                    a.text = element[header]['value'];
                    
                    tableBodyRowElement.appendChild(a);
                }
            }
            else{
                tableBodyRowElement.textContent = element[header]['value'];
            }


            tableBodyRow.appendChild(tableBodyRowElement);
        });
        tableBody.appendChild(tableBodyRow);
    });
    tableNode.appendChild(tableBody);
    
    
    console.log(tableNode);
    return tableNode;
}

function generateCards(data){
    var cardList = document.getElementById("QueryResultDiv");
    
    data.results.bindings.forEach(element=> {

        var colDiv = document.createElement("div");
        colDiv.className = "col-3";

        colDiv.appendChild(generateCardElement(
            element['foto']['value'],
            element['label']['value'],
            element['cultpro']['value']));

        cardList.appendChild(colDiv);

    });

}


axios.get(queryConFiltri("",""))
.then(function(value){
    console.log(value);
    generateCards(value.data);
})
.catch(function(error){
    console.log(error);
});
