import datetime
from app.extensions import db
from app.models.auth import User
from app.signups.create_signup import InvalidDayError, SignUpType

class SignupSlot(db.Model):
    __tablename__ = 'signup_slot'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    location = db.Column(db.String(50))
    details = db.Column(db.String(200))
    time = db.Column(db.Time)  # For storing time in HH:MM:SS format
    date = db.Column(db.Date)  # For storing date in YYYY-MM-DD format
    day = db.Column(db.String(10))
    signUpLimit = db.Column(db.SmallInteger())
    
    users = db.relationship('User', secondary='signup_slot_user', backref='slots', lazy=True)
    signup_id = db.Column(db.Integer, db.ForeignKey('signup.id'), nullable=False)
    
    def __init__(self, name: str, details: str, location: str, time: datetime.time, date: datetime.date, day: str):                
        self.name = name
        self.details = details
        self.location = location
        self.time = time
        self.date = date
        self.set_day(day)
    
    def signUp(self, user: User):
        if len(self.users) >= self.signUpLimit:
            raise ValueError("Sign-up limit reached for this slot.")
        self.users.append(user)
        db.session.commit()

# Many to one relationship between SignUpSlot and User
signup_slot_user = db.Table('signup_slot_user',
    db.Column('signup_slot_id', db.Integer, db.ForeignKey('signup_slot.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)


class Signup(db.Model):
    __tablename__ = 'signup'
    
    id = db.Column(db.Integer, primary_key=True)
    signUpType = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    details = db.Column(db.String(200))
    can_cancel = db.Column(db.Boolean, default=False, nullable=False) 
    can_comment = db.Column(db.Boolean, default=False, nullable=False) 
    slots = db.relationship('SignupSlot', backref='signup', lazy=True)

    def __init__(self, name: str, details: str, signUpType: int, canCancel: bool, canComment: bool):
        if signUpType != SignUpType.SCHEDULING and signUpType != SignUpType.PROJECT:
            raise ValueError("Invalid sign up type")
        
        self.name = name
        self.details = details
        self.signUpType = signUpType
        self.canCancel = canCancel
        self.canComment = canComment

    def addSlot(self, slot: SignupSlot):
        if self.signUpType == SignUpType.SCHEDULING and (slot.time is None or slot.date is None or slot.day is None):
            raise ValueError("No date, day, or time was passed in.")
        elif self.signUpType == SignUpType.PROJECT and slot.name is None:
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
