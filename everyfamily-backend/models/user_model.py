from sqlalchemy import Column, Integer, String, DateTime, Boolean, func
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy.orm import relationship
from .user_resource_model import UserResource
from .resource_model import Resource
from . import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    role = Column(String, nullable=True, default='champion')
    local_authority = Column(String, nullable=True)
    organisation = Column(String, nullable=True)
    organisation_role = Column(String, nullable=True)
    last_login = Column(DateTime, nullable=True)
    logged_in = Column(Boolean, nullable=True)

    user_resources = relationship("UserResource", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, first_name={self.first_name}, last_name={self.last_name})>"

def fetch_users(session, id=None, email=None):
    if id:
        return session.query(User).get(id)
    elif email:
        return session.query(User).filter_by(email=email).first()
    return session.query(User).all()

def validate_user(session, email, password):
    user = session.query(User).filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        user.last_login = func.now()
        user.logged_in = True
        session.commit()
        session.refresh(user)
        return user
    return False

def add_user(session, email, password, first_name=None, last_name=None, role=None, local_authority=None, organisation=None, organisation_role=None):
    user = session.query(User).filter_by(email=email).first()
    if not user:
        hashed_password = generate_password_hash(password)
        new_user = User(
            email=email,
            password=hashed_password,
            first_name=first_name,
            last_name=last_name,
            role=role,
            local_authority=local_authority,
            organisation=organisation,
            organisation_role=organisation_role,
            last_login=func.now(),
            logged_in=True
        )
        session.add(new_user)
        session.commit()
        return new_user.id, new_user.role

    return user.id, user.role

def modify_user(session, id, email=None, password=None, first_name=None, last_name=None, role=None, local_authority=None, organisation=None, organisation_role=None, logged_in=None):
    user = session.query(User).filter_by(id=id).first()

    if not user:
        raise ValueError(f"User with ID {id} does not exist.")

    if email is not None:
        user.email = email
    if password is not None:
        user.password = generate_password_hash(password)
    if first_name is not None:
        user.first_name = first_name
    if last_name is not None:
        user.last_name = last_name
    if role is not None:
        user.role = role
    if local_authority is not None:
        user.local_authority = local_authority
    if organisation is not None:
        user.organisation = organisation
    if organisation_role is not None:
        user.organisation_role = organisation_role
    if logged_in is not None:
        user.logged_in = logged_in

    session.commit()


def remove_user(session, id):
    user = session.query(User).get(id)

    if not user:
        raise ValueError(f"User with ID {id} does not exist.")

    session.query(UserResource).filter_by(user_id=id).delete()
    session.query(Resource).filter_by(upload_user_id=id).update({"upload_user_id": None})

    session.delete(user)
    session.commit()