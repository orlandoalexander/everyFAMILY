from flask import Flask, request, jsonify
from models.link_model import Link
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import link_model

app = Flask(__name__)

# Database setup
DATABASE_URL = "mysql+pymysql://root:3v3ryF%40m1ly@35.197.229.65/everyfamily"  # Updated with actual database URL
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

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
