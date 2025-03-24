from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from . import Base

class UserResource(Base):
    __tablename__ = 'user_resources'

    id = Column(Integer, primary_key=True, autoincrement=True)
    resource_id = Column(Integer, ForeignKey('resources.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    # Back-reference to Resource and User
    resource = relationship("Resource", back_populates="user_resources")
    user = relationship("User", back_populates="user_resources")

    def __repr__(self):
        return f"<UserResource(id={self.id}, user_id={self.user_id}, resource_id={self.resource_id})>"

def add_user_resource(session, user_id, resource_id):
    existing = session.query(UserResource).filter_by(user_id=user_id, resource_id=resource_id).first()
    if not existing:
        new_user_resource = UserResource(user_id=user_id, resource_id=resource_id)
        session.add(new_user_resource)
        session.commit()
        return new_user_resource

