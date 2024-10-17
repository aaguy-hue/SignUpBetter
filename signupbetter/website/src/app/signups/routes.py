import datetime
from flask import render_template, redirect, request, url_for, flash
from flask_login import current_user, login_required, login_user, logout_user
from app.extensions import db
from app.signups import bp
from app.signups.create_signup import InvalidDayError, SignupType, CommentingStatus, SignupSortingMethod
from app.models.signups import SignupSlot, Signup

@bp.route('/create-a-signup/', methods=['GET', 'POST'])
@login_required
def create_new_signup():
    if request.method == 'GET':
        return render_template(
            'signups/new_signup.html',
        )
    
    published: bool = request.form.get('published', 'false').lower() == 'true'
    signup_name: str = request.form.get('signup_name')
    signup_details: str = request.form.get('signup_details')
    try:
        signup_type: SignupType = SignupType.fromStr(request.form.get('signup_type'))
    except ValueError:
        flash('Invalid sign up type.', 'error')
        return render_template('signups/new_signup.html')
    can_cancel: bool = request.form.get('can_cancel', 'false').lower() == 'true'
    try:
        commenting_status: CommentingStatus = CommentingStatus.fromStr(request.form.get('commenting_status'))
    except ValueError:
        flash('Invalid option chosen for commenting in settings.', 'error')
        return render_template('signups/new_signup.html')
    try:
        sorting_method: SignupSortingMethod = SignupSortingMethod.fromStr(request.form.get('sorting_method'))
    except ValueError:
        flash('Invalid sorting method chosen in settings.', 'error')
        return render_template('signups/new_signup.html')
    
    try:
        new_signup = Signup(
            name=signup_name,
            details=signup_details,
            signUpType=signup_type,
            canCancel=can_cancel,
            commenting_status=commenting_status,
            sorting_method=sorting_method,
            published=published
        )

        db.session.add(new_signup)
        db.session.commit()
        db.session.flush()  # Flush to get the ID of the new_signup before adding slots
        
        slot_ids = [key for key in request.form.keys() if key.startswith('slot-')]
        for slot_id in slot_ids:
            location = request.form.get(f'{slot_id}-location')
            amt = request.form.get(f'{slot_id}-amt')
            details = request.form.get(f'{slot_id}-details')
            date = request.form.get(f'{slot_id}-date')
            day = request.form.get(f'{slot_id}-day')
            time = request.form.get(f'{slot_id}-time')

            # Create and add new Slot objects
            new_slot = SignupSlot(
                signup_id=new_signup.id,
                location=location,
                signUpLimit=int(amt) if amt else 0,
                details=details,
                date=datetime.datetime.strptime(date, '%Y-%m-%d').date() if date else None,
                day=day,
                time=datetime.datetime.strptime(time, '%H:%M').time() if time else None
            )
            db.session.add(new_slot)
            new_signup.add_slot(new_slot)
        db.session.commit()
        
        flash('Signup created successfully!', 'success')
        return redirect(url_for('signups.view_signup', signup_id=new_signup.id))
    except InvalidDayError as e:
        flash('You somehow managed to pass in an invalid day.', 'error')
    except ValueError as e:
        flash(str(e), 'error')
    except Exception as e:
        print(e)
        flash('An unexpected error occurred. Please try again.', 'error')
        db.session.rollback()

    return render_template('signups/new_signup.html')


@bp.route('/view-signup/<int:signup_id>', methods=['GET'])
@login_required
def view_signup(signup_id):
    signup = Signup.query.get_or_404(signup_id)
    signup_slots = SignupSlot.query.filter_by(signup_id=signup.id).all()
    
    return render_template(
        'signups/view_signup.html',
        signup=signup,
        signup_slots=signup_slots
    )
