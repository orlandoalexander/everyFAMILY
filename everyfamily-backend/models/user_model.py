from sqlalchemy import Column, Integer, String
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy.orm import relationship
from . import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    role = Column(String, nullable=True)
    local_authority = Column(String, nullable=True)
    organisation = Column(String, nullable=True)
    organisation_role = Column(String, nullable=True)

    user_resources = relationship("UserResource", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, first_name={self.first_name}, last_name={self.last_name})>"

def fetch_users(session, user_id=None):
    if user_id:
        return session.query(User).get(user_id)
    return session.query(User).all()

def validate_user(session, email, password):
    user = session.query(User).filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        return True
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
            organisation_role=organisation_role
        )
        session.add(new_user)
        session.commit()
        return new_user.id

    return user.id

