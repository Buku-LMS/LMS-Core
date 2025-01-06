#!/bin/bash

# Wait for database
if [ "$DATABASE_URL" ]; then
    echo "Waiting for database..."
    while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
        sleep 0.1
    done
    echo "Database ready!"
fi

# Run migrations
python manage.py migrate

# Start server
exec "$@"