
import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'backend', 'mental_health.db')

def check_database():
    print("="*60)
    print(f"SQLITE DATABASE STATUS CHECK - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)

    if not os.path.exists(DB_PATH):
        print(f"❌ Database file NOT found at: {DB_PATH}")
        print("   Please run: python backend/shared/init_db.py")
        return

    print(f"[OK] Database file found: {DB_PATH}")
    size_mb = os.path.getsize(DB_PATH) / (1024 * 1024)
    print(f"   Size: {size_mb:.2f} MB")
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("\n[+] TABLE STATISTICS:")
        print(f"   Total Tables: {len(tables)}")
        print("-" * 50)
        print(f"   {'Table Name':<25} | {'Row Count':<10}")
        print("-" * 50)
        
        total_rows = 0
        for table in tables:
            table_name = table[0]
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                count = cursor.fetchone()[0]
                print(f"   {table_name:<25} | {count:<10}")
                total_rows += count
            except Exception as e:
                print(f"   {table_name:<25} | Error: {e}")
        
        print("-" * 50)
        print(f"   {'TOTAL ROWS':<25} | {total_rows:<10}")
        print("-" * 50)
        
        # Check specific critical tables for data
        print("\n[+] DATA SAMPLE CHECK:")
        
        # Check Users
        cursor.execute("SELECT user_id, username, email FROM users LIMIT 1")
        user = cursor.fetchone()
        if user:
            print(f"   [OK] Users found. Sample: {user}")
        else:
            print("   [!] No users found. (You may need to register first)")
            
        conn.close()
        print("\n[OK] Database check complete.")
        
    except Exception as e:
        print(f"\n[ERROR] Error connecting to database: {str(e)}")

if __name__ == "__main__":
    check_database()
