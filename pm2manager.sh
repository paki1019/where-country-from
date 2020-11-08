if [ "$1" == "start" ]; then
    pm2 start node-batch/app.js --watch --name "node-batch" --time
    pm2 start node-api/app.js --watch --name "node-api" --time
elif [ "$1" == "restart" ]; then
    pm2 restart node-batch
    pm2 restart node-api
elif [ "$1" == "stop" ]; then
    pm2 stop node-batch
    pm2 stop node-api
elif [ "$1" == "delete" ]; then
    pm2 delete node-batch
    pm2 delete node-api
fi
