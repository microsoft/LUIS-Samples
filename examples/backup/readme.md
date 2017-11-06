# Backup all apps
This Node.js file backups up all your LUIS apps:
- settings
- endpoints
- versions

## Prerequisites
- Lastest version of Node.js. 
- Install dependencies from package.json with `npm install`
- In the backup.js file, change to programmaticKey to your own key.

## Run backup
- From command line, `npm start' or 'node backup.js'

## Review backup
**backup.json** is a json tree structure of each app with the information about each app.
