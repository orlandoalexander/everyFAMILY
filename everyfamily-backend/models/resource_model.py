from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, case
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from . import Base
from models.category_model import *
from models.type_model import *
from .category_model import Category
from .type_model import Type
from .user_resource_model import UserResource

class Resource(Base):
    __tablename__ = 'resources'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    link = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    type_id = Column(Integer, ForeignKey('types.id'), nullable=False)
    upload_user_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    thumbnail_url = Column(String, nullable=True)
    featured = Column(Boolean, nullable=True, default=False)

    # Relationships
    category = relationship("Category", back_populates="resources")
    type = relationship("Type", back_populates="resources")
    user_resources = relationship("UserResource", back_populates="resource", cascade='all, delete')

    def __repr__(self):
        return f"<Resource(id={self.id}, title={self.title}, description={self.description}, link={self.link}, category_id={self.category_id}>"


def fetch_resources(session, user_id=None):
    query = (
        session.query(
            Resource,
            Category.title.label('category_title'),
            Type.title.label('type_title'),
            func.max(
                case(
                    (UserResource.user_id == user_id, True),
                    else_=False
                )
            ).label('saved')  # Use aggregation to determine if the resource is saved by the user
        )
        .join(Category, Resource.category_id == Category.id)
        .join(Type, Resource.type_id == Type.id)
        .outerjoin(UserResource, Resource.id == UserResource.resource_id)
        .group_by(Resource.id, Category.title, Type.title)  # Group by Resource and related columns
    )

    resources = query.all()

    return resources

def add_resource(session, title, description, link, thumbnail_url, category, type, upload_user_id):
    category_id = add_category(session, category)

    type_id = add_type(session, type)

    new_resource = Resource(
        title=title,
        description=description,
        link=link,
        thumbnail_url=thumbnail_url,
        category_id=category_id,
        type_id=type_id,
        upload_user_id=upload_user_id
    )

    session.add(new_resource)
    session.commit()

    return new_resource.id, new_resource.title

def modify_resource(session, id, title=None, description=None, link=None, thumbnail_url=None, category=None, type=None, featured=None):
    resource = session.query(Resource).filter_by(id=id).first()

    if not resource:
        return ValueError(f"Resource with ID {id} does not exist.")

    if title is not None:
        resource.title = title
    if description is not None:
        resource.description = description
    if link is not None:
        resource.link = link
    if category is not None:
        resource.category_id = add_category(session, category)
    if type is not None:
        resource.type_id = add_type(session, type)
    if featured is not None:
        resource.featured = featured
    resource.thumbnail_url = thumbnail_url # set even if null as can set thumbnail url to be null

    session.commit()

    return None


def remove_resource(session, id):
    resource = session.query(Resource).get(id)

    if not resource:
        raise ValueError(f"Resource with ID {id} does not exist.")

    session.delete(resource)
    session.commit()



