const format_json = "format=application%2Fsparql-results%2Bjson&";
const format_html = "format=text%2Fhtml&";

const historicOrArtisticProperty = "HistoricOrArtisticProperty"
const culturalProperty = "CulturalProperty";
const archaeologicalProperty = "ArchaeologicalProperty";

function generateLoadingQuery(propertyType, keyword){
    var queryURL = "https://dati.cultura.gov.it/sparql?default-graph-uri=&"
    + format_json
    + "debug=on&query=" 
    + "PREFIX arco-cd: <https://w3id.org/arco/ontology/context-description/>" 
    + "PREFIX arco-arco: <https://w3id.org/arco/ontology/arco/>" 
    + "SELECT *"
    + "FROM <https://w3id.org/arco/ontology>"
    + "FROM <https://w3id.org/arco/data>"
    + "WHERE {"
    + " ?cultpro rdf:type/rdfs:subClassOf* arco-arco:"+ propertyType +" ; arco-cd:hasSubject ?sub ."
    + " ?sub rdfs:label ?label"
    + " FILTER(REGEX(STR(?label), \"" + keyword + "\", \"i\"))"
    + " }"
    + " LIMIT 3" 
    ;
    return queryURL;
}
function generateTable(data){
    const tableNode = document.createElement("table");

    tableNode.className = "sparql"
    tableNode.border = 1;

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
                
                var a = document.createElement("a");
                a.href = element[header]['value'];
                a.text = element[header]['value'];
                
                tableBodyRowElement.appendChild(a);
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


axios.get(generateLoadingQuery(archaeologicalProperty,""))
.then(function(value){
    document.body.appendChild(generateTable(value.data))
    console.log(value)
})
.catch(function(error){
    console.log(error)
});
