echo "## Getting last deployed tag .."
latestTag=$( tail -n 1 deployment-history.txt )
newTag="whatever"

if [[ "$latestTag" == *"blue"* ]]; then
  newTag="green"
else
  newTag="blue"
fi

echo "## Rebuilding the app .."
docker-compose -f docker-compose-$newTag.yml build --no-cache
echo "## Injecting latest tag version ..."
sed -i '' "s/DEPLOYMENT_VERSION/${DEPLOYMENT_VERSION}/g" deployment-manifests/trial-task-deployment-$newTag.yml
echo "## Applying $newTag.$DEPLOYMENT_VERSION deployment.."
kubectl apply -f deployment-manifests/trial-task-deployment-$newTag.yml
echo "## Applying $newTag.$DEPLOYMENT_VERSION service.."
kubectl apply -f deployment-manifests/trial-task-service-$newTag.yml
# echo "## Force pulling the updated image .."
# kubectl set image deployment/trial-task-api-$newTag trial-task-api=trial-task-api:$newTag
# kubectl set image deployment/trial-task-api-$newTag trial-task-api=trial-task-api
echo "## Storing last deployed version in deployment-history.txt"
echo "$newTag.${DEPLOYMENT_VERSION}" >> deployment-history.txt
echo "## Reverting env var change ..."
sed -i '' "s/${DEPLOYMENT_VERSION}/DEPLOYMENT_VERSION/g" deployment-manifests/trial-task-deployment-$newTag.yml
echo "## Starting a minikube tunnel, service should be available on 127.0.0.1:3000"
minikube tunnel