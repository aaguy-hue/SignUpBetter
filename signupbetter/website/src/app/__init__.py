import os
from flask import Flask
from config import Config, DevelopmentConfig
from app.extensions import db, migrate, login_manager


def create_app(config_class=Config):
    app = Flask(__name__)
    is_production = bool(int(os.getenv("prod", "0")))

    if not is_production:
        app.config.from_object(DevelopmentConfig)
    else:
        app.config.from_object(config_class)

    # Initialize Flask extensions here
    db.init_app(app)
    migrate.init_app(app)

    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    # Register blueprints here
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp)
    
    from app.signups import bp as signups_bp
    app.register_blueprint(signups_bp)
    
    return app


@login_manager.user_loader
def load_user(user_id):
    from app.models.auth import User
    return User.query.filter(User.id == int(user_id)).first()
