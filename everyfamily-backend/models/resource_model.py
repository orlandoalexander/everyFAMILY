from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, case
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from . import Base
from .category_model import Category  # Import Category model
from .type_model import Type  # Import Type model
from .user_resource_model import UserResource

class Resource(Base):
    __tablename__ = 'resources'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    link = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    type_id = Column(Integer, ForeignKey('types.id'), nullable=False)
    upload_user_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    thumbnail_url = Column(String, nullable=False)
    featured = Column(Boolean, nullable=True, default=False)

    # Relationships
    category = relationship(Category, back_populates="resources")
    type = relationship("Type", back_populates="resources")
    user_resources = relationship("UserResource", back_populates="resource")

    def __repr__(self):
        return f"<Resource(id={self.id}, title={self.title}, description={self.description}, link={self.link}, category_id={self.category_id}>"

def fetch_resources(session, user_id=None, resource_id=None):
    if resource_id:
        return session.query(Resource).get(resource_id)

    query = (
        session.query(
            Resource,
            Category.title.label('category_title'),
            Type.title.label('type_title'),
            case(
                (UserResource.user_id == user_id, True),
                else_=False
            ).label('saved')
        )
        .join(Category, Resource.category_id == Category.id)
        .join(Type, Resource.type_id == Type.id)
        .outerjoin(UserResource, Resource.id == UserResource.resource_id)
    )

    resources = query.all()

    return resources