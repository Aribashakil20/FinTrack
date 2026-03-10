# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY fintrack-backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY fintrack-backend/src ./src
RUN mvn package -DskipTests -B

# ── Stage 2: Run ──────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S fintrack && adduser -S fintrack -G fintrack
USER fintrack

COPY --from=build /app/target/*.jar app.jar

EXPOSE ${PORT:-8080}

ENTRYPOINT ["java", "-jar", "app.jar"]
