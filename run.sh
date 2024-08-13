SCRIPT_PATH=$(readlink -f "$0")
APP_PATH="$SCRIPT_PATH/signupbetter"

docker-compose -f $APP_PATH/docker-compose.yml rm -f
docker-compose -f $APP_PATH/docker-compose.yml pull
docker-compose -f $APP_PATH/docker-compose.yml up --build -d
