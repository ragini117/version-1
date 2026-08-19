import sys
sys.path.insert(0, 'backend')
from Rag.helper import download_embeddings
from retrieval.route_retriever import RouteRetriever

emb = download_embeddings()
rr = RouteRetriever(embedding=emb)
results = rr.search_routes('what is deod.ai', k=10)
for r in results:
    print('score=' + str(round(r['score'],4)) + ' url=' + str(r['url']) + ' type=' + str(r['type']))
