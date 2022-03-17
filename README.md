# Hands-on TestKube

Demo repository for TestKube - a opinionated and friendly Kubernetes testing framework!

This project contains test sources for various languages, frameworks and tools:
- Load tests to be run with k6
- JUnit 5 based unit tests to be run with either Maven or Gradle
- Integration tests using REST-assured to be run with either Maven or Gradle
- Karate acceptance tests to be run with the Karate executor (TODO)
- Security test using the ZAP attack proxy (TODO)

## TestKube k6 Example



## TestKube Gradle Example

```bash
# register the Gradle executor with TestKube
kubectl apply -f src/k8s/gradle-executor.yaml

# create a Gradle test for this repository
kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "gradle/test" --name gradle-test

# and run the tests
kubectl testkube tests run --args test --watch gradle-test
kubectl testkube tests run --args integrationTest --watch gradle-test
```

## TestKube Maven Example

```bash
# register the Maven executor with TestKube
kubectl apply -f src/k8s/maven-executor.yaml

# create a Maven test for this repository
kubectl testkube tests create --git-uri https://github.com/lreimer/hands-on-testkube.git --git-branch main --type "maven/test" --name maven-test

# and run the tests
kubectl testkube tests run --args test --watch maven-test
kubectl testkube tests run --args integration-test --watch maven-test
```

## Maintainer

M.-Leander Reimer (@lreimer), <mario-leander.reimer@qaware.de>

## License

This software is provided under the MIT open source license, read the `LICENSE`
file for details.