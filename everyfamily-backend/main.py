import mysql.connector
from flask import Flask
from dotenv import load_dotenv
import os


app= Flask(__name__)

load_dotenv()

config = {
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_NAME"),
}


try:
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

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/create_account')
def create_account():
    return 'create_account'

if __name__ == "__main__":
    app.run(debug=True)
