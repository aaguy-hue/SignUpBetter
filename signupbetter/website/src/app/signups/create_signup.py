from enum import Enum

class InvalidDayError(Exception):
    pass

class SignupType(Enum):
    PROJECT = 0
    SCHEDULING = 1
    
    def fromStr(s: str) -> 'SignupType':
        ss: str = s.strip().lower()
        if ss == "projects":
            return SignupType.PROJECT
        elif ss == "scheduling":
            return SignupType.SCHEDULING
        raise ValueError("Invalid sign up type!")