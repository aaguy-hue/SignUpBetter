from enum import Enum

class InvalidDayError(Exception):
    pass

class SignUpType(Enum):
    PROJECT = 0
    SCHEDULING = 1
    
    def fromStr(s: str) -> int:
        ss: str = s.strip().lower()
        if ss == "project":
            return SignUpType.PROJECT
        elif ss == "scheduling":
            return SignUpType.SCHEDULING
        raise ValueError("Invalid sign up type!")