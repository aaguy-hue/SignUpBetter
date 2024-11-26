from typing import List

from sqlalchemy.orm import Mapped, mapped_column
from flask_login import UserMixin
from app.extensions import db


class User(UserMixin, db.Model):
    __tablename__ = 'user'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(db.String(100), unique=True)
    password: Mapped[str] = mapped_column(db.String(100))
    signups: Mapped[List['Signup']] = db.relationship(back_populates='owner') # owner of each sign up that corresponds to the user
    signed_up_slots: Mapped[List['SignupSlot']] = db.relationship(
        secondary='signup_slot_user',
        back_populates='users'
    )
