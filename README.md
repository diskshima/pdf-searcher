# PDF Searcher
## Setup
1. Install Node modules.
    ```bash
    npm i
    ```
1. Run Elasticsearch with Docker.
    ```bash
    docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.5.1
    ```
1. Install kuromoji.
    ```bash
    docker exec -it CONTAINER_ID /bin/sh
    sh-4.2# bin/elasticsearch-plugin install analysis-kuromoji    # Inside Docker container
    ```
1. Add document mappings.
    ```bash
    curl -X PUT -H 'Content-type: application/json' http://localhost:9200/documents --data '@es_data/documents_mappings.json'
    ```

## Building
```bash
npm run build
```

## Running
### Adding documents
```bash
npm run main add PATH_TO_PDF
```

### Searching
```bash
npm run main search SEARCH_TERM
```

### Debugging
1. Replace the `main` above with `debug`
    ```bash
    npm debug main add PATH_TO_PDF
    ```
1. Open Chrome and navigate to `chrome://inspect/`.
1. Click `Open dedicated DevTools for Node`. DevTools should automatically connect to the node process.
