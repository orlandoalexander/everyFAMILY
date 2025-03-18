from flask import Flask, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.link_model import Link
from dotenv import load_dotenv
import os

load_dotenv()

db_host = os.getenv("DATABASE_HOST")
db_user = os.getenv("DATABASE_USER")
db_password = os.getenv("DATABASE_PASSWORD")
db_name = os.getenv("DATABASE_NAME")

app = Flask(__name__)

DATABASE_URL = f"mysql+pymysql://{db_host}:{db_password}@{db_host}/{db_name}"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

@app.route("/", methods=["GET"])
def home():
    return "API working successfully"


@app.route("/upload", methods=["POST"])
def upload_link():
    data = request.get_json()
    title = data.get("title")  # New field for Title
    web_link = data.get("web_link")  # New field for Web Link
    name = data.get("name")  # Foreign key for Category
    upload_user = data.get("upload_user")  # Updated field for User

    session = Session()
    from models.category_model import create_category

    # Check if category exists and create if not
    create_category(session, name)

    new_link = Link(title=title, web_link=web_link, category_id=name, upload_user=upload_user)
    session.add(new_link)
    session.commit()
    session.close()

    return jsonify({"message": "Link uploaded successfully!"}), 201

if __name__ == "__main__":
    app.run(port=5001, debug=True)  # Changed port to 5001
