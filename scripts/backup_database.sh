#!/bin/bash

# Database Backup Script
# Backs up PostgreSQL database with timestamp

# Configuration
DB_NAME="mental_health"
DB_USER="postgres"
BACKUP_DIR="/var/backups/mental_health"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🔄 Starting database backup..."

# Perform backup
pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup completed: $BACKUP_FILE"
    
    # Compress backup
    gzip "$BACKUP_FILE"
    echo "✅ Backup compressed: $BACKUP_FILE.gz"
    
    # Delete old backups
    find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "✅ Old backups cleaned (older than $RETENTION_DAYS days)"
    
    # Upload to cloud storage (optional)
    # aws s3 cp "$BACKUP_FILE.gz" s3://your-bucket/backups/
    
else
    echo "❌ Backup failed!"
    exit 1
fi

echo "✅ Backup process completed successfully"
