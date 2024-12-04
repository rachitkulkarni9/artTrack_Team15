from flask import Blueprint, request, jsonify
from utils.sparql_helper import query_sparql

# Define Blueprint for use case 2
use_case_2_bp = Blueprint("use_case_2", __name__)

# Mapping subperiods to their respective time ranges
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
    "Postmodernism": (1970, 2024),  # Adjust end year if needed
    "Conceptual Art": (1960, 2024),
    "Performance Art": (1970, 2024),
    "Digital Art": (1990, 2024),
}


@use_case_2_bp.route('/use-case-2', methods=['POST'])
def use_case_2():
    # Extract user inputs
    data = request.json
    selected_period = data.get("selectedPeriod", "")
    selected_subperiods = data.get("selectedSubperiods", [])

    # Validate inputs
    if not selected_period or not selected_subperiods:
        return jsonify(
            {"error": "Please select both a period and subperiods."}), 400

    # Determine date range based on selected subperiods
    date_ranges = [SUBPERIOD_DATE_RANGES[sub]
                   for sub in selected_subperiods if sub in SUBPERIOD_DATE_RANGES]
    if not date_ranges:
        return jsonify({"error": "Invalid subperiods selected."}), 400

    # Merge date ranges into a single range
    start_year = min([start for start, _ in date_ranges])
    end_year = max([end for _, end in date_ranges])

    # Construct SPARQL query
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

      # Filter for date range
      FILTER(?dateCreated >= "{start_year}"^^xsd:gYear && ?dateCreated <= "{end_year}"^^xsd:gYear)
    }}
    ORDER BY ?dateCreated
    """

    # Execute the SPARQL query
    try:
        results = query_sparql(sparql_query)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
