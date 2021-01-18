source /home/ec2-user/.bash_profile

cd /home/ec2-user/api

NAME="src/index.js"
RUN=$(pgrep -f $NAME)

if [ "$RUN" == "" ]; then
 npm run staging
else
 echo "Script is running"
fi