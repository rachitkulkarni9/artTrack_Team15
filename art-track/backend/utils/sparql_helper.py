import requests

def query_sparql(query):
    endpoint = "http://localhost:7200/repositories/ArtTrack_SER531"  # Replace with your SPARQL endpoint URL
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    data = {"query": query}

    try:
        response = requests.post(endpoint, headers=headers, data=data)
        response.raise_for_status()  # Raise an error for HTTP codes >= 400
        return response.json()
    except requests.exceptions.RequestException as e:
        print("Error querying SPARQL endpoint:", e)
        return {"error": str(e)}
