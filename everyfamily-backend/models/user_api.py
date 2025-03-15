from flask import Flask, request, jsonify
import mysql.connector  # Ensure you have this installed
from config import get_db_connection

app = Flask(__name__)

# Create User (Signup)
@app.route("/user", methods=["POST"])
def create_user():
    data = request.json
    if not data or "email" not in data or "logged_in" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        query = "INSERT INTO Signup_Data (Email_ID, Logged_In) VALUES (%s, %s)"
        values = (data["email"], data["logged_in"])
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"message": "User created successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()


# Read User (Get user details)
@app.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    if user_id <= 0:
        return jsonify({"error": "Invalid user ID"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)  # Works with mysql.connector
        query = "SELECT User_ID, Email_ID, Logged_In FROM Signup_Data WHERE User_ID = %s"
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()
        return jsonify(user) if user else jsonify({"error": "User not found"}), 404
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()


# Update User (Change login status)
@app.route("/user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    if user_id <= 0:
        return jsonify({"error": "Invalid user ID"}), 400

    data = request.json
    if not data or "logged_in" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        query = "UPDATE Signup_Data SET Logged_In = %s WHERE User_ID = %s"
        values = (data["logged_in"], user_id)
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"message": "User updated successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()


# Delete User
@app.route("/user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    if user_id <= 0:
        return jsonify({"error": "Invalid user ID"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        query = "DELETE FROM Signup_Data WHERE User_ID = %s"
        cursor.execute(query, (user_id,))
        conn.commit()
        return jsonify({"message": "User deleted successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

