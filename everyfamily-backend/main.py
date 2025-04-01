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

load_dotenv()

app = Flask(__name__)

CORS(app)

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

    add_resource(session, title, description, link, thumbnail_url, category, type, upload_user_id)

    session.close()

    return jsonify({"message": "Resource uploaded successfully!"}), 201


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

    modify_resource(session, resource_id, title, description, link, thumbnail_url, category, type, featured)
    session.close()
    return jsonify({"message": "Resource updated successfully"}), 200


@app.route("/resources/<int:resource_id>", methods=["DELETE"])
def delete_resource(resource_id):
    session = Session()

    try:
        remove_resource(session, resource_id)
    except ValueError as e:
        session.close()
        return jsonify({"error": str(e)}), 500

    session.close()
    return jsonify({"message": "Resource deleted successfully"}), 200

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

    add_type(session, new_type_title)

    session.close()
    return jsonify({"message": "Type created successfully."}), 201


@app.route("/categories", methods=["POST"])
def create_category():
    new_category_title = request.json.get('title', '').strip()

    if not new_category_title:
        return jsonify({"message": "Category title is required"}), 400

    session = Session()

    add_category(session, new_category_title)

    session.close()
    return jsonify({"message": "Category created successfully."}), 201

@app.route('/users', methods=['GET'])
def get_users():
    session = Session()

    users = fetch_users(session)

    users_list = [{
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role,
        "local_authority": user.local_authority,
        "organisation": user.organisation,
        "organisation_role": user.organisation_role
    } for user in users]

    session.close()

    return jsonify(users_list), 200

@app.route('/users/<int:user_id>', methods=["DELETE"])
def delete_user(user_id):
    session = Session()

    try:
        remove_user(session, user_id)
    except ValueError as e:
        session.close()
        return jsonify({"error": str(e)}), 500

    session.close()

    return jsonify({"message": "User deleted successfully"}), 200

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    referral_code = data.get('referral_code')

    if not email or not password:
        return jsonify({"message": "Email and password is required"}), 400

    session = Session()

    referral_code_valid = validate_referral_code(session, referral_code)

    if session.query(User).filter_by(email=email).first():
        return jsonify({"message": "Account with this email already exists"}), 400

    if not referral_code_valid:
        return jsonify({"message": "Referral code is not valid"}), 400

    id, role = add_user(session, email, password)

    session.close()

    return jsonify({"message": "Account created successfully", "id": id, "role": role }), 201

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

    session = Session()

    try:
        modify_user(session, user_id, first_name, last_name, role, local_authority, organisation, organisation_role)
    except ValueError as e:
        session.close()
        return jsonify({"error": str(e)}), 404

    return jsonify({"message": "User updated successfully"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    session = Session()

    if validate_user(session, email, password):
        session.close()
        # TODO add to logins table
        return jsonify({"message": "Login successful"}), 200
    else:
        session.close()
        return jsonify({"message": "Invalid email or password"}), 401


@app.route('/referrals', methods=["GET"])
def get_referral_codes():
    session = Session()

    referral_codes = fetch_referral_codes(session)

    referral_codes_list = [{"id": referral_code.id, "title": referral_code.title, "status": referral_code.status} for referral_code in referral_codes]

    session.close()

    return jsonify(referral_codes_list), 200


@app.route('/referrals', methods=["POST"])
def create_referral_code():
    data = request.get_json()

    title = data.get('title')

    if not title:
        return jsonify({"message": "Referral code is required"}), 400

    session = Session()

    add_referral_code(session, title)

    return jsonify({"message": "Referral code created successfully"}), 201


@app.route('/referrals/<int:referral_id>', methods=["PUT"])
def update_referral_code(referral_id):
    data = request.get_json()
    status = data.get('status')

    if not referral_id:
        return jsonify({"message": "Referral code id is required"}), 400

    session = Session()

    try:
        modify_referral_code(session, referral_id, status)
    except ValueError as e:
        session.close()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Referral code updated successfully"}), 200


@app.route('/referrals/<int:referral_id>', methods=["DELETE"])
def delete_referral_code(referral_id):
    session = Session()

    try:
        remove_referral_code(session, referral_id)
    except ValueError as e:
        session.close()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Referral code deleted successfully"}), 200


@app.route("/user_resources", methods=["POST"])
def create_user_resource():
    data = request.get_json()

    user_id = data.get('user_id')
    resource_id = data.get('resource_id')

    if not user_id or not resource_id:
        return jsonify({"message": "User ID and resource ID is required"}), 400

    session = Session()

    modify_user_resource(session, user_id, resource_id)

    session.close()
    return jsonify({"message": "Resource saved successfully."}), 201

if __name__ == "__main__":
    app.run(port=5001, debug=True)
