# syntax=docker/dockerfile:1.4
FROM python:3.11-alpine

# install postgres libraries and headers for psycopg2
# RUN apk add --no-cache postgresql-libs postgresql-dev

# cd to /app
WORKDIR /app

# copy over the files
COPY ./src .
COPY ./requirements.txt .

# install dependencies
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

# prepare the website for running
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install .

# run the site in production mode
RUN export prod=1

# run the website on port 8000
EXPOSE 8000
ENTRYPOINT ["gunicorn"]
CMD ["-w", "4", "-b", "0.0.0.0:8000", "app:create_app()"]
