from flask import Flask, request, jsonify, session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.resource_model import *
from models.category_model import *
from models.referral_model import *
from models.type_model import *
from models.user_model import *
from models.user_resource_model import *
from dotenv import load_dotenv
import os
import tempfile
import uuid
import shutil
from flask_cors import CORS
import secrets
import string
import smtplib
from email.mime.text import MIMEText
import sqlite3

load_dotenv()

EMAIL = os.getenv("EMAIL")
PASSWORD = os.getenv("PASSWORD")
DATABASE_URL = os.getenv("DATABASE_URL")
FRONTEND_URL=os.getenv("FRONTEND_URL")
FRONTEND_URL_DEMO=os.getenv("FRONTEND_URL_DEMO")
FLASK_SECRET_KEY = os.getenv('FLASK_SECRET_KEY')

app = Flask(__name__)
app.secret_key = FLASK_SECRET_KEY


CORS(app, origins=[FRONTEND_URL, FRONTEND_URL_DEMO], supports_credentials=True)

TEMP_DIR = tempfile.gettempdir()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # folder containing main.py
SEED_DB_PATH = os.path.join(BASE_DIR, "demo_data.db")

# Regular app DB
engine = create_engine(DATABASE_URL, future=True)
Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_demo_db_path():
    if "demo_db_path" not in session:
        os.makedirs(TEMP_DIR, exist_ok=True)
        db_copy_path = os.path.join(TEMP_DIR, f"demo_{uuid.uuid4().hex}.db")
        shutil.copy(SEED_DB_PATH, db_copy_path)  # copy from same folder as main.py
        session["demo_db_path"] = db_copy_path

    return session["demo_db_path"]


def get_db_session():
    """Return a SQLAlchemy session using demo DB if path starts with /demo/, else main DB."""
    if request.path.startswith("/demo/"):
        db_path = get_demo_db_path()
        demo_engine = create_engine(f"sqlite:///{db_path}", future=True)
        DemoSession = sessionmaker(bind=demo_engine, autoflush=False, autocommit=False)
        return DemoSession()
    return Session()

@app.before_request
def allow_only_specific_url():
    origin = request.headers.get('Origin', '')
    referer = request.headers.get('Referer', '')

    if origin not in [FRONTEND_URL, FRONTEND_URL_DEMO] and referer not in [FRONTEND_URL, FRONTEND_URL_DEMO]:
        return "Requests from this origin are not allowed", 403


@app.route("/", methods=["GET"])
def home():
    if "demo_db_path" not in session:
        return "Demo DB not created yet", 400

    conn = sqlite3.connect(session["demo_db_path"])
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    conn.close()

    return f"API working successfully. Tables in demo DB: {tables} {session['demo_db_path']}"



@app.route("/demo/reset-db", methods=["POST"])
def reset_demo_db():
    old_db_path = session.get("demo_db_path")
    if old_db_path and os.path.exists(old_db_path):
        os.remove(old_db_path)

    session.clear()
    get_demo_db_path()  # creates a fresh copy

    return jsonify({"message": "Demo database has been reset."}), 200

@app.route("/demo/resources", methods=["POST"])
@app.route("/resources", methods=["POST"])
def create_resource():
    data = request.get_json()

    title = data.get("title")
    description = data.get("description", "")
    link = data.get("link")
    thumbnail_url = data.get("thumbnail_url")
    category = data.get("category")
    type = data.get("type")
    upload_user_id = data.get("upload_user_id")

    if not title or not link or not category or not type:
        return jsonify({"message": "Name, type, category and link are required"}), 400

    session = get_db_session()

    try:
        add_resource(session, title, description, link, thumbnail_url, category, type, upload_user_id)
        return jsonify({"message": "Resource uploaded successfully."}), 201
    except ValueError as e:
        return jsonify({"message": "Error uploading resource", "error": str(e)}), 500
    finally:
        session.close()


@app.route("/demo/resources", methods=["GET"])
@app.route("/resources", methods=["GET"])
def get_resources():
    session = get_db_session()

    user_id = request.args.get("user_id")

    resources = fetch_resources(session, user_id=user_id)

    resources.sort(key=lambda x: x.Resource.title)

    resources_data = [{
        "id": resource.Resource.id,
        "title": resource.Resource.title,
        "description": resource.Resource.description,
        "link": resource.Resource.link,
        "thumbnail_url": resource.Resource.thumbnail_url,
        "category_id": resource.Resource.category_id,
        "category_title": resource.category_title,
        "type_id": resource.Resource.type_id,
        "type_title": resource.type_title,
        "upload_user_id": resource.Resource.upload_user_id,
        "created_at": resource.Resource.created_at,
        "featured": resource.Resource.featured,
        "saved": resource.saved
    } for resource in resources]

    session.close()

    return jsonify(resources_data)

@app.route("/demo/resources/<int:resource_id>", methods=["PUT"])
@app.route("/resources/<int:resource_id>", methods=["PUT"])
def update_resource(resource_id):
    data = request.get_json()

    if not resource_id:
        return jsonify({"message": "Resource id is required"}), 400

    title = data.get("title")
    description = data.get("description")
    link = data.get("link")
    thumbnail_url = data.get("thumbnail_url")
    category = data.get("category")
    type = data.get("type")
    featured = data.get("featured")

    session = get_db_session()

    session.close()

    try:
        modify_resource(session, resource_id, title=title, description=description, link=link,
                        thumbnail_url=thumbnail_url, category=category, type=type, featured=featured)
        return jsonify({"message": "Resource updated successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error updating resource", "error": str(e)}), 500
    finally:
        session.close()


@app.route("/demo/resources/<int:resource_id>", methods=["DELETE"])
@app.route("/resources/<int:resource_id>", methods=["DELETE"])
def delete_resource(resource_id):
    session = get_db_session()

    try:
        remove_resource(session, resource_id)
        return jsonify({"message": "Resource deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error deleting resource", "error": str(e)}), 500
    finally:
        session.close()

@app.route("/demo/categories" , methods=["GET"])
@app.route("/categories" , methods=["GET"])
def get_categories():
    session = get_db_session()

    categories = fetch_categories(session)

    categories_list = [{"id": category.id, "title": category.title} for category in categories]

    session.close()

    return jsonify(categories_list)


@app.route("/demo/types" , methods=["GET"])
@app.route("/types" , methods=["GET"])
def get_types():
    session = get_db_session()

    types = fetch_types(session)

    types_list = [{"id": type.id, "title": type.title} for type in types]

    session.close()

    return jsonify(types_list)


@app.route("/demo/types", methods=["POST"])
@app.route("/types", methods=["POST"])
def create_type():
    new_type_title = request.json.get('title', '').strip()

    if not new_type_title:
        return jsonify({"message": "Type title is required"}), 400

    session = get_db_session()

    try:
        add_type(session, new_type_title)
        return jsonify({"message": "Type created successfully."}), 201
    except ValueError as e:
        return jsonify({"message": "Error creating type", "error": str(e)}), 500
    finally:
        session.close()


@app.route("/demo/categories", methods=["POST"])
@app.route("/categories", methods=["POST"])
def create_category():
    new_category_title = request.json.get('title', '').strip()

    if not new_category_title:
        return jsonify({"message": "Category title is required"}), 400

    session = get_db_session()

    try:
        add_category(session, new_category_title)
        return jsonify({"message": "Category created successfully."}), 201
    except ValueError as e:
        return jsonify({"message": "Error creating category", "error": str(e)}), 500
    finally:
        session.close()

@app.route('/demo/users', defaults={'user_id': None}, methods=['GET'])
@app.route('/demo/users/<int:user_id>', methods=['GET'])
@app.route('/users', defaults={'user_id': None}, methods=['GET'])
@app.route('/users/<int:user_id>', methods=['GET'])
def get_users(user_id):
    session = get_db_session()

    users = fetch_users(session, id=user_id)
    users = users if isinstance(users, list) else ([users] if users else [])

    users_list = [{
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role,
        "local_authority": user.local_authority,
        "organisation": user.organisation,
        "organisation_role": user.organisation_role,
        "last_login": user.last_login,
        "logged_in": user.logged_in,
    } for user in users]

    session.close()

    return jsonify(users_list), 200

@app.route('/demo/users/<int:user_id>', methods=["DELETE"])
@app.route('/users/<int:user_id>', methods=["DELETE"])
def delete_user(user_id):
    session = get_db_session()

    try:
        remove_user(session, user_id)
        return jsonify({"message": "User deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error deleting user", "error": str(e)}), 500
    finally:
        session.close()

@app.route('/demo/users', methods=['POST'])
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    referral_code = data.get('referral_code')

    if not email or not password:
        return jsonify({"message": "Email and password is required"}), 400

    session = get_db_session()

    try:
        referral_code_valid = validate_referral_code(session, referral_code)

        if session.query(User).filter_by(email=email).first():
            return jsonify({"message": "Account with this email already exists"}), 401

        if not referral_code_valid:
            return jsonify({"message": "Referral code is invalid"}), 401

        id, role = add_user(session, email, password)

        session.close()

        return jsonify({"message": "Account created successfully", "id": id, "role": role}), 201
    except ValueError as e:
        return jsonify({"message": "Error creating account", "error": str(e)}), 500
    finally:
        session.close()


@app.route('/demo/users/<int:user_id>', methods=['PUT'])
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()

    if not user_id:
        return jsonify({"message": "User id is required"}), 400

    first_name = data.get('first_name')
    last_name = data.get('last_name')
    role = data.get('role')
    local_authority = data.get('local_authority')
    organisation = data.get('organisation')
    organisation_role = data.get('organisation_role')
    logged_in = data.get('logged_in')

    session = get_db_session()

    try:
        modify_user(session, user_id, first_name=first_name, role=role, last_name=last_name,
                    local_authority=local_authority, organisation=organisation, organisation_role=organisation_role,
                    logged_in=logged_in)
        return jsonify({"message": "User updated successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error updating user", "error": str(e)}), 500
    finally:
        session.close()

@app.route('/demo/login', methods=['POST'])
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    session = get_db_session()

    try:
        user = validate_user(session, email, password)
        if user:
            session.close()
            return jsonify({"message": "Login successful", "id": user.id, "role": user.role}), 200
        else:
            session.close()
            return jsonify({"message": "Invalid username or password."}), 401
    except ValueError as e:
        return jsonify({"message": "Error logging in", "error": str(e)}), 500
    finally:
        session.close()

@app.route("/demo/change_password", methods=['PUT'])
@app.route("/change_password", methods=['PUT'])
def change_password():
    data = request.get_json()

    user_id = data.get('user_id')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    session = get_db_session()

    try:
        user = fetch_users(session, id=user_id)
        if validate_user(session, user.email, current_password):
            modify_user(session, user.id, password=new_password)
            return jsonify({"message": "Password changed successfully"}), 200
        else:
            return jsonify({"message": "Current password is incorrect."}), 401
    except ValueError as e:
        return jsonify({"message": "Error changing password", "error": str(e)}), 500
    finally:
        session.close()

@app.route("/demo/reset_password/<string:email>", methods=['GET'])
@app.route("/reset_password/<string:email>", methods=['GET'])
def reset_password(email):
    session = get_db_session()

    try:
        password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
        user = fetch_users(session, email=email)

        html_content = f"""
        <html>
          <body>
            <p>Hi {user.first_name},</p>
            <p>As requested, we've reset your everyFAMILY password.</p>
            <p>Here is your new password: <b>{password}</b></p>
            <p>For security purposes, please log in and change it as soon as possible via the dashboard.</p>
            <br/>
            <span>Have a great day,</span>
            <p>The everyFAMILY Team</p>
          </body>
        </html>
        """

        msg = MIMEText(html_content, 'html')
        msg["Subject"] = "New everyFAMILY password"
        msg["From"] = EMAIL
        msg["To"] = user.email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL, PASSWORD)
            server.send_message(msg)

        modify_user(session, user.id, password=password)
    except ValueError as e:
        session.close()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
    return jsonify({"message": "Password successfully reset"}), 200


@app.route('/demo/referrals', methods=["GET"])
@app.route('/referrals', methods=["GET"])
def get_referral_codes():
    session = get_db_session()

    referral_codes = fetch_referral_codes(session)

    referral_codes_list = [{"id": referral_code.id, "title": referral_code.title, "status": referral_code.status} for referral_code in referral_codes]

    session.close()

    return jsonify(referral_codes_list), 200


@app.route('/demo/referrals', methods=["POST"])
@app.route('/referrals', methods=["POST"])
def create_referral_code():
    session = get_db_session()

    try:
        add_referral_code(session)
        return jsonify({"message": "Referral code created successfully"}), 201
    except ValueError as e:
        return jsonify({"message": "Error creating referral code", "error": str(e)}), 500
    finally:
        session.close()


@app.route('/demo/referrals/<int:referral_id>', methods=["PUT"])
@app.route('/referrals/<int:referral_id>', methods=["PUT"])
def update_referral_code(referral_id):
    data = request.get_json()
    status = data.get('status')
    title = data.get('title')

    if not referral_id:
        return jsonify({"message": "Referral code id is required"}), 400

    session = get_db_session()

    try:
        modify_referral_code(session, referral_id, title=title, status=status)
        return jsonify({"message": "Referral code updated successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error updating referral code", "error": str(e)}), 500
    finally:
        session.close()


@app.route('/demo/referrals/<int:referral_id>', methods=["DELETE"])
@app.route('/referrals/<int:referral_id>', methods=["DELETE"])
def delete_referral_code(referral_id):
    session = get_db_session()

    try:
        remove_referral_code(session, referral_id)
        return jsonify({"message": "Referral code deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error deleting referral code", "error": str(e)}), 500
    finally:
        session.close()

@app.route("/demo/user_resources", methods=["POST"])
@app.route("/user_resources", methods=["POST"])
def create_user_resource():
    data = request.get_json()

    user_id = data.get('user_id')
    resource_id = data.get('resource_id')

    if not user_id or not resource_id:
        return jsonify({"message": "User ID and resource ID is required"}), 400

    session = get_db_session()

    try:
        modify_user_resource(session, user_id, resource_id)
        return jsonify({"message": "Resource saved successfully."}), 201
    except ValueError as e:
        return jsonify({"message": "Error saving resource", "error": str(e)}), 500
    finally:
        session.close()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
