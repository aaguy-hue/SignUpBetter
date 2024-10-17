from enum import Enum

class InvalidDayError(Exception):
    pass

class SignupType(Enum):
    PROJECT = 0
    SCHEDULING = 1
    
    def fromStr(s: str) -> 'SignupType':
        s = s.strip().lower()
        if s == "projects":
            return SignupType.PROJECT
        elif s == "scheduling":
            return SignupType.SCHEDULING
        raise ValueError("Invalid sign up type!")
    
class SignupSortingMethod(Enum):
    PRESERVE_ORDER = 0
    ALPHABETICAL = 1
    DATE = 2
    TIME = 3
    
    def fromStr(s: str) -> 'SignupSortingMethod':
        s = s.strip().lower()
        if s == "alphabetical":
            return SignupSortingMethod.ALPHABETICAL
        elif s == "preserve_order":
            return SignupSortingMethod.PRESERVE_ORDER
        elif s == "date":
            return SignupSortingMethod.DATE
        elif s == "time":
            return SignupSortingMethod.TIME
        raise ValueError("Invalid signup sorting method!")

class CommentingStatus(Enum):
    REQUIRED = 0
    OPTIONAL = 1
    DISABLED = 2
    
    def fromStr(s: str) -> 'CommentingStatus':
        s = s.strip().lower()
        if s == "required":
            return CommentingStatus.REQUIRED
        elif s == "optional":
            return CommentingStatus.OPTIONAL
        elif s == "disabled":
            return CommentingStatus.DISABLED
        raise ValueError("Invalid commenting status!")
