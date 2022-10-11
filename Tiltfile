# -*- mode: Python -*-
# allow_k8s_contexts('rancher-desktop')

local_resource('hands-on-testkube-build', './gradlew ass', dir='.', deps=['./build.gradle', './src/'], labels=['Spring'])

# to disable push with rancher desktop we need to use custom_build instead of docker_build
# docker_build('hands-on-testkube', '.', dockerfile='Dockerfile', only=['./Dockerfile', './build/libs/'])
custom_build('hands-on-testkube', 'docker build -t $EXPECTED_REF .', ['./Dockerfile', './build/libs/'], disable_push=True)

k8s_yaml(kustomize('./k8s/overlays/dev/'))
k8s_resource(workload='hands-on-testkube', port_forwards=[port_forward(18080, 8080, 'HTTP API'), port_forward(18081, 8081, 'Management API')], labels=['Spring'])
