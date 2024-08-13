"""
This is a signup website.
"""

from setuptools import setup, find_packages

setup(
    name='Signup Website',
    version='0.1',
    long_description=__doc__,
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'Flask==3.0.1',
        'psycopg2-binary==2.9.9',
        'Flask-SQLAlchemy==3.1.1',
        'Flask-Migrate==4.0.5',
        'Flask-Login==0.6.3',
        'Flask-Bcrypt==1.0.1',
        'Flask-WTF==1.2.1'
    ]
)
