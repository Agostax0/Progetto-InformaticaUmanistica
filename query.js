const keyword = "";

const format_json = "format=application%2Fsparql-results%2Bjson&";
const format_html = "format=text%2Fhtml&";

var baseURL = "https://dati.cultura.gov.it/sparql?default-graph-uri=&"
+ format_html
+ "debug=on&query=" 
+ "PREFIX arco-cd: <https://w3id.org/arco/ontology/context-description/>" 
+ "PREFIX arco-arco: <https://w3id.org/arco/ontology/arco/>" 
+ "SELECT *"
+ "FROM <https://w3id.org/arco/ontology>"
+ "FROM <https://w3id.org/arco/data>"
+ "WHERE {"
+ " ?cultpro rdf:type/rdfs:subClassOf* arco-arco:CulturalProperty ; arco-cd:hasSubject ?sub ."
+ " ?sub rdfs:label ?label"
+ " FILTER(REGEX(STR(?label), \"" + keyword + "\", \"i\"))"
+ " }"
+ " LIMIT 100" 
;

axios.get(baseURL)
.then(function(value){
    var temp = document.createElement('div');
    temp.innerHTML = value.data;
    document.body.appendChild(temp);
    console.log(value)
})
.catch(function(error){
    console.log(error)
});
