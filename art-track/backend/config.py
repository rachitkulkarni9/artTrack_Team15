import os

# Default SPARQL endpoint for local testing
SPARQL_ENDPOINT = os.getenv("SPARQL_ENDPOINT",
                            "http://40.80.158.170:7200/repositories/ArtTrack_531")
