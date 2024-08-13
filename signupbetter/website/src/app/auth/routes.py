import uuid
from flask import render_template, redirect, request, url_for, flash
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.auth import User
from app.extensions import db
from app.auth import bp

@bp.route('/register/', methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        password2 = request.form.get('password2')

        # if the user did sussy inspect html to override this check, then go back
        if password != password2:
            flash('Passwords do not match')
            return redirect(url_for('auth.register'))

        # If user is found, redirect to signup page so user can try again
        user = User.query.filter_by(username=username).first()
        if user:
            flash('A user with that username already exists')
            return redirect(url_for('auth.register'))

        # create a new user with the form data. Hash the password so the plaintext version isn't saved.
        new_user = User(username=username, password=generate_password_hash(password, method='scrypt'))

        # add the new user to the database
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for('auth.login'))
    elif request.method == "GET":
        return render_template('auth/register.html')
    else:
        return 405 # method not allowed

@bp.route('/login/', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        remember = True if request.form.get('remember') else False

        user = User.query.filter_by(username=username).first()

        # does user exist? do password hashes match?
        if not user or not check_password_hash(user.password, password):
            flash('Please check your login details and try again.')
            return redirect(url_for('auth.login'))
        
        login_user(user, remember=remember)
        return redirect(url_for('auth.account'))
    elif request.method == "GET":
        return render_template('auth/login.html')
    else:
        return 405 # method not allowed

@bp.route('/logout/')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.home'))

@bp.route('/account/')
@login_required
def account():    
    return render_template(
        'auth/account.html',
        username=current_user.username
    )
