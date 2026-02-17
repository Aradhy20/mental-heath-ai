"""
Automated migration script to update all services from MongoDB to SQLite
This script updates import statements and database references across all backend services.
"""

import os
import re

# Services to update with their MongoDB import patterns
SERVICES_TO_UPDATE = {
    'auth_service': {
        'file': 'main.py',
        'old_imports': ['import crud_mongo as crud'],
        'new_imports': [
            'from sqlalchemy.orm import Session',
            'from shared.database import get_db, SessionLocal',
            'from shared.models import User as UserDB',
            'import crud_sqlite as crud'
        ],
        'old_db_refs': ['"mongodb"'],
        'new_db_refs': ['"sqlite"']
    },
    'voice_service': {
        'file': 'main.py',
        'old_imports': ['from shared.mongodb import voice_collection, fix_id'],
        'new_imports': [
            'from sqlalchemy.orm import Session',
            'from shared.database import get_db, SessionLocal',
            'from shared.models import VoiceAnalysis as VoiceAnalysisDB'
        ],
        'old_db_refs': ['"mongodb"', '(MongoDB)'],
        'new_db_refs': ['"sqlite"', '(SQLite)']
    },
    'face_service': {
        'file': 'main.py',
        'old_imports': ['from shared.mongodb import face_collection, fix_id'],
        'new_imports': [
            'from sqlalchemy.orm import Session',
            'from shared.database import get_db, SessionLocal',
            'from shared.models': FaceAnalysis as FaceAnalysisDB'
        ],
        'old_db_refs': ['"mongodb"', '(MongoDB)'],
        'new_db_refs': ['"sqlite"', '(SQLite)']
    },
    'fusion_service': {
        'file': 'main.py',
        'old_imports': ['from shared.mongodb import'],
        'new_imports': [
            'from sqlalchemy.orm import Session',
            'from shared.database import get_db, SessionLocal',
            'from shared.models import Result as ResultDB'
        ],
        'old_db_refs': ['"mongodb"', '(MongoDB)'],
        'new_db_refs': ['"sqlite"', '(SQLite)']
    }
}

def update_service_file(service_name, config):
    """Update a single service file"""
    file_path = os.path.join('backend', service_name, config['file'])
    
    if not os.path.exists(file_path):
        print(f"⚠️  File not found: {file_path}")
        return False
    
    print(f"📝 Updating {service_name}/{config['file']}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace imports
        for old_import in config['old_imports']:
            if old_import in content:
                # Comment out old import
                content = content.replace(old_import, f"# {old_import} # DEPRECATED - migrated to SQLite")
        
        # Replace database references
        for old_ref, new_ref in zip(config['old_db_refs'], config['new_db_refs']):
            content = content.replace(old_ref, new_ref)
        
        # Write updated content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"   ✅ Updated successfully")
        return True
    
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("="*60)
    print("MongoDB to SQLite Migration Script")
    print("="*60)
    print()
    
    success_count = 0
    total = len(SERVICES_TO_UPDATE)
    
    for service_name, config in SERVICES_TO_UPDATE.items():
        if update_service_file(service_name, config):
            success_count += 1
        print()
    
    print("="*60)
    print(f"Migration Complete: {success_count}/{total} services updated")
    print("="*60)
    print()
    print("⚠️  IMPORTANT: Some services may need manual code updates")
    print("   for database operations (CRUD functions).")
    print()
    print("Next steps:")
    print("1. Review each service's database operations")
    print("2. Update CRUD functions to use SQLAlchemy")
    print("3. Test each service endpoint")
    print("4. Run: python backend/shared/init_db.py")

if __name__ == "__main__":
    main()
