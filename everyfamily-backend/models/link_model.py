from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Link(Base):
    __tablename__ = 'Content'

    content_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)  # New field for Title
    web_link = Column(String, nullable=False)  # New field for Web Link
    category_id = Column(Integer, nullable=False)  # Foreign key for Category
    upload_user = Column(String, nullable=False)  # Updated field for User
    created_on = Column(DateTime, default=datetime.utcnow)  # Updated field for Created On
    status = Column(String, default='success')

    def __repr__(self):
        return f"<Link(id={self.id}, url={self.url}, category={self.category}, user={self.user}, upload_time={self.upload_time}, status={self.status})>"
