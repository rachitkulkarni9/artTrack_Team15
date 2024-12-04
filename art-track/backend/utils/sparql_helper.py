from SPARQLWrapper import SPARQLWrapper, JSON
from config import SPARQL_ENDPOINT

def query_sparql(sparql_query):
    sparql = SPARQLWrapper(SPARQL_ENDPOINT)
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)

    try:
        results = sparql.query().convert()
        return results
    except Exception as e:
        return {"error": str(e)}