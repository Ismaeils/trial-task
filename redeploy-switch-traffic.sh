echo "## Getting last deployed tag .."
latestTag=$( tail -n 1 deployment-history.txt )
newTag="whatever"

if [[ "$latestTag" == *"blue"* ]]; then
  newTag="green"
else
  newTag="blue"
fi

echo "## Rebuilding the app .."
docker-compose -f docker-compose-blue.yml build --no-cache

echo "## Storing last deployed version in deployment-history.txt"
echo "$newTag.${DEPLOYMENT_VERSION}" >> deployment-history.txt

echo "## Starting the app:$newTag.."
docker-compose -f docker-compose-$newTag.yml up