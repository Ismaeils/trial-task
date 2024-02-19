echo "## Setting default deployment version to 0.0.1 .."
export DEPLOYMENT_VERSION=0.0.1

echo "## Building the app .."
docker-compose -f docker-compose-blue.yml build --no-cache

echo "## Storing last deployed version in deployment-history.txt"
echo "blue.0.0.1" >> deployment-history.txt

echo "## Starting the app .."
docker-compose -f docker-compose-blue.yml up