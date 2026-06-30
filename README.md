# Task Dashboard

## About the Project

Task Dashboard is a demo Angular application for task management, built using
modern Angular features such as Signals, Standalone Components, the `inject()`
API, the new Control Flow syntax, and more.

The primary goal of this project is not only to demonstrate a working
application, but also to showcase an approach to building a scalable and
maintainable architecture where business logic is separated from presentation,
keeping UI components as simple and reusable as possible.

## Getting Started

The project consists of two parts that run independently: the Angular frontend
and a mock REST API backend.

### Frontend

Start the Angular development server:

```bash
npm start
```

Once it's running, open your browser at `http://localhost:4200/`. The
application reloads automatically whenever you change a source file.

### Backend

The backend is a mock REST API powered by [json-server](https://github.com/typicode/json-server),
which serves data from `db.json` on port `3000`.

Start the server with:

```bash
npm run api
```

For convenience, this command is added to `package.json` as a dedicated script,
so there's no need to remember the full `json-server` invocation.

## Architecture

### Feature-Based Project Structure

The project follows a feature-based structure instead of a classic technical
folder structure such as `pages`, `services`, `components`, etc.

Files are grouped by their logical domain and responsibility inside the
application.

For example, all files related to the Dashboard feature are located close to
each other:

- dashboard components
- dashboard store
- dashboard services
- dashboard models
- dashboard-specific UI logic

This approach makes the project easier to navigate and scale because each
feature is self-contained and owns its internal implementation details.

Compared to a classic folder-by-type structure, this helps to:

- keep related files close together;
- reduce unnecessary navigation across the project;
- make feature boundaries clearer;
- simplify refactoring and future development;
- avoid turning global folders into large, unstructured collections of
  unrelated files.

As the application grows, new features can be added as independent modules or
folders without affecting the rest of the codebase.

### Reusable UI Components

All common UI elements are extracted into a dedicated UI component library.

Examples include:

- Button
- Input
- Modal
- Spinner
- Banner
- and other shared UI components.

Each component is responsible only for presentation and contains no business
logic.

This approach provides several benefits:

- components can be reused throughout the application;
- the UI remains visually consistent;
- the project becomes easier to maintain and extend.

### Centralized State Management

The application uses a custom Store built with Angular Signals.

The Store acts as the application's Single Source of Truth.

Its responsibilities include:

- loading data from the server;
- storing the current task state;
- refreshing data after mutations;
- exposing derived state (such as task counts or board columns);
- applying local filters without triggering additional server requests.

This approach keeps components as lightweight as possible.

Components are completely unaware of where the data comes from or how it is
updated. They simply render the current state and dispatch user actions.

As a result, the application is easier to test, maintain, and evolve over time.

### Server Synchronization Strategy

The current implementation uses the simplest and most reliable synchronization
strategy.

After every data mutation (create, update, delete, or status change), the
application performs a fresh request to retrieve the latest state from the
server.

This approach provides several advantages:

- the client state always matches the server state;
- there is no risk of data inconsistencies;
- the implementation remains straightforward and easy to maintain.

At the same time, the architecture is designed to support more advanced
synchronization strategies in the future.

For example, Drag & Drop interactions can be implemented using an Optimistic UI
approach:

- the user immediately sees the updated interface;
- the local Store is updated before the server responds;
- the request is processed in the background;
- if the server confirms the change, no further action is required;
- if the request fails, the Store simply rolls back to the previous state.

This strategy provides a significantly more responsive user experience without
requiring architectural changes.

### Error Handling

Application-wide error handling is centralized through an HTTP Interceptor.

All HTTP errors pass through a single error handling pipeline.

Whenever an error occurs, the user is automatically notified via a global Banner
component.

This approach:

- eliminates duplicated error handling across services;
- provides a consistent user experience;
- simplifies maintenance and future enhancements.

### Authentication

Every outgoing HTTP request automatically passes through an HTTP Interceptor
that attaches the current user's session token.

Neither components nor services contain authentication-related logic—they work
exclusively with business data.

This keeps the codebase clean and allows the authentication mechanism to be
replaced without affecting the application's business logic.

### Localization

For this demo project, localization is implemented using the simplest possible
approach.

All user-facing strings are stored in a dedicated constants file.

This solution is perfectly sufficient for a small demo application or a coding
assignment.

If the project grows, it can easily be replaced with a more robust localization
solution such as `ngx-translate` or Angular i18n.

### Modern Angular Features

This project demonstrates the use of modern Angular capabilities, including:

- Standalone Components
- Signals
- Computed Signals
- Dependency Injection with `inject()`
- New Control Flow (`@if`, `@for`)
- Reactive Forms
- Functional HTTP Interceptors
- Lazy Loading
- Reactive change detection powered by Angular Signals

## TODO

Plans for further development and improvement of the project.

### Update the Store locally instead of reloading

Currently, every mutation runs `tap(() => this.load())` — a repeated GET request
for the entire task list. Instead, the `_tasks` signal can be mutated directly
with whatever the server returns:

```ts
// create — the server returns the ready task with an id
tap(created => this._tasks.update(list => [...list, created]))

// updateStatus — the server returns the updated task
next: updated => this._tasks.update(list =>
  list.map(t => t.id === updated.id ? updated : t))

// delete — the response is void, so we filter by id
next: () => this._tasks.update(list => list.filter(t => t.id !== id))
```

**What this addresses:**

- **Redundant requests** — fully: one request instead of two, with no UI
  flickering.
- **Parallel GETs** — almost fully: `load()` remains only on startup and manual
  refresh, with no more parallel GETs triggered by write operations.
- **Loading flag flickering** — significantly: there is no nested `load()` that
  toggles the flag again.

### Improve the error banner behavior

Add automatic dismissal after a timeout so that error messages don't stay on the
screen indefinitely.

### Extract the dropdown into a reusable component

Create the dropdown as a separate component in the shared UI library so it can
be reused.
