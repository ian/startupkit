# Check if an argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <pg_url>"
    exit 1
fi

PG_URL=$1
TIMESTAMP=$(date +"%Y-%m-%dT%H_%MZ")
SCHEMA_FILENAME="dump/${TIMESTAMP}-schema.sql"
DATA_FILENAME="dump/${TIMESTAMP}-data.sql"

mkdir -p dump

echo "Dumping schema to $SCHEMA_FILENAME"
# Dump schema only (no data)
pg_dump "$PG_URL" --no-owner --no-acl \
  --schema-only \
  --clean \
  --if-exists \
  -f "$SCHEMA_FILENAME"

echo "Dumping data to $DATA_FILENAME"
# Dump data only
pg_dump "$PG_URL" --no-owner --no-acl \
  --data-only \
  --disable-triggers \
  --blobs \
  -f "$DATA_FILENAME"

echo "DONE"
