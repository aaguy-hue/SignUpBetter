# CONTRIBUTING
Ok so here is some info on how this website works.


## Technologies
As long as you have docker compose, you don't need to install anything. Technologies used by this app include:
- Docker / Docker Compose (allows for easy portability)
- Python
  - Various Python modules (see requirements.txt), notable ones are listed below
    - Flask (web framework)
      - Various modules that extend flask
    - Gunicorn (wsgi http server)
    - Psycopg2 (interacting with the postgres db)
- PostgresSQL (database)

## Migrations
I use flask-migrate to make migrations from my models to the database. See [this link](https://www.digitalocean.com/community/tutorials/how-to-perform-flask-sqlalchemy-migrations-using-flask-migrate) for more details.

`flask db migrate -m "message"` will generate the migration script. Make sure to check the generated upgrade() and downgrade() functions.

`flask db upgrade` will update the database. If you want to apply this to the production database, run `.\run.bat debugsite` and then run `python -m flask db upgrade`

## Structure
- random top level files
- `run.bat`, `run.sh` (run the project)
- signupbetter (this is all of the project)
  - `docker-compose.yml` (runs everything)
  - `.env` (environment variables)
  - website (has all the website code)
    - `Dockerfile` (defines the docker image for the website)
    - `requirements.txt` (defines all the python packages required to run the website)
    - src (all the website code)
      - `setup.py`, `MANIFEST.in` (allow gunicorn to run the site)
      - `config.py` (debug vs production configurations of the project)
      - app (all the actual website code for the flask app)
        - `__init__.py` (initializes the website)
        - `extensions.py` (initializes flask extensions)
        - migrations (the migratinos for the db, mostly auto-generated)
        - main (random top level things like the home page and contact page)
        - auth (authentication code, anything related to accounts)
        - signups (anything related to signups, whether it be creating or viewing a signup)
        - static (contains all static files i.e. files that can be served as is and will not change)
          - css, img, js (self explanatory)
        - models (all the models for the database)
          - an individual file for each blueprint
        - templates (contains all html templates)
          - `base.html` (base template that everything extends from)
          - subfolder for each blueprint
