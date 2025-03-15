import mysql.connector

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host="35.197.229.65",
            user="root",
            password="3v3ryF@m1ly",
            database="everyfamily"
        )
        return conn
    except mysql.connector.Error as err:
        print("Database connection failed:", err)
        return None