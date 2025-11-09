---
id: '0-introduction'
title: Introduction
sidebar_label: Introduction
description: A framework-agnostic MVVM Model layer library for querying, storing, and caching data in frontend applications using reactive programming.
slug: /introduction
---

# Reactive Query

A framework-agnostic library for model part in MVVM architectural pattern, automating querying, storing, and caching data in frontend applications based on MVVM or any MV*, CQS, and reactive programming paradigms.

## Description

Reactive Query is a framework-agnostic library designed specifically for the **Model** part in the **MVVM (Model-View-ViewModel)** or any MV* architectural pattern. It automates the process of querying, storing, and managing data in frontend applications by implementing **CQS (Command Query Separation)** and **reactive programming** paradigms.

The library provides a bridge between **push-based** and **pull-based** rendering strategies, enabling granular control over re-rendering in pull-based frameworks like React and Vue while maintaining the efficiency of push-based frameworks like Angular.

## Motivation

In modern frontend development, there's a significant gap in libraries that can effectively manage data and automate the processes of managing, caching, and invalidating data in frontend applications while fitting seamlessly into the MVVM architectural pattern. Most existing solutions either:

- Don't follow any software architectural patterns principles
- Lack proper single responsibility 
- Don't provide granular control over re-rendering
- Are framework-specific rather than framework-independent

We created Reactive Query to address these challenges by providing a specialized library that handles all logic related to data manipulation in the Model part of MVVM or any MV*.

### Bridge Between Push and Pull Strategies

Modern frontend frameworks use different rendering strategies:

**Push-based (Angular):** The framework automatically detects changes and re-renders components when data changes.

**Pull-based (React/Vue):** Components must explicitly request re-renders when their state changes.

Reactive Query bridges this gap by providing reactive observables that can be easily connected to pull-based frameworks. For example, in React, you can pipe and map changes to specific object keys, triggering `setState` only when relevant data changes:

```typescript
// Instead of re-rendering on any data change
userModel.query().subscribe(setUserData);

// You can be granular and only re-render when specific fields change
userModel.query().pipe(
  distinctUntilChanged((prev, next) => prev.places.length === next.places.length)
).subscribe(setPlaces);
```

### CQS Pattern Implementation

We implemented the **Command Query Separation (CQS)** pattern to handle different types of data operations:

- **Queries**: Read operations that don't modify state of the software and just need to be cached and refresh the data in some scenarios.
- **Commands**: Write operations that modify software state

This separation allows for better performance, caching strategies, and state management. For more information about CQS, see [Command Query Separation](https://martinfowler.com/bliki/CommandQuerySeparation.html).

### Reactive Programming with RxJS

To provide subscribing capabilities and maintain framework agnosticism, we use the reactive programming paradigm with RxJS. This enables:

- Automatic subscription management
- Powerful data transformation operators
- Framework-independent state management
- Efficient change detection and propagation

## Features

- 🏗️ **MVVM Architecture** - Designed specifically for the Model part of MVVM
- 🔄 **CQS Pattern** - Clear separation between Commands and Queries
- ⚡ **Reactive Programming** - Built on RxJS for real-time state updates
- 💾 **Smart Caching** - Automatic caching with configurable stale times
- 🔄 **Retry Mechanism** - Built-in retry logic for failed operations
- 🎯 **TypeScript Support** - Full TypeScript support with type safety
- 📦 **Lightweight** - Minimal bundle size with zero dependencies (except RxJS)
- 🔧 **Framework Agnostic** - Works with any frontend framework
- 🎛️ **Granular Control** - Fine-grained control over re-rendering
- 🔌 **Extensible** - Easy to extend with custom stores and events

## Installation

```bash
npm install reactive-query rxjs
# or
yarn add reactive-query rxjs
# or
pnpm add reactive-query rxjs
```

## Architecture Overview

Reactive Query follows a clear architectural pattern:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Query Models  │    │  Command Models │    │     Stores      │
│                 │    │                 │    │                 │
│ • ReactiveQuery │    │ • ReactiveCmd   │    │ • Query Vault   │
│ • Caching       │    │ • Mutations     │    │ • Command Store │
│ • Parameters    │    │ • Parameters    │    │ • Events        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   RxJS Streams  │
                    │                 │
                    │ • Observables   │
                    │ • Subscriptions │
                    │ • Operators     │
                    └─────────────────┘
```


## Adapters

### React Integration

For seamless React integration, we provide a dedicated React adapter library: [reactive-query-react](https://github.com/behnamrhp/reactive-query-react)

#### Using the React Adapter (Recommended)

```bash
npm install reactive-query-react
```

```tsx
import React, { useRef } from 'react';
import { useRXQuery } from 'reactive-query-react';
import { ReactiveQueryModel } from 'reactive-query';

class TodoQueryModel extends ReactiveQueryModel<Todo[]> {
  protected async refresh(): Promise<Todo[]> {
    const response = await fetch('/api/todos');
    return response.json();
  }
}

function TodoList() {
  const todoModel = useRef(new TodoQueryModel()).current;
  const queryData = useRXQuery(todoModel.query);

  if (queryData.loading) {
    return <p>Loading...</p>;
  }

  if (queryData.error) {
    return <p>Error: {queryData.error.message}</p>;
  }

  return (
    <ul>
      {queryData.data?.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

> Note: This library act as the Model in the MV* architectures, highly suggested to be used beside of [ReactVVM](https://github.com/behnamrhp/React-VVM) which acts as the ViewModel and View in the MVVM. With these two approaches you can have solid MVVM architecture in your react application in any scale of projects.

### Svelte
For now we don't have any adapter for Svelte but to see an example of how to use it with Svelte You can check this [gist](https://gist.github.com/behnamrhp/4058a739a551548ec1baddbe8a4ebe87)

## Contributing

You can contribute to the project from this [GitHub repository](https://github.com/Reactive-Query-Lab/reactive-query) by:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request