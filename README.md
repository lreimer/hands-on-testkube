# Hands-on TestKube

Demo repository for TestKube - a opinionated and friendly Kubernetes testing framework!

This project contains test sources for various languages, frameworks and tools:
- Load tests to be run with k6
- JUnit 5 based unit tests to be run with either Maven or Gradle
- Integration tests using REST-assured to be run with either Maven or Gradle
- Security test using the ZAP attack proxy
- Karate acceptance tests to be run with the Karate executor

## Bootstrapping

For a simple local setup use the following instructions:
```
$ kubectl testkube init
```

For a GKE based setup using Flux as GitOps tool, use the following instructions:
```bash
# define required ENV variables for the next steps to work
$ export GITHUB_USER=lreimer
$ export GITHUB_TOKEN=<your-token>

# setup a GKE cluster with Flux2
$ make create-gke-cluster
$ make bootstrap-gke-flux2

# modify Flux kustomization and add
# - infrastructure-sync.yaml
# - applications-sync.yaml
# - notification-receiver.yaml
# - receiver-service.yaml
# - webhook-token.yaml
# - image-update-automation.yaml

# if the TestKube Helm release fails to reconciliate
$ flux suspend hr testkube
$ flux resume hr testkube

# you also need to create the webhook for the Git Repository
# Payload URL: http://<LoadBalancerAddress>/<ReceiverURL>
# Secret: the webhook-token value
# $ kubectl -n flux-system get svc/receiver
# $ kubectl -n flux-system get receiver/webapp

$ make delete-gke-cluster
```

## TestKube UI and CLI

```bash
kubectl testkube --help 
kubectl testkube dashboard
```

## Postman Executor Example

```bash
kubectl testkube create test --file src/postman/postman_collection.json --type postman/collection --name postman-test
kubectl testkube run test postman-test

kubectl testkube create test --file src/postman/postman_collection.json --type postman/collection --name postman-scheduled-test --schedule="*/5 * * * *"
```

## K6 Executor Example

```bash
# create simple k6 file based script
kubectl testkube create test --file src/k6/k6-test-scenarios.js --type "k6/script" --name k6-test-script
kubectl testkube run test --watch k6-test-script

# create Nginx service and k6 load test
kubectl testkube create test --file src/k6/k6-test-nginx.js --type "k6/script" --name k6-test-nginx
kubectl testkube run test --env TARGET_HOSTNAME=nginx-service.default.svc.cluster.local --watch k6-test-nginx
kubectl testkube run test --env K6_OUT=influxdb=http://influxdb-service:8086/k6 --env TARGET_HOSTNAME=nginx-service.default.svc.cluster.local --watch k6-test-nginx

# create a generic k6 test for this repository
kubectl testkube create test --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --git-path src/k6/ --type "k6/script" --name k6-test-script-git
kubectl testkube run test --args src/k6/k6-test-scenarios.js --watch k6-test-script-git

kubectl testkube create test --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --git-path src/k6/ --type "k6/script" --name k6-test-nginx
kubectl testkube run test --args src/k6/k6-test-nginx.js --watch k6-test-nginx
```

## Gradle Executor Example

```bash
# create a Gradle test for this repository
kubectl testkube create test --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "gradle/test" --name gradle-test
kubectl testkube run test --watch gradle-test

# create a Gradle integrationTest for this repository
kubectl testkube create test --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "gradle/integrationTest" --name gradle-integration-test
kubectl testkube run test --watch gradle-integration-test

# or create a Gradle project and pass test task via args
kubectl testkube create test --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "gradle/project" --name gradle-project
kubectl testkube run test --args integrationTest --watch gradle-project
```

## Maven Executor Example

```bash
# create a Maven test for this repository
kubectl testkube create test --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "maven/test" --name maven-test
kubectl testkube run test --watch maven-test

# create a Maven integration test for this repository
kubectl testkube create test --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "maven/integration-test" --name maven-integration-test
kubectl testkube run test --watch maven-integration-test

# or create a Maven project and pass test goal via args
kubectl testkube create test --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "maven/project" --name maven-project
kubectl testkube run test --args integration-test --watch maven-project
```

## ZAP Executor Example

```bash
# register the executor manually or via GitOps
kubectl apply -n testkube -f k8s/infrastructure/testkube/zap-executor.yaml

# run a ZAP OpenAPI scan against microservice
kubectl testkube create test --filename src/zap/zap-api.yaml --type "zap/api" --name zap-api-test
kubectl testkube run test --watch zap-api-test

# run a ZAP Baseline scan against microservice
kubectl testkube create test --filename src/zap/zap-baseline.yaml --type "zap/baseline" --name zap-baseline-test
kubectl testkube run test --watch zap-baseline-test
```

## Karate Executor Example

```bash
# register the executor manually or via GitOps
kubectl apply -n testkube -f k8s/infrastructure/testkube/karate-executor.yaml

# create and run a Karate test agains Chuck Norris REST API
kubectl testkube create test --filename src/karate/chuck-norris.feature --type "karate/feature" --name karate-test
kubectl testkube run test --watch karate-test
```

## TestSuite Example

```bash
# manually create and run a test suite from JSON
kubectl testkube create testsuite --name hands-on-testkube --file src/suite.json
kubectl get testsuites -n testkube hands-on-testkube  -o yaml
kubectl testkube run testsuite hands-on-testkube

# alternatively, create test suite via GitOps
# see k8s/applications/testsuite.yaml
```

## Test Triggers Example

```bash
# register the test triggers manually or via GitOps
kubectl apply -n testkube -f k8s/applications/testtrigger.yaml
kubectl apply -n testkube -f k8s/applications/zap-demo/testtrigger-zapapi.yaml

# then make changes to the Nginx or Microservice deployment
kubectl scale deployment nginx-deployment --replicas=3
kubectl scale deployment hands-on-testkube --replicas=3
```

## Maintainer

M.-Leander Reimer (@lreimer), <mario-leander.reimer@qaware.de>

## License

This software is provided under the MIT open source license, read the `LICENSE`
file for details.