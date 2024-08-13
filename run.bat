@echo off

set SCRIPT_PATH=%~dp0
set "APP_PATH=%SCRIPT_PATH%signupbetter"

if %1.==.        GOTO run
if %1==run       GOTO run
rem if %1==upgradedb GOTO upgradedb
if %1==debugdb   GOTO debugdb
if %1==debugsite GOTO debugsite
GOTO help



:run
    echo "Removing the old docker images..."
    docker compose -f %APP_PATH%\docker-compose.yml rm -f
    
    echo "Pulling the latest version of the docker images..."
    docker compose -f %APP_PATH%\docker-compose.yml pull
    
    echo "Running the services!"
    docker compose -f %APP_PATH%\docker-compose.yml up --build
GOTO ProgramEnd


:debugdb
    docker exec -it -u root signup-postgres bash
GOTO ProgramEnd


:debugsite
    docker exec -it -u root signupbetter-signup-website-1 sh
GOTO ProgramEnd


:help
  echo "Here is some help:"
  echo "If the first parameter is 'run' or is omitted, then it will remove the old docker images and then run docker compose up"
  echo "If the first parameter is 'debugdb', then an interactive shell in the postgres image will be opened (the image must already be running)."
  echo "If the first parameter is 'debugsite', then an interactive shell in the website image will be opened (the image must already be running)."
  echo "If the first parameter is 'help' or invalid, this message is shown."
GOTO ProgramEnd


:ProgramEnd
rem This is the end of the program