# IntentTech

**A full-stack user profile management application** featuring a public multi-step profile-submission wizard, a protected administrative dashboard, and downloadable resume documents in PDF and editable DOCX formats.

IntentTech is implemented as a TypeScript monorepo with a NestJS REST API, PostgreSQL database, Drizzle ORM, and a Next.js frontend built with Tailwind CSS and shadcn/ui. Shared contracts help maintain consistency between the frontend and backend.

## Features

### Public profile submission

- Multi-step form wizard for collecting personal, contact, address, and academic information.
- Form validation with React Hook Form and Zod.
- Resume-style preview of the submitted information.
- Submission through a single API request containing the four related data objects.

### User management

- View a list of submitted profiles.
- Retrieve and review individual profiles.
- Update existing user information.
- Delete user records.

### Administrative dashboard

- Protected administrative access.
- View submitted user information.
- Download individual profiles as PDF documents.
- Export profiles as editable Microsoft Word (`.docx`) documents.

### Backend and data integrity

- RESTful API built with NestJS and TypeScript.
- PostgreSQL relational database hosted locally or through a compatible PostgreSQL provider.
- Drizzle ORM for type-safe database access.
- Database migrations managed with Drizzle Kit.
- Relational data persistence for user information, contact details, addresses, and academic records.

## Technology stack

| Layer                   | Technologies                     |
| ----------------------- | -------------------------------- |
| Monorepo                | pnpm workspaces, Turborepo       |
| Backend                 | NestJS, TypeScript               |
| Database                | PostgreSQL 16                    |
| ORM and migrations      | Drizzle ORM, Drizzle Kit         |
| Frontend                | Next.js, React, TypeScript       |
| UI                      | Tailwind CSS 4, shadcn/ui        |
| Forms and validation    | React Hook Form, Zod             |
| Client state management | Redux Toolkit                    |
| Document exports        | PDF and editable DOCX generation |
| Development environment | Node.js, Docker Compose          |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for architectural decisions, project conventions, and implementation details.

## Architecture overview

The application separates presentation, business logic, and database access.

```text
┌─────────────────────────────────────────┐
│             Next.js Web App             │
│                                         │
│  Public Wizard │ Resume │ Admin Dashboard│
│  React Hook Form │ Zod │ Redux Toolkit  │
└────────────────────┬────────────────────┘
                     │
                     │ REST API / JSON
                     ▼
┌─────────────────────────────────────────┐
│              NestJS API                 │
│                                         │
│  Controllers │ Services │ Validation    │
│  Authentication │ Authorization         │
│  Document Generation                     │
└────────────────────┬────────────────────┘
                     │
                     │ Drizzle ORM
                     ▼
┌─────────────────────────────────────────┐
│                PostgreSQL               │
│                                         │
│  UserInfoTB                              │
│  UserContactTB                           │
│  UserAddressTB                           │
│  UserAcademicsTB                         │
└─────────────────────────────────────────┘
```

### Design principles

- **Separation of concerns:** HTTP handling, business logic, and persistence are kept in distinct layers.
- **Type safety:** TypeScript and shared contracts help reduce inconsistencies between application layers.
- **Data integrity:** Related profile records are persisted using appropriate relational constraints and transactional operations.
- **Validation at the API boundary:** Backend validation remains authoritative regardless of frontend validation.
- **Reproducible database setup:** Schema changes are tracked through version-controlled migrations.
- **AI-assisted development:** AI tools were incorporated into the development workflow, with generated code reviewed and verified as part of implementation.

## Prerequisites

Ensure the following tools are installed:

- **Node.js:** Version 20 or later.
- **pnpm:** Version 9.
- **PostgreSQL:** Version 16, or Docker with Docker Compose.
- **Git:** To clone the repository.

Check your installed versions:

```bash
node --version
pnpm --version
docker --version
```

Docker is optional if PostgreSQL is already running locally.

## Quickstart — local development

### 1. Install dependencies

From the repository root:

```bash
pnpm install
```

### 2. Start PostgreSQL

Use your existing PostgreSQL 16 installation or start the database service defined in the repository's Docker Compose configuration:

```bash
docker compose up -d postgres
```

The command assumes the Compose service is named `postgres`. If your configuration uses a different service name, substitute the appropriate name.

Ensure the database is running and that the database referenced by `DATABASE_URL` exists.

### 3. Configure the API environment

Create the API environment file:

```bash
cp api/.env.example api/.env
```

Update the values to match your local setup, including:

- `DATABASE_URL` — PostgreSQL connection string.
- The JWT-related secrets and other required authentication settings defined in `api/.env.example`.

Use strong, locally generated secrets and keep `.env` files out of version control. Never commit real credentials or production secrets.

### 4. Apply database migrations

Run the database migration command from the repository root:

```bash
pnpm db:migrate
```

This applies the SQL migration configured by the project. The database must be reachable before running the command.

### 5. Bootstrap the initial administrator

Set the bootstrap credentials and run the seed command:

```bash
BOOTSTRAP_ADMIN_EMAIL=admin@example.com \
BOOTSTRAP_ADMIN_PASSWORD='replace-with-a-strong-local-password' \
pnpm db:seed
```

Use a unique local-development password rather than the example value. The bootstrap process should be run only against an environment you control.

The seeded account is intended to provide the initial administrative login. Follow the application's configured authentication flow to sign in.

### 6. Start the applications

```bash
pnpm dev
```

The development command starts the applications in parallel through Turborepo.

| Service         | URL                                                          | Description           |
| --------------- | ------------------------------------------------------------ | --------------------- |
| Web application | [http://localhost:3000](http://localhost:3000)               | Frontend              |
| Public wizard   | [http://localhost:3000/apply](http://localhost:3000/apply)   | Submit a profile      |
| Admin login     | [http://localhost:3000/login](http://localhost:3000/login)   | Administrator sign-in |
| API             | [http://localhost:8080/api/v1](http://localhost:8080/api/v1) | REST API base URL     |

Individual API routes are relative to the API base URL.

## Quickstart — Docker

For a containerized setup, run the following command from the repository root:

```bash
docker compose up --build
```

This builds and starts the services defined in `docker-compose.yml`.

Before using this option, ensure that any required environment variables are supplied through the supported Compose configuration and that database initialization or migrations are handled as expected by the configured services.

If a service does not start, inspect its logs:

```bash
docker compose logs -f
```

To stop the services:

```bash
docker compose down
```

To remove the local database volume and its stored data, use the appropriate volume-removal option only when you are certain the data can be discarded.

## Available scripts

Run these commands from the repository root unless otherwise indicated.

| Command            | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| `pnpm install`     | Install workspace dependencies.                                       |
| `pnpm dev`         | Start the API and web application in development mode.                |
| `pnpm build`       | Build the configured workspaces.                                      |
| `pnpm typecheck`   | Run TypeScript checks across the workspaces.                          |
| `pnpm lint`        | Run linting across the workspaces.                                    |
| `pnpm db:generate` | Generate a Drizzle migration diff from the schema.                    |
| `pnpm db:migrate`  | Apply the configured SQL migration, currently `api/drizzle/init.sql`. |
| `pnpm db:seed`     | Bootstrap the initial administrator account.                          |

The scripts above reflect the repository's documented root-level commands. Refer to the root `package.json` for the authoritative command definitions.

### Database workflow

When changing the database schema:

1. Update the relevant Drizzle schema definitions.
2. Generate a migration using `pnpm db:generate`.
3. Review the generated SQL before applying it.
4. Apply the migration using the configured migration workflow.
5. Test the changes against PostgreSQL.
6. Commit the schema and migration changes together.

The migration-generation command and the migration-application command serve different purposes. Generating a migration does not, by itself, apply that migration to the database.

## API overview

The API exposes CRUD operations for user profiles. A profile is composed of four related objects, submitted together when creating a user.

### Core endpoints

| Method   | Endpoint            | Description                                  |
| -------- | ------------------- | -------------------------------------------- |
| `POST`   | `/api/v1/users`     | Create a profile and its related records.    |
| `GET`    | `/api/v1/users`     | Retrieve the user collection.                |
| `GET`    | `/api/v1/users/:id` | Retrieve a specific user's complete profile. |
| `PATCH`  | `/api/v1/users/:id` | Update an existing profile.                  |
| `DELETE` | `/api/v1/users/:id` | Delete a profile and its dependent records.  |

These routes are relative to the API base URL shown above. Access requirements and supported query parameters should be verified against the implementation.

### Profile data model

The request model contains four objects:

| Object          | Data                                                                         |
| --------------- | ---------------------------------------------------------------------------- |
| `userInfo`      | Profile photo, first name, last name, date of birth, occupation, and gender. |
| `userContact`   | Email, phone number, optional fax, and optional LinkedIn URL.                |
| `userAddress`   | Address, city, state, country, and ZIP/postal code.                          |
| `userAcademics` | A collection of academic background records.                                 |

The API persists these related records through the backend's database layer. The intended create operation uses a single HTTP request, with transactional persistence to prevent partial records if a database operation fails.

### Additional functionality

The application also supports profile document exports in PDF and DOCX formats.

For the exact document-export routes, authentication requirements, request schemas, response formats, and any generated API documentation, refer to the implementation and its API documentation configuration.

## Authentication and security

The public submission workflow and administrative functionality have different access requirements.

- Public submission is available through the user-facing wizard.
- Administrative access is protected by the application's authentication and authorization mechanisms.
- Database access is performed by the backend through Drizzle ORM.
- Database credentials and signing secrets must remain server-side.
- Frontend validation complements, but does not replace, backend validation.

For local development, use the seeded administrator account created through the bootstrap process. Do not reuse development credentials in a production environment.

Before production deployment, ensure that authentication configuration, authorization rules, rate limiting, CORS settings, database permissions, and secret management are appropriate for the deployment environment.

## Testing and quality checks

Before submitting changes or deploying the application, run the available quality checks:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

These commands cover static analysis, linting, and the configured build process.

The following behaviors are particularly important to verify when developing or reviewing the application:

- Valid and invalid profile submissions.
- Persistence of all four related data objects.
- Transaction rollback when a related database operation fails.
- Retrieval, update, and deletion of existing profiles.
- Preservation of form values when navigating between wizard steps.
- Administrative access restrictions.
- Correct PDF and DOCX generation, including profiles with multiple academic records.
- Handling of missing profiles, optional fields, and API errors.

Run the test commands configured by the repository's package scripts as well. The checks above should not be interpreted as proof that every behavior has been tested; report test results based on the commands actually executed.

## Dependency versions

Direct dependency versions use caret (`^`) ranges based on the versions selected during initial development. This allows compatible updates within the permitted semver range without automatically crossing a breaking major version.

The principal technology versions selected during scaffolding include:

- NestJS 11
- Next.js 15
- React 19
- Tailwind CSS 4
- Drizzle ORM 0.36
- Redux Toolkit 2.5
- React Hook Form 7.54
- Zod 3.24

These are the baseline versions recorded during scaffolding, not a guarantee of the versions currently installed after dependency updates. Refer to the package manifests and lockfile for the exact resolved versions.

The project also pins certain dependencies to specific major-version lines where compatibility with the existing toolchain or NestJS validation conventions is important. Review dependency upgrades carefully and run the full set of quality checks after updating packages.

For reproducible installations, keep `pnpm-lock.yaml` committed and use the lockfile-aware installation workflow in CI.

## Troubleshooting

### Database connection errors

- Confirm PostgreSQL is running.
- Verify the database exists and the connection string is correct.
- Check the host, port, credentials, and database name in `api/.env`.
- Ensure the database is reachable from the API process.

### Migration errors

- Confirm the database is reachable.
- Check whether the expected initial SQL migration exists.
- Review previous migration state and schema changes before retrying.
- Avoid manually changing database objects in ways that conflict with committed migrations.

### Administrator login failures

- Confirm the seed command completed successfully.
- Verify the credentials used during bootstrap.
- Check the authentication configuration in the API environment.
- Inspect the API logs for authentication or configuration errors.

### Frontend cannot reach the API

- Confirm both applications are running.
- Verify the frontend's configured API URL.
- Check the browser console and API logs.
- Confirm the API's CORS configuration permits the development frontend origin.

### Docker startup failures

- Check container logs using `docker compose logs -f`.
- Verify the required environment variables are available to the relevant services.
- Ensure database initialization completes before migrations or application startup depend on it.

## Project documentation

- [Architecture and conventions](./ARCHITECTURE.md)
- [API source code](./api)
- [Web application source code](./web)
- [Drizzle schema and migrations](./api/drizzle)

See the repository for the complete implementation, environment templates, and workspace configuration.

## AI-assisted development

AI tools were used as part of the development workflow, in accordance with the assessment requirements.

AI assistance was used to support implementation and problem-solving. Architectural decisions, integration behavior, generated code, and test results should be evaluated against the actual repository and verified application behavior.

## License

This repository was developed as part of a technical assessment for IntentTech. No open-source license is specified unless one is explicitly included in the repository.
