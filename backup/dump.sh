FILE_NAME=dump-db-aaqib-$(date +"%Y-%m-%d").gz
mongodump --uri mongodump --uri mongodb+srv://fardous:spboss2003@mflix.9ybcu.mongodb.net/aaqib --gzip --archive=${PWD}/${FILE_NAME}