from flask import render_template, redirect, request, url_for, flash
from flask_login import current_user, login_required, login_user, logout_user
from app.extensions import db
from app.signups import bp

@bp.route('/create-a-signup/', methods=['GET', 'POST'])
@login_required
def create_new_signup():    
    return render_template(
        'signups/new_signup.html',
    )
