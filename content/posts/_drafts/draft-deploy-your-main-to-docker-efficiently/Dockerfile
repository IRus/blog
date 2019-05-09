#FROM java:8
FROM ibragimov/hello
ADD build/install/kotlin-docker/bin/kotlin-docker /usr/src/app/bin/
ADD build/install/kotlin-docker/lib/*.jar /usr/src/app/lib/
WORKDIR /usr/src/app
CMD ["./bin/kotlin-docker"]