import datetime
from typing import List

from sqlalchemy.orm import Mapped, mapped_column
from app.extensions import db
from app.models.auth import User
from app.signups.create_signup import InvalidDayError, SignupType, SignupSortingMethod, CommentingStatus

class SignupSlot(db.Model):
    __tablename__ = 'signup_slot'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(50))
    location: Mapped[str] = mapped_column(db.String(50))
    details: Mapped[str] = mapped_column(db.String(200))
    time: Mapped[datetime.time] = mapped_column()  # Stored in HH:MM:SS format
    date: Mapped[datetime.date] = mapped_column()  # Stored in YYYY-MM-DD format
    day: Mapped[str] = mapped_column(db.String(10))
    signUpLimit: Mapped[int] = mapped_column(db.SmallInteger())
    
    signup_id: Mapped[int] = mapped_column(db.Integer, db.ForeignKey('signup.id'))
    signup: Mapped['Signup'] = db.relationship(back_populates='slots')
    users: Mapped[List['User']] = db.relationship(secondary='signup_slot_user', back_populates='signed_up_slots')
    
    def __init__(self, name: str, signUpLimit: int, details: str, location: str, time: datetime.time, date: datetime.date, day: str):                
        self.name = name
        self.details = details
        self.location = location
        self.time = time
        self.signUpLimit = signUpLimit
        self.date = date
        self.set_day(day)
    
    def signUp(self, user: User):
        if self.signUpLimit > 0 and len(self.users) >= self.signUpLimit:
            raise ValueError("Sign-up limit reached for this slot.")
        self.users.append(user)
        db.session.commit()

signup_slot_user = db.Table('signup_slot_user',
    db.Column('signup_slot_id', db.Integer, db.ForeignKey('signup_slot.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)


class Signup(db.Model):
    __tablename__ = 'signup'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    signUpType: Mapped[int]
    name: Mapped[str] = mapped_column(db.String(50))
    details: Mapped[str] = mapped_column(db.String(200))
    can_cancel: Mapped[bool] = mapped_column(default=False) 
    commenting_status: Mapped[int] = mapped_column(db.SmallInteger())
    published: Mapped[bool] = mapped_column(default=False)
    sorting_method: Mapped[int] = mapped_column(db.SmallInteger())

    owner_id: Mapped[int] = mapped_column(db.Integer, db.ForeignKey('user.id'))
    owner: Mapped['User'] = db.relationship(back_populates='signups')
    slots: Mapped[List['SignupSlot']] = db.relationship(back_populates='signup')

    def __init__(self, owner: User, name: str, details: str, signUpType: SignupType, canCancel: bool, commenting_status: CommentingStatus, published: bool, sorting_method: SignupSortingMethod):
        if signUpType not in SignupType:
            raise ValueError("Invalid sign up type")
        if sorting_method not in SignupSortingMethod:
            raise ValueError("Invalid sorting method")
        if commenting_status not in CommentingStatus:
            raise ValueError("Invalid option for comments")
        
        self.owner = owner
        self.name = name
        self.details = details
        self.signUpType = signUpType.value
        self.canCancel = canCancel
        self.commenting_status = commenting_status.value
        self.published = published
        self.sorting_method = sorting_method.value

    def add_slot(self, slot: SignupSlot):
        if self.signUpType == SignupType.SCHEDULING and (slot.time is None or slot.date is None or slot.day is None):
            raise ValueError("No date, day, or time was passed in.")
        elif self.signUpType == SignupType.PROJECT and slot.name is None:
            raise ValueError("No name was passed in")
        
        self.slots.append(slot)
        slot.signup_id = self.id  # Set the signup_id to link the slot to this signup
        db.session.add(slot)
        db.session.commit()
    
    def set_day(self, day):
        valid_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        if day.capitalize() not in valid_days:
            raise InvalidDayError(f"'{day}' is not a valid day.")
        self.day = day.capitalize()
