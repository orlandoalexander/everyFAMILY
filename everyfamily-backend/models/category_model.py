from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from . import Base

class Category(Base):
    __tablename__ = 'categories'

    category_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, unique=True, nullable=False)

    # Back-reference to Resource
    resources = relationship("Resource", back_populates="category")

    def __repr__(self):
        return f"<Category(category_id={self.category_id}, name={self.title})>"

def create_category(session, category_title):
    category = session.query(Category).filter_by(title=category_title).first()
    if not category:
        new_category = Category(title=category_title)
        session.add(new_category)
        session.commit()
        return new_category.category_id
    return category.category_id

def fetch_categories(session):
    return session.query(Category).all()
