# Hands-on TestKube

Demo repository for TestKube - a opinionated and friendly Kubernetes testing framework!

This project contains test sources for various languages, frameworks and tools:
- Load tests to be run with k6
- JUnit 5 based unit tests to be run with either Maven or Gradle
- Integration tests using REST-assured to be run with either Maven or Gradle
- Security test using the ZAP attack proxy (TODO)
- Karate acceptance tests to be run with the Karate executor (TODO)

## Bootstrapping

For a simple local setup use the following instructions:
```
$ kubectl testkube install
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

# you also need to create the webhook for the Git Repository
# Payload URL: http://<LoadBalancerAddress>/<ReceiverURL>
# Secret: the webhook-token value
$ kubectl -n flux-system get svc/receiver
$ kubectl -n flux-system get receiver/webapp

$ make delete-gke-cluster
```

## Testkube Postman Example

```bash
$ kubectl testkube create test --file src/postman/postman_collection.json --type postman/collection --name postman-test
$ kubectl testkube run test postman-test
```

## Testkube K6 Example

```bash
# create simple k6 file based script
kubectl testkube tests create --file src/k6/k6-test-scenarios.js --type "k6/script" --name k6-test-script
kubectl testkube tests run --watch k6-test-script

# create Nginx service and k6 load test
kubectl testkube tests create --file src/k6/k6-test-nginx.js --type "k6/script" --name k6-test-nginx
kubectl testkube tests run --param TARGET_HOSTNAME=nginx-service.default.svc.cluster.local --watch k6-test-nginx
kubectl testkube tests run --param K6_OUT=influxdb=http://influxdb-service:8086/k6 --param TARGET_HOSTNAME=nginx-service.default.svc.cluster.local --watch k6-test-nginx

# create a generic k6 test for this repository
kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --git-path src/k6/ --type "k6/script" --name k6-test-script-git
kubectl testkube tests run --args src/k6/k6-test-scenarios.js --watch k6-test-script-git

kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --git-path src/k6/ --type "k6/script" --name k6-test-nginx
kubectl testkube tests run --args src/k6/k6-test-nginx.js  --watch k6-test-nginx
```

## Testkube Gradle Example

```bash
# create a Gradle test for this repository
kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "gradle/test" --name gradle-test
kubectl testkube tests run --watch gradle-test

# create a Gradle integrationTest for this repository
kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "gradle/integrationTest" --name gradle-integrationTest
kubectl testkube tests run --watch gradle-integrationTest

# or create a Gradle project and pass test task via args
kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "gradle/project" --name gradle-project
kubectl testkube tests run --args integrationTest --watch gradle-project
```

## Testkube Maven Example

```bash
# create a Maven test for this repository
kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "maven/test" --name maven-test
kubectl testkube tests run --watch maven-test

# create a Maven integration test for this repository
kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "maven/integration-test" --name maven-integration-test
kubectl testkube tests run --watch maven-integration-test

# or create a Maven project and pass test goal via args
kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "maven/project" --name maven-project
kubectl testkube tests run --args integration-test --watch maven-project
```

## Testkube ZAP Example

```bash
# run a ZAP OpenAPI scan against microservice
kubectl testkube create test --filename src/zap/zap-api.yaml --type "zap/api" --name zap-api-test
kubectl testkube run run --watch zap-api-test

# run a ZAP Baseline scan against microservice
kubectl testkube create test --filename examples/zap-baseline.yaml --type "zap/baseline" --name zap-baseline-test
kubectl testkube run test --watch zap-baseline-test
```

## Maintainer

M.-Leander Reimer (@lreimer), <mario-leander.reimer@qaware.de>

## License

This software is provided under the MIT open source license, read the `LICENSE`
file for details.