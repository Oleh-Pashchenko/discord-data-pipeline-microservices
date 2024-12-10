
# Discord Data Pipeline Microservices

This project consists of a scalable and maintainable architecture using **NestJS microservices** that communicate via **RabbitMQ**. It processes data from Discord, parses it, and stores it in a database. The services are containerized with **Docker Compose** for easy setup and deployment.

---

## Project Structure

```plaintext
├── database-service            # Handles data storage and database interaction
├── discord-fetcher-service     # Fetches data from Discord API
├── docker-compose.yml          # Docker Compose configuration file
└── message-processor-service   # Processes messages and parses data
```

---

## Architecture Overview

Each service is a **NestJS microservice**, designed for scalability and maintainability. RabbitMQ acts as the message broker, facilitating communication between the services.

### Services

#### 1. **discord-fetcher-service**
- Fetches data from the Discord API.
- Sends messages to the `message-processor-service` via RabbitMQ.

#### 2. **message-processor-service**
- Processes data from the queue.
- Parses messages using regex; if parsing fails:
  - Attempts parsing using the OpenAI API.
  - If successful, sends data to `database-service`.
  - If not, skips the message.

#### 3. **database-service**
- Receives parsed data and stores it in the database.

---

## Key Features

- **Scalable**: Services communicate through RabbitMQ, enabling horizontal scaling.
- **Maintainable**: Each service has a single responsibility, making it easier to update or debug.
- **Modular**: Independent services with clear separation of concerns.

---

## Future Improvements

### General Improvements
- **Health Endpoints**: Add health check endpoints for each service to monitor their status.
- **Observability**: 
  - Use **Prometheus** for metrics collection.
  - Use **Grafana** for visualization and monitoring.
  - Centralize logging with tools like **ELK Stack** or **Loki**.
- **Error Handling**: 
  - Enhance error reporting using structured logs.
  - Integrate with monitoring tools for better alerting.

### Service-Specific Improvements

#### 1. discord-fetcher-service
- Add a database or other storage to manage settings like channels to fetch (currently hardcoded for simplicity).

#### 2. message-processor-service
- Implement additional parsing methods to handle different message formats, reducing dependency on OpenAI API calls.

#### 3. database-service
- Improve user and DB access management for better security and scalability.

---

## Application Resiliency Patterns Improvement
- **Circuit Breaker**: Implement circuit breakers to handle intermittent failures gracefully.
- **Retries with Backoff**: Add retries with exponential backoff for failed operations.
- **Dead Letter Queues**: Configure RabbitMQ to handle failed messages using DLQs.

---

## Codebase Improvement
- **Shared Data Types**: 
  - Move shared types like `DiscordMessage` and Prisma-generated models into a private package or shared module to avoid duplication.
- **Modularization**:
  - Decouple shared logic into libraries that can be imported across services.

---

## Running the Project

### Using Docker Compose
To start the system with all services:
```bash
docker-compose up
```

### Running Services Independently
To run a specific service:

1. Navigate to the service folder (e.g., `discord-fetcher-service`).
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. If running the `database-service`, generate Prisma client and apply migrations:
   ```bash
   npx prisma generate
   npm run migrate:apply:up
   ```
   The `migrate:apply:up` script is defined as:
   ```json
   "migrate:apply:up": "dotenv -e ../.env -- prisma migrate deploy"
   ```
4. Start the service:
   ```bash
   npm run start:dev
   ```
---

This architecture is designed for ease of development, deployment, and scalability. By implementing the suggested improvements, it can be production-ready and support complex workflows efficiently.

## License and Copyright

© 2024 Oleh Pashchenko. All rights reserved.

GitHub: [Oleh Pashchenko](https://github.com/Oleh-Pashchenko)
