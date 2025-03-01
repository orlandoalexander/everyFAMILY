import mysql.connector

# Replace with your Cloud SQL instance details
config = {
    "user": "root",
    "password": "3v3ryF@m1ly",
    "host": "35.197.229.65",
    "database": "everyfamily",
}

try:
    # Establish connection
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    # Execute a query
    cursor.execute("SELECT DATABASE();")
    db_name = cursor.fetchone()
    print("Connected to database:", db_name)

    # Close connection
    cursor.close()
    conn.close()

except mysql.connector.Error as err:
    print("Error:", err)