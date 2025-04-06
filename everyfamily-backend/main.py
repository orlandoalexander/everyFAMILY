from flask import Flask, request, jsonify
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
from flask_cors import CORS
import secrets, string, bcrypt, smtplib
from email.mime.text import MIMEText

load_dotenv()

app = Flask(__name__)

allowed_origins = ["https://everyfamily.netlify.app", "https://another-origin.com"]

def get_cors_origin(origin):
    if origin in allowed_origins:
        return origin
    return None  

CORS(app, origins=get_cors_origin, supports_credentials=True)

EMAIL = os.getenv("EMAIL")
PASSWORD = os.getenv("PASSWORD")
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

@app.route("/", methods=["GET"])
def home():
    return "API working successfully"


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

    if not title or not link or not thumbnail_url or not category or not type:
        return jsonify({"message": "Title, link, thumbnail, category and type is required"}), 400

    session = Session()

    try:
        add_resource(session, title, description, link, thumbnail_url, category, type, upload_user_id)
        return jsonify({"message": "Resource uploaded successfully."}), 201
    except ValueError as e:
        return jsonify({"message": "Error uploading resource", "error": str(e)}), 500
    finally:
        session.close()


@app.route("/resources", methods=["GET"])
def get_resources():
    session = Session()

    user_id = request.args.get("user_id")

    resources = fetch_resources(session, user_id=user_id)

    resources.sort(key=lambda x: x.Resource.created_at, reverse=True)

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

@app.route("/resources/<int:resource_id>", methods=["PUT"])
def update_resource(resource_id):
    data = request.get_json()

    if not resource_id:
        return jsonify({"message": "Resource id is required"}), 400

    title = data.get("title")
    description = data.get("description", "")
    link = data.get("link")
    thumbnail_url = data.get("thumbnail_url")
    category = data.get("category")
    type = data.get("type")
    featured = data.get("featured")

    session = Session()

    session.close()

    try:
        modify_resource(session, resource_id, title=title, description=description, link=link,
                        thumbnail_url=thumbnail_url, category=category, type=type, featured=featured)
        return jsonify({"message": "Resource updated successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error updating resource", "error": str(e)}), 500
    finally:
        session.close()


@app.route("/resources/<int:resource_id>", methods=["DELETE"])
def delete_resource(resource_id):
    session = Session()

    try:
        remove_resource(session, resource_id)
        return jsonify({"message": "Resource deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error deleting resource", "error": str(e)}), 500
    finally:
        session.close()

@app.route("/categories" , methods=["GET"])
def get_categories():
    session = Session()

    categories = fetch_categories(session)

    categories_list = [{"id": category.id, "title": category.title} for category in categories]

    session.close()

    return jsonify(categories_list)


@app.route("/types" , methods=["GET"])
def get_types():
    session = Session()

    types = fetch_types(session)

    types_list = [{"id": type.id, "title": type.title} for type in types]

    session.close()

    return jsonify(types_list)


@app.route("/types", methods=["POST"])
def create_type():
    new_type_title = request.json.get('title', '').strip()

    if not new_type_title:
        return jsonify({"message": "Type title is required"}), 400

    session = Session()

    try:
        add_type(session, new_type_title)
        return jsonify({"message": "Type created successfully."}), 201
    except ValueError as e:
        return jsonify({"message": "Error creating type", "error": str(e)}), 500
    finally:
        session.close()


@app.route("/categories", methods=["POST"])
def create_category():
    new_category_title = request.json.get('title', '').strip()

    if not new_category_title:
        return jsonify({"message": "Category title is required"}), 400

    session = Session()

    try:
        add_category(session, new_category_title)
        return jsonify({"message": "Category created successfully."}), 201
    except ValueError as e:
        return jsonify({"message": "Error creating category", "error": str(e)}), 500
    finally:
        session.close()

@app.route('/users', defaults={'user_id': None}, methods=['GET'])
@app.route('/users/<int:user_id>', methods=['GET'])
def get_users(user_id):
    session = Session()

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

@app.route('/users/<int:user_id>', methods=["DELETE"])
def delete_user(user_id):
    session = Session()

    try:
        remove_user(session, user_id)
        return jsonify({"message": "User deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error deleting user", "error": str(e)}), 500
    finally:
        session.close()

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    referral_code = data.get('referral_code')

    if not email or not password:
        return jsonify({"message": "Email and password is required"}), 400

    session = Session()

    try:
        referral_code_valid = validate_referral_code(session, referral_code)

        if session.query(User).filter_by(email=email).first():
            return jsonify({"message": "Account with this email already exists"}), 400

        if not referral_code_valid:
            return jsonify({"message": "Referral code is invalid"}), 400

        id, role = add_user(session, email, password)

        session.close()

        return jsonify({"message": "Account created successfully", "id": id, "role": role}), 201
    except ValueError as e:
        return jsonify({"message": "Error creating account", "error": str(e)}), 500
    finally:
        session.close()


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

    session = Session()

    try:
        modify_user(session, user_id, first_name=first_name, role=role, last_name=last_name,
                    local_authority=local_authority, organisation=organisation, organisation_role=organisation_role,
                    logged_in=logged_in)
        return jsonify({"message": "User updated successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error updating user", "error": str(e)}), 500
    finally:
        session.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    session = Session()

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

@app.route("/change_password", methods=['PUT'])
def change_password():
    data = request.get_json()

    user_id = data.get('user_id')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    session = Session()

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

@app.route("/reset_password/<string:email>", methods=['GET'])
def reset_password(email):
    session = Session()

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


@app.route('/referrals', methods=["GET"])
def get_referral_codes():
    session = Session()

    referral_codes = fetch_referral_codes(session)

    referral_codes_list = [{"id": referral_code.id, "title": referral_code.title, "status": referral_code.status} for referral_code in referral_codes]

    session.close()

    return jsonify(referral_codes_list), 200


@app.route('/referrals', methods=["POST"])
def create_referral_code():
    session = Session()

    try:
        add_referral_code(session)
        return jsonify({"message": "Referral code created successfully"}), 201
    except ValueError as e:
        return jsonify({"message": "Error creating referral code", "error": str(e)}), 500
    finally:
        session.close()


@app.route('/referrals/<int:referral_id>', methods=["PUT"])
def update_referral_code(referral_id):
    data = request.get_json()
    status = data.get('status')
    title = data.get('title')

    if not referral_id:
        return jsonify({"message": "Referral code id is required"}), 400

    session = Session()

    try:
        modify_referral_code(session, referral_id, title=title, status=status)
        return jsonify({"message": "Referral code updated successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error updating referral code", "error": str(e)}), 500
    finally:
        session.close()


@app.route('/referrals/<int:referral_id>', methods=["DELETE"])
def delete_referral_code(referral_id):
    session = Session()

    try:
        remove_referral_code(session, referral_id)
        return jsonify({"message": "Referral code deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"message": "Error deleting referral code", "error": str(e)}), 500
    finally:
        session.close()

@app.route("/user_resources", methods=["POST"])
def create_user_resource():
    data = request.get_json()

    user_id = data.get('user_id')
    resource_id = data.get('resource_id')

    if not user_id or not resource_id:
        return jsonify({"message": "User ID and resource ID is required"}), 400

    session = Session()

    try:
        modify_user_resource(session, user_id, resource_id)
        return jsonify({"message": "Resource saved successfully."}), 201
    except ValueError as e:
        return jsonify({"message": "Error saving resource", "error": str(e)}), 500
    finally:
        session.close()


if __name__ == "__main__":
    app.run(port=5001, debug=True)
