from flask import Flask, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.resource_model import *
from models.category_model import *
from models.type_model import *
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
    description = data.get("description")
    link = data.get("link")
    category = data.get("category")
    type = data.get("type")
    upload_user_id = data.get("upload_user_id")

    session = Session()

    # Check if category and type exists and create if not
    category_id = create_category(session, category)
    type_id = create_type(session, type)

    new_resource = Resource(title=title, description=description, link=link, category_id=category_id, type_id=type_id, upload_user_id=upload_user_id)
    session.add(new_resource)
    session.commit()
    session.close()

    return jsonify({"message": "Resource uploaded successfully!"}), 201


@app.route("/resources", methods=["GET"])
def get_resources():
    session = Session()

    # Perform a join between Resource and Category tables
    resources = fetch_resources(session)

    # Convert to JSON format
    resources_data = [{
        "resource_id": resource.Resource.resource_id,
        "title": resource.Resource.title,
        "description": resource.Resource.description,
        "link": resource.Resource.link,
        "category_id": resource.Resource.category_id,
        "category_title": resource.category_title,
        "type_id": resource.Resource.type_id,
        "type_title": resource.type_title,
        "upload_user_id": resource.Resource.upload_user_id,
        "created_on": resource.Resource.created_on,
        "status": resource.Resource.status
    } for resource in resources]

    session.close()

    return jsonify(resources_data)


@app.route("/categories" , methods=["GET"])
def get_categories():
    session = Session()

    categories = fetch_categories(session)

    categories_data = [{
        "category_id": category.category_id,
        "title": category.title
    } for category in categories]

    session.close()

    return jsonify(categories_data)


if __name__ == "__main__":
    app.run(port=5001, debug=True)  # Changed port to 5001
