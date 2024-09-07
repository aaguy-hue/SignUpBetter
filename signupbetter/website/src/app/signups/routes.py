import datetime
from flask import render_template, redirect, request, url_for, flash
from flask_login import current_user, login_required, login_user, logout_user
from app.extensions import db
from app.signups import bp
from app.signups.create_signup import InvalidDayError, SignUpType
from app.models.signups import SignupSlot, Signup

@bp.route('/create-a-signup/', methods=['GET', 'POST'])
@login_required
def create_new_signup():
    if request.method == 'GET':
        return render_template(
            'signups/new_signup.html',
        )
    
    signup_name = request.form.get('signup_name')
    signup_details = request.form.get('signup_details')
    try:
        signup_type = SignUpType.fromStr(request.form.get('signup_type'))
    except ValueError:
        flash("Invalid sign up type.", "danger")
        return render_template('signups/new_signup.html')
    can_cancel = request.form.get('can_cancel', 'false') == 'true'
    can_comment = request.form.get('can_comment', 'false') == 'true'
    
    try:
        # Convert signup_type to the corresponding enum value
        signup_type_enum = SignUpType.PROJECT if signup_type == 'projects' else SignUpType.SCHEDULING
        
        # Create new Signup object
        new_signup = Signup(
            name=signup_name,
            details=signup_details,
            signUpType=signup_type_enum,
            canCancel=can_cancel,
            canComment=can_comment
        )

        db.session.add(new_signup)
        db.session.commit()
        db.session.flush()  # Flush to get the ID of the new_signup before adding slots
        
        # Add each slot
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
                amt=int(amt) if amt else 0,
                details=details,
                date=datetime.datetime.strptime(date, '%Y-%m-%d').date() if date else None,
                day=day,
                time=datetime.datetime.strptime(time, '%H:%M').time() if time else None
            )
            db.session.add(new_slot)
        
        db.session.commit()
        
        flash("Signup created successfully!", "success")
        return redirect(url_for('signups.view_signup', signup_id=new_signup.id))
    except InvalidDayError as e:
        return render_template('signups/new_signup.html', )
    except ValueError as e:
        flash(str(e), "danger")
    except Exception as e:
        print(e)
        flash("An unexpected error occurred. Please try again.", "danger")
        db.session.rollback()

    return render_template('signups/new_signup.html')
