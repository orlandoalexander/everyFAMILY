from sqlalchemy import Column, Integer, String
from . import Base

class Referral(Base):
    __tablename__ = 'referrals'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, unique=True, nullable=False, default='')
    status = Column(String, nullable=False, default='Active')

    def __repr__(self):
        return f"<Referral(id={self.id}, title={self.title}, status={self.status}>"

def fetch_referral_codes(session):
    return session.query(Referral).all()

def validate_referral_code(session, referral_code_title):
    referral_code = session.query(Referral).filter_by(title=referral_code_title, status="Active").first()
    return bool(referral_code)

def add_referral_code(session):
    new_referral_code = Referral()
    session.add(new_referral_code)
    session.commit()
    return new_referral_code.id

def modify_referral_code(session, id, title=None, status=None):
    referral_code = session.query(Referral).get(id)

    if not referral_code:
        raise ValueError(f"Referral code with ID {id} does not exist.")

    if status:
        referral_code.status = status

    if title:
        referral_code.title = title

    session.commit()


def remove_referral_code(session, id):
    referral_code = session.query(Referral).get(id)

    if not referral_code:
        raise ValueError(f"Referral code with ID {id} does not exist.")

    session.delete(referral_code)
    session.commit()

