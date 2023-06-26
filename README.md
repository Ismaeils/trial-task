## How to run this

#### You have to have `minikube` and `docker` installed

- You have to make sure that minikube is started `minikube start`
- `eval $(minikube docker-env)` You've to use this statement before doing any work on the terminal. This works by the lifetime of the terminal, if you opened new one, execute this statement before you do any work
- if you have never run this app before, execute `sh deploy-first-time.sh` script

#### For usual updating of the app code base:

- set a unique version number `export DEPLOYMENT_VERSION=0.0.8` for example. See `deployment-history.txt` in order to check the latest and increament on it. This env var has to be unique.
- execute `sh redeploy-switch-traffic.sh` script. This script will rebuild the docker image, find which version to deploy to (blue or green) and then update the service to point to the active deployment.
- Also, this `redeploy-switch-traffic.sh` script will start `minikube tunnel`, which is necessary in order to make the load balancer accessible on the local machine.
- Voila, the app will be accessible on 127.0.0.1:3000

## Available endpoints

- `POST /generate-uuid` takes a body with property `text: "whatever"`
- `GET /ping` only for health checks
- Any other route will give out `404`

## Assumptions

- This implements on Kubernetes version of Blue-Green routine. Which assumes that using one service, we can switch traffic between the apps. This of course means that one version will be accessible at a time.
- Other probable solutions was to expose Nginx service and using it to switch the traffic between both services, and each of them would take a staging and prod domain in order to make them both accessible but at different domains.
