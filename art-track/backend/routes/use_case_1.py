from flask import Blueprint, request, jsonify
from utils.sparql_helper import query_sparql

# Define Blueprint for Use Case 1
use_case_1_bp = Blueprint("use_case_1", __name__)


@use_case_1_bp.route("/use-case-1", methods=["POST"])
def use_case_1():
    # Extract user inputs from the request
    data = request.json
    selected_museums = data.get("selectedMuseums", [])  # List of museums
    selected_medium = data.get("medium", "")  # Mandatory
    start_year = data.get("startYear", "")  # Optional
    end_year = data.get("endYear", "")  # Optional
    min_area = data.get("minArea", 0)  # Optional
    max_area = data.get("maxArea", float("inf"))  # Optional

    # Dynamically construct SPARQL filters based on inputs
    sparql_filters = []

    # Handle mandatory Museum filter
    if selected_museums:
        museums_filter = " || ".join(
            [f'?musuem = "{museum}"' for museum in selected_museums])
        sparql_filters.append(f"FILTER({museums_filter})")

    # Handle mandatory Medium filter
    if selected_medium:
        sparql_filters.append(
            f'FILTER regex(?medium, "{selected_medium}", "i")')

    # Handle optional Date Created filter
    if start_year and end_year:
        sparql_filters.append(
            f'FILTER(xsd:integer(?dateCreated) >= {start_year} && xsd:integer(?dateCreated) <= {end_year})')

    # Construct SPARQL query for dimensions and area
    area_filter = ""
    if min_area and max_area < float("inf"):
        area_filter = f"FILTER(?area >= {min_area} && ?area <= {max_area})"
    elif min_area:
        area_filter = f"FILTER(?area >= {min_area})"
    elif max_area < float("inf"):
        area_filter = f"FILTER(?area <= {max_area})"

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

      {" ".join(sparql_filters)}

      OPTIONAL {{
        BIND(xsd:float(STRBEFORE(?dimensions, "*")) AS ?width)
        BIND(xsd:float(STRAFTER(?dimensions, "*")) AS ?height)
        BIND(?width * ?height AS ?area)
        {area_filter}
      }}
    }}
    ORDER BY ?dateCreated
    """

    try:
        # Execute SPARQL query and log it
        print("Constructed SPARQL Query:\n", sparql_query)
        raw_results = query_sparql(sparql_query)

        if not raw_results.get(
                "results") or not raw_results["results"].get("bindings"):
            print("No results or invalid response structure")
            return jsonify(
                {"error": "No results match your query. Please adjust filters."}), 404

        # Parse results
        parsed_results = []
        for result in raw_results["results"]["bindings"]:
            # Exclude results where `title` has an unwanted datatype
            title_data = result.get("title", {})
            if "datatype" in title_data and title_data[
                    "datatype"] == "http://www.semanticweb.org/rachi/ontologies/2024/10/artTrack#string":
                continue  # Skip this record

            # Process other fields
            dimensions = result.get("dimensions", {}).get("value", "N/A")

            if dimensions != "N/A":
                dimensions = dimensions.replace(
                    "×", "*").replace("\xa0", "").strip()

            # Calculate area if dimensions are valid
            if dimensions != "N/A" and "*" in dimensions:
                try:
                    width, height = map(float, dimensions.split("*"))
                    area = width * height
                except ValueError:
                    area = "Invalid dimensions"
            else:
                area = "N/A"

            # Append parsed result
            parsed_results.append({
                "culture": result.get("culture", {}).get("value", "N/A"),
                "title": title_data.get("value", "N/A"),
                "dateCreated": result.get("dateCreated", {}).get("value", "N/A"),
                "medium": result.get("medium", {}).get("value", "N/A"),
                "musuem": result.get("musuem", {}).get("value", "N/A"),
                "dimensions": dimensions,
                "area": area,
            })

        return jsonify({"results": parsed_results})

    except Exception as e:
        print("Error executing SPARQL query:", str(e))
        return jsonify({"error": str(e)}), 500
