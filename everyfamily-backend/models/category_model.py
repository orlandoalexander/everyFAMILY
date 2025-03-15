from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Category(Base):
    __tablename__ = 'Category'

    category_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, unique=True, nullable=False)

    def __repr__(self):
        return f"<Category(category_id={self.category_id}, name={self.title})>"

def create_category(session, category_name):
    category = session.query(Category).filter_by(title=category_name).first()
    if not category:
        new_category = Category(title=category_name)
        session.add(new_category)
        session.commit()
        return new_category
    return category
