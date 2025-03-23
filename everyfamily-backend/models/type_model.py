from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from . import Base

class Type(Base):
    __tablename__ = 'types'

    type_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, unique=True, nullable=False)

    # Back-reference to Resource
    resources = relationship("Resource", back_populates="type")

    def __repr__(self):
        return f"<Type(id={self.id}, title={self.title}>"

def fetch_types(session):
    return session.query(Type).all()

def add_type(session, type_title):
    type = session.query(Type).filter_by(title=type_title).first()
    if not type:
        new_type = Type(title=type_title)
        session.add(new_type)
        session.commit()
        return new_type.type_id
    return type.type_id