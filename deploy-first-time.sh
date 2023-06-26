echo "## Setting default deployment version to 0.0.1 .."
export DEPLOYMENT_VERSION=0.0.1
echo "## Building the app .."
docker-compose -f docker-compose-blue.yml build --no-cache
echo "## Applying redis manifest .."
kubectl apply -f deployment-manifests/redis-deployment-service.yml
echo "## Applying default network policy manifest .."
kubectl apply -f deployment-manifests/trial-task-default-networkpolicy.yaml
echo "## Applying volume claim .."
kubectl apply -f deployment-manifests/trial-task-persistentvolumeclaim.yaml
echo "## Injecting first tag version in blue..."
sed -i '' "s/DEPLOYMENT_VERSION/${DEPLOYMENT_VERSION}/g" deployment-manifests/trial-task-deployment-blue.yml
echo "## Injecting first tag version in green..."
sed -i '' "s/DEPLOYMENT_VERSION/${DEPLOYMENT_VERSION}/g" deployment-manifests/trial-task-deployment-green.yml
echo "## Applying blue deployment .."
kubectl apply -f deployment-manifests/trial-task-deployment-blue.yml
echo "## Applying blue service .."
kubectl apply -f deployment-manifests/trial-task-service-blue.yml
echo "## Applying green deployment .."
kubectl apply -f deployment-manifests/trial-task-deployment-green.yml
echo "## Reverting env var in blue..."
sed -i '' "s/${DEPLOYMENT_VERSION}/DEPLOYMENT_VERSION/g" deployment-manifests/trial-task-deployment-blue.yml
echo "## Reverting env var in green..."
sed -i '' "s/${DEPLOYMENT_VERSION}/DEPLOYMENT_VERSION/g" deployment-manifests/trial-task-deployment-green.yml
echo "## Storing last deployed version in deployment-history.txt"
echo "blue.0.0.1" >> deployment-history.txt
echo "## Starting a minikube tunnel, service should be available on 127.0.0.1:3000"
minikube tunnel