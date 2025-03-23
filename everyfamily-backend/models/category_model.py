from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from . import Base

class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, unique=True, nullable=False)

    # Back-reference to Resource
    resources = relationship("Resource", back_populates="category")

    def __repr__(self):
        return f"<Category(id={self.id}, title={self.title})>"

def add_category(session, category_title):
    category = session.query(Category).filter_by(title=category_title).first()
    if not category:
        new_category = Category(title=category_title)
        session.add(new_category)
        session.commit()
        return new_category.id
    return category.id

def fetch_categories(session):
    return session.query(Category).all()
