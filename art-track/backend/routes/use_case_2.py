from flask import Blueprint, request, jsonify
from utils.sparql_helper import query_sparql
import requests


use_case_2_bp = Blueprint("use_case_2", __name__)


SUBPERIOD_DATE_RANGES = {
    "Early Renaissance": (1400, 1490),
    "High Renaissance": (1490, 1527),
    "Mannerism": (1520, 1600),
    "Baroque": (1600, 1750),
    "Rococo": (1720, 1780),
    "Neoclassicism": (1750, 1850),
    "Romanticism": (1800, 1850),
    "Realism": (1840, 1880),
    "Impressionism": (1860, 1890),
    "Post-Impressionism": (1880, 1905),
    "Symbolism": (1880, 1910),
    "Fauvism": (1905, 1910),
    "Expressionism": (1905, 1920),
    "Cubism": (1907, 1915),
    "Futurism": (1909, 1914),
    "Constructivism": (1915, 1930),
    "Dada": (1915, 1924),
    "Surrealism": (1924, 1966),
    "Abstract Expressionism": (1943, 1965),
    "Pop Art": (1955, 1970),
    "Minimalism": (1960, 1970),
    "Postmodernism": (1970, 2024),
    "Conceptual Art": (1960, 2024),
    "Performance Art": (1970, 2024),
    "Digital Art": (1990, 2024),
}


def cancel_pending_queries():
    endpoint = "http://localhost:7200/rest/active-queries"
    try:
        
        response = requests.get(endpoint, headers={"Accept": "application/json"})
        response.raise_for_status()
        active_queries = response.json()
        print(f"[DEBUG] Active Queries: {active_queries}")

        
        for query in active_queries:
            query_id = query.get("queryId")
            if query_id:
                cancel_url = f"{endpoint}/{query_id}"
                cancel_response = requests.delete(cancel_url)
                print(f"[DEBUG] Cancelled query {query_id}: {cancel_response.status_code}")
    except requests.exceptions.RequestException as e:
        print("[DEBUG] Error managing active queries:", str(e))


@use_case_2_bp.route("/art-through-time", methods=["POST"])
def use_case_2():
    print("[DEBUG] Received request for Use Case 2.")

    
    print("[DEBUG] Cancelling pending queries...")
    cancel_pending_queries()

    
    data = request.json
    print(f"[DEBUG] Received data: {data}")

    selected_period = data.get("selectedPeriod", "")
    selected_subperiods = data.get("selectedSubperiods", [])

    
    if not selected_period or not selected_subperiods:
        error_message = "[DEBUG] Error: Please select both a period and subperiods."
        print(error_message)
        return jsonify({"error": error_message}), 400

    
    date_ranges = [SUBPERIOD_DATE_RANGES[sub]
                   for sub in selected_subperiods if sub in SUBPERIOD_DATE_RANGES]
    print(f"[DEBUG] Mapped date ranges: {date_ranges}")

    if not date_ranges:
        error_message = "[DEBUG] Error: Invalid subperiods selected."
        print(error_message)
        return jsonify({"error": error_message}), 400

    
    start_year = min([start for start, _ in date_ranges])
    end_year = max([end for _, end in date_ranges])
    print(f"[DEBUG] Determined date range: {start_year} - {end_year}")

    
    sparql_query = f"""
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX smw: <http://www.semanticweb.org/rachi/ontologies/2024/10/artTrack#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT DISTINCT ?culture ?title ?dateCreated ?medium ?musuem ?dimensions
    WHERE {{
      ?s smw:hasCulture ?culture ;
         smw:dateCreated ?dateCreated ;
         smw:hasOwner ?musuem ;
         smw:createdBy ?artist ;
         smw:hasTitle ?title ;
         smw:hasDimension ?dimensions ;
         smw:hasMedium ?medium .

      
      FILTER(xsd:integer(?dateCreated) >= {start_year} && xsd:integer(?dateCreated) <= {end_year})
    }}
    LIMIT 100
    """
    print(f"[DEBUG] Constructed SPARQL Query:\n{sparql_query}")

    try:
        
        print("[DEBUG] Executing SPARQL query...")
        raw_results = query_sparql(sparql_query)
        print(f"[DEBUG] SPARQL Query Raw Results: {raw_results}")

        
        parsed_results = []
        for result in raw_results["results"]["bindings"]:
            parsed_result = {
                "culture": result.get("culture", {}).get("value", "N/A"),
                "title": result.get("title", {}).get("value", "N/A"),
                "dateCreated": result.get("dateCreated", {}).get("value", "N/A"),
                "medium": result.get("medium", {}).get("value", "N/A"),
                "musuem": result.get("musuem", {}).get("value", "N/A"),
                "dimensions": result.get("dimensions", {}).get("value", "N/A"),
            }
            print(f"[DEBUG] Parsed Result: {parsed_result}")
            parsed_results.append(parsed_result)

        print(f"[DEBUG] Final Parsed Results: {parsed_results}")
        return jsonify({"results": parsed_results})

    except Exception as e:
        error_message = f"[DEBUG] Error executing SPARQL query: {str(e)}"
        print(error_message)
        return jsonify({"error": error_message}), 500
