# Overview
This is simple app basically highlights the use of a few tools together that could be helpful in a lot of use cases. It basically mixes the use of the following tools/techniques:
- a miniture leaderboard that uses a cache store to reduce the resource-demanding nature of this feature
- the app uses sockets to broadcast updates to the consuming clients once an update occurred
- the app config could also be used to make a blue-green deployment pipeline and a script to switch traffic between Blue and Green release

Main tools used to achieve this:
- Express
- Redis
- Socket.io
- Postgres
- Docker
- Kubectl

## Available endpoints
- `GET /leaderboard` fetches the leaderboard from db table or the cache
- `POST /leaderboard/player` generates a new player entry in the leaderboard with a random username
- `[Socket.io] /` The app starts a socket.io server on root path that clients could connect to after providing their username in the `authorization header` 
- `POST /generate-uuid` takes a body with property `text: "whatever"`
- `GET /ping` only for health checks
- Any other route will give out `404`

## Socket events to listen to
- `general` this event will receive messages when connecting and disconnecting a user
- `leaderboard` this will receive leaderboard updates

## Assumptions

- This implements on Kubernetes version of Blue-Green routine. Which assumes that using one service, we can switch traffic between the apps. This of course means that one version will be accessible at a time.
- Other probable solutions was to expose Nginx service and using it to switch the traffic between both services, and each of them would take a staging and prod domain in order to make them both accessible but at different domains.


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
