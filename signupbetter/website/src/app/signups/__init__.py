from flask import Blueprint

bp = Blueprint('signups', __name__)


from app.signups import routes