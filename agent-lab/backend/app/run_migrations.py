import os
import psycopg
import re
from app.settings import settings

def run_migration(file_path: str):
    print(f"Applying migration: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        sql = f.read()
    
    url = settings.SUPABASE_DB_URL
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if m:
        user, password, host, port, dbname = m.groups()
        conn_str = f"dbname={dbname} user={user} password={password} host={host} port={port}"
    else:
        conn_str = url

    try:
        with psycopg.connect(conn_str, autocommit=True) as conn:
            with conn.cursor() as cur:
                cur.execute(sql)
        print("Migration applied successfully!")
    except Exception as e:
        print(f"Error applying migration: {e}")

if __name__ == "__main__":
    import sys
    path = "migrations/009_memory_schema.sql"
    if len(sys.argv) > 1:
        path = sys.argv[1]
    run_migration(path)
