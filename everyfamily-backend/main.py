from flask import Flask, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.resource_model import *
from models.category_model import *
from models.referral_model import *
from models.type_model import *
from models.user_model import *
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
def upload_resource():
    data = request.get_json()
    title = data.get("title")
    description = data.get("description", "")
    link = data.get("link")
    thumbnail_url = data.get("thumbnail_url")
    category = data.get("category")
    type = data.get("type")
    upload_user_id = data.get("upload_user_id")

    session = Session()

    # Check if category and type exists and create if not
    category_id = add_category(session, category)
    type_id = add_type(session, type)

    new_resource = Resource(title=title, description=description, link=link, thumbnail_url=thumbnail_url, category_id=category_id, type_id=type_id, upload_user_id=upload_user_id)
    session.add(new_resource)
    session.commit()
    session.close()

    return jsonify({"message": "Resource uploaded successfully!"}), 201


@app.route("/resources", methods=["GET"])
def get_resources():
    session = Session()

    # Perform a join between Resource and Category tables
    resources = fetch_resources(session)

    resources.sort(key=lambda x: x.Resource.created_on, reverse=True)

    # Convert to JSON format
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
        "created_on": resource.Resource.created_on,
    } for resource in resources]

    session.close()

    return jsonify(resources_data)


@app.route("/categories" , methods=["GET"])
def get_categories():
    session = Session()

    categories = fetch_categories(session)

    categories_data = [{
        "id": category.id,
        "title": category.title
    } for category in categories]

    session.close()

    return jsonify(categories_data)


@app.route("/types" , methods=["GET"])
def get_types():
    session = Session()

    types = fetch_types(session)

    types_data = [{
        "id": type.id,
        "title": type.title
    } for type in types]

    session.close()

    return jsonify(types_data)

@app.route("/types", methods=["POST"])
def create_type():
    session = Session()

    new_type_title = request.json.get('title', '').strip()

    add_type(session, new_type_title)

    session.close()
    return jsonify({"message": "Type created successfully."}), 201


@app.route("/categories", methods=["POST"])
def create_category():
    session = Session()

    new_category_title = request.json.get('title', '').strip()

    add_category(session, new_category_title)

    session.close()
    return jsonify({"message": "Category created successfully."}), 201


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    referral_code = data.get('referral_code')

    session = Session()

    referral_code_valid = validate_referral_code(session, referral_code)

    if session.query(User).filter_by(email=email).first():
        return jsonify({"message": "Account with this email already exists"}), 400

    if not referral_code_valid:
        return jsonify({"message": "Referral code is not valid"}), 400

    user_id = add_user(session, email, password)

    session.close()

    return jsonify({"message": "Account created successfully", "user_id": user_id}), 201

@app.route('/user', methods=['PUT'])
def modify_user():
    data = request.get_json()

    user_id = data.get('id')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    role = data.get('role')
    local_authority = data.get('local_authority')
    organisation = data.get('organisation')
    organisation_role = data.get('organisation_role')

    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    session = Session()
    user = session.query(User).filter_by(id=user_id).first()

    if not user:
        session.close()
        return jsonify({"message": "User not found"}), 404

    if first_name is not None:
        user.first_name = first_name
    if last_name is not None:
        user.last_name = last_name
    if role is not None:
        user.role = role
    if local_authority is not None:
        user.local_authority = local_authority
    if organisation is not None:
        user.organisation = organisation
    if organisation_role is not None:
        user.organisation_role = organisation_role

    session.commit()
    session.close()

    return jsonify({"message": "User updated successfully"}), 200

@app.route('/signin', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    session = Session()

    if validate_user(session, email, password):
        session.close()
        return jsonify({"message": "Login successful"}), 200
    else:
        session.close()
        return jsonify({"message": "Invalid email or password"}), 401


if __name__ == "__main__":
    app.run(port=5001, debug=True)
