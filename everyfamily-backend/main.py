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
def modify_resource(resource_id):
    data = request.get_json()
    
    session = Session()
    resource = session.query(Resource).filter_by(id=resource_id).first()

    if not resource:
        session.close()
        return jsonify({"message": "Resource not found"}), 404

    # Update fields if provided
    if data.get("title") is not None:
        resource.title = data["title"]
    if data.get("description") is not None:
        resource.description = data["description"]
    if data.get("link") is not None:
        resource.link = data["link"]
    if data.get("thumbnail_url") is not None:
        resource.thumbnail_url = data["thumbnail_url"]
    if data.get("category") is not None:
        resource.category_id = add_category(session, data["category"])
    if data.get("type") is not None:
        resource.type_id = add_type(session, data["type"])
    if data.get("upload_user_id") is not None:
        resource.upload_user_id = data["upload_user_id"]
    if data.get("featured") is not None:
        resource.featured = data["featured"]

    session.commit()
    session.close()
    return jsonify({"message": "Resource updated successfully"}), 200


@app.route("/resources/<int:resource_id>", methods=["DELETE"])
def delete_resource(resource_id):
    if not resource_id:
        return jsonify({"message": "Resource id is required"}), 400

    session = Session()
    resource = fetch_resources(session,resource_id=resource_id)

    if not resource:
        session.close()
        return jsonify({"message": "Resource not found"}), 404

    session.delete(resource)
    session.commit()
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
        return jsonify({"message": "Type is required"}), 400

    session = Session()

    add_type(session, new_type_title)

    session.close()
    return jsonify({"message": "Type created successfully."}), 201


@app.route("/categories", methods=["POST"])
def create_category():
    new_category_title = request.json.get('title', '').strip()

    if not new_category_title:
        return jsonify({"message": "Type is required"}), 400

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

    user = fetch_users(session, user_id=user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    session.delete(user)
    session.commit()
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

    user_id = add_user(session, email, password)

    session.close()

    return jsonify({"message": "Account created successfully", "user_id": user_id}), 201

@app.route('/users', methods=['PUT'])
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
    user = get_users(session, user_id)

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

    new_referral_code_title = data.get('title')

    if not new_referral_code_title:
        return jsonify({"message": "Referral code is required"}), 400

    session = Session()

    add_referral_code(session, new_referral_code_title)

    return jsonify({"message": "Referral code created successfully"}), 201


@app.route('/referrals/<int:referral_id>', methods=["PUT"])
def update_referral_code(referral_id):
    data = request.get_json()
    status = data.get('status')

    if not status:
        return jsonify({"message": "Status is required"}), 400

    session = Session()

    referral_code = fetch_referral_codes(session, referral_id=referral_id)

    if not referral_code:
        return jsonify({"message": "Referral code not found"}), 404

    referral_code.status = status
    session.commit()
    session.close()

    return jsonify({"message": "Referral code status updated successfully"}), 200


@app.route('/referrals/<int:referral_id>', methods=["DELETE"])
def delete_referral_code(referral_id):
    session = Session()

    referral_code = fetch_referral_codes(session, referral_id=referral_id)

    if not referral_code:
        return jsonify({"message": "Referral code not found"}), 404

    session.delete(referral_code)
    session.commit()
    session.close()

    return jsonify({"message": "Referral code deleted successfully"}), 200


@app.route("/user_resources", methods=["POST"])
def create_user_resource():
    data = request.get_json()

    user_id = data.get('user_id')
    resource_id = data.get('resource_id')

    if not user_id or not resource_id:
        return jsonify({"message": "User ID and resource ID is required"}), 400

    session = Session()

    add_user_resource(session, user_id, resource_id)

    session.close()
    return jsonify({"message": "Resource saved successfully."}), 201


if __name__ == "__main__":
    app.run(port=5001, debug=True)
