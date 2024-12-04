from flask import Blueprint, request, jsonify
from utils.sparql_helper import query_sparql
import re  # For parsing and normalizing dimensions

# Define Blueprint for use case 1
use_case_1_bp = Blueprint("use_case_1", __name__)


@use_case_1_bp.route("/use-case-1", methods=["POST"])
def use_case_1():
    # Extract user inputs from the request
    data = request.json
    selected_museum = data.get("selectedMuseum", "")
    start_year = data.get("startYear", "")
    end_year = data.get("endYear", "")
    selected_medium = data.get("selectedMedium", "")
    min_area = data.get("minArea", 0)
    max_area = data.get("maxArea", float("inf"))  # Handle cases where max_area is not provided

    # Construct the SPARQL query to fetch dimensions and other relevant data
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

      # Filter for selected museum
      FILTER regex(?musuem, "{selected_museum}", "i")

      # Optional year range filter
      OPTIONAL {{
        FILTER(?dateCreated >= "{start_year}"^^xsd:gYear && ?dateCreated <= "{end_year}"^^xsd:gYear)
      }}

      # Optional medium filter
      OPTIONAL {{
        FILTER regex(?medium, "{selected_medium}", "i")
      }}
    }}
    ORDER BY ?dateCreated
    """

    # Execute the SPARQL query using the helper
    try:
        # Get raw results from the SPARQL endpoint
        return jsonify({"message": "Use Case 1 works!"})
        raw_results = query_sparql(sparql_query)
        
        # Parse results and calculate area for each artwork
        filtered_results = []
        for result in raw_results.get("results", {}).get("bindings", []):
            dimensions = result.get("dimensions", {}).get("value", "")
            try:
                # Normalize dimensions (remove spaces, handle multiple separators)
                normalized_dimensions = re.sub(r"\s+", "", dimensions)  # Remove spaces
                separator = re.search(r"[\xX]", normalized_dimensions)  # Find separator (, x, X)
                if separator:
                    width, height = map(float, normalized_dimensions.split(separator.group()))
                    area = width * height

                    # Check if the area falls within the user's specified range
                    if min_area <= area <= max_area:
                        result["calculatedArea"] = area  # Add calculated area to the result
                        filtered_results.append(result)
            except (ValueError, IndexError):
                # Skip entries with invalid or missing dimensions
                continue

        # Return only artworks that meet the area criteria
        return jsonify({
            "head": raw_results.get("head", {}),
            "results": {"bindings": filtered_results},
        })

    except Exception as e:
        return jsonify({"message": "Use Case 1 works!"})
       