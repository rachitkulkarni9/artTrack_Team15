import requests

def query_sparql(query, endpoint="http://40.80.158.170:7200/repositories/ArtTrack_531"):
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    try:
        response = requests.post(endpoint, data={"query": query}, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print("Error querying SPARQL endpoint:", str(e))
        raise
