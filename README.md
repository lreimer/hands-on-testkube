# Hands-on TestKube

Demo repository for TestKube - a opinionated and friendly Kubernetes testing framework!

This project contains test sources for various languages, frameworks and tools:
- Load tests to be run with k6
- JUnit 5 based unit tests to be run with either Maven or Gradle
- Integration tests using REST-assured to be run with either Maven or Gradle
- Karate acceptance tests to be run with the Karate executor (TODO)
- Security test using the ZAP attack proxy (TODO)

## TestKube k6 Example

```bash
# register the Gradle executor with TestKube
kubectl apply -f src/k8s/k6-executor.yaml
kubectl apply -f src/k8s/k6-influxdb-grafana.yaml

# create simple k6 file based script
kubectl testkube tests create --file src/k6/k6-test-scenarios.js --type "k6/script" --name k6-test-script
kubectl testkube tests run --watch k6-test-script

# create Nginx service and k6 load test
kubectl apply -f src/k8s/k6-nginx-service.yaml
kubectl testkube tests create --file src/k6/k6-test-nginx.js --type "k6/script" --name k6-test-nginx
kubectl testkube tests run --param TARGET_HOSTNAME=nginx-service.default.svc.cluster.local --watch k6-test-nginx
kubectl testkube tests run --param K6_OUT=influxdb=http://influxdb-service:8086/k6 --param TARGET_HOSTNAME=nginx-service.default.svc.cluster.local --watch k6-test-nginx

# create a generic k6 test for this repository
kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --git-path src/k6/ --type "k6/script" --name k6-test-script-git
kubectl testkube tests run --args src/k6/k6-test-scenarios.js --watch k6-test-script-git

kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --git-path src/k6/ --type "k6/script" --name k6-test-nginx
kubectl testkube tests run --args src/k6/k6-test-nginx.js  --watch k6-test-nginx
```

## TestKube Gradle Example

```bash
# register the Gradle executor with TestKube
kubectl apply -f src/k8s/gradle-executor.yaml

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

## TestKube Maven Example

```bash
# register the Maven executor with TestKube
kubectl apply -f src/k8s/maven-executor.yaml

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

## Maintainer

M.-Leander Reimer (@lreimer), <mario-leander.reimer@qaware.de>

## License

This software is provided under the MIT open source license, read the `LICENSE`
file for details.