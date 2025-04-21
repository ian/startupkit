# # Check if an argument is provided
# if [ -z "$1" ]; then
#     echo "Usage: $0 <pg_url>"
#     exit 1
# fi

PG_URL=${1:-"postgres://postgres@127.0.0.1:5432/brg"}

# Change to the directory containing the dump files
cd ./dump

# Find the newest timestamp by looking at schema files
NEWEST_TIMESTAMP=$(ls -1 *-schema.sql | sort -r | head -1 | sed 's/-schema\.sql//')

echo "Using backup from timestamp: $NEWEST_TIMESTAMP"

# Import schema first
echo "Importing schema..."
psql "$PG_URL" -a -f "${NEWEST_TIMESTAMP}-schema.sql"

# Import data second
echo "Importing data..."
psql "$PG_URL" -a -f "${NEWEST_TIMESTAMP}-data.sql"

# Reindex database after restore
echo "Reindexing database..."
psql "$PG_URL" -c "REINDEX DATABASE CONCURRENTLY \"$(echo "$PG_URL" | sed -E 's/.*\/([^?]*).*/\1/')\""