FROM eclipse-temurin:17-jdk as builder

WORKDIR /spring

COPY gradle/ gradle/
COPY gradlew .
COPY build.gradle .
COPY settings.gradle .
COPY src/ src/

RUN ./gradlew assemble

# base image
FROM gcr.io/distroless/java17-debian11

# port
EXPOSE 8080 8081

# jar file
COPY --from=builder /spring/build/libs/hands-on-testkube-1.0.0.jar hands-on-testkube.jar

# entry
CMD ["hands-on-testkube.jar"]
