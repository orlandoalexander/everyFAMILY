from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from . import Base

class Referral(Base):
    __tablename__ = 'referrals'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, unique=True, nullable=False)
    status = Column(String, nullable=False, default='active')

    def __repr__(self):
        return f"<Referral(id={self.id}, title={self.title}, status={self.status}>"

def fetch_referral_codes(session):
    return session.query(Referral).all()

def validate_referral_code(session, referral_code_title):
    referral_code = session.query(Referral).filter_by(title=referral_code_title, status="active").first()
    return bool(referral_code)

def add_referral_code(session, referral_code_title):
    referral_code = session.query(Referral).filter_by(title=referral_code_title).first()
    if not referral_code:
        new_referral_code = Referral(title=referral_code_title)
        session.add(new_referral_code)
        session.commit()
        return new_referral_code.id
    return referral_code.id

def modify_referral_code(session, id, status=None):
    referral_code = session.query(Referral).get(id)

    if not referral_code:
        raise ValueError(f"Referral code with ID {id} does not exist.")

    if status:
        referral_code.status = status

    session.commit()


def remove_referral_code(session, id):
    referral_code = session.query(Referral).get(id)

    if not referral_code:
        raise ValueError(f"Referral code with ID {id} does not exist.")

    session.delete(referral_code)
    session.commit()

