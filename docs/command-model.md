---
id: '2-command-model'
title: Command Model
sidebar_label: Command Model
description: A framework-agnostic MVVM Model layer library for querying, storing, and caching data in frontend applications using reactive programming.
slug: /command-model
---

Command Models handle write operations (create, update, delete) and manage parameter state.

### Understanding Mutate

The `mutate` method is the core of Command Models. It handles write operations and manages the command lifecycle:

```typescript
class CreateUserCommandModel extends ReactiveCommandModel<CreateUserParams, User> {
  async mutate(params: CreateUserParams): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    return response.json();
  }
}
```

### Store Architecture

Unlike Query Models, Command Models use a single store instead of a vault because:

- **No parameter-based caching** - Commands don't need to cache by parameters
- **Single state management** - One set of parameters per command
- **Immediate execution** - Commands execute immediately, not on demand

```typescript
// Command store structure
{
  isLoading: boolean;
  params: Partial<PARAMS>;
  // ... extended store properties
}
```

### Parameter Management

Command Models provide built-in parameter management:

```typescript
// Get current parameters
const params = commandModel.getParams();

// Update parameters
commandModel.updateModificationStore({ name: 'John', email: 'john@example.com' });

// Get specific parameter
const name = commandModel.getModificationValueByKey('name');

// Subscribe to parameter changes
commandModel.subscribeToParam().subscribe(({ params, isLoading }) => {
  console.log('Parameters changed:', params);
});
```

### Store Extension

Command Models support extended stores and custom events:

```typescript
class ExtendedCommandModel extends ReactiveCommandModel<
  UserParams,
  User,
  { validationErrors: string[] },
  { onValidationError: (errors: string[]) => void }
> {
  protected initExtendedStore() {
    return {
      initExtendedStore: { validationErrors: [] },
      extendedEvents: (store$) => ({
        onValidationError: (errors: string[]) => {
          store$.next({
            ...store$.value,
            validationErrors: errors
          });
        }
      })
    };
  }
}
```

### Command API Reference

#### Exported Types

```typescript
// Command response type
type CommandModelSubscribeResponse<PARAMS> = {
  params: Partial<PARAMS>;
  isLoading: boolean;
};

// Base command store
type BaseReactiveCommandStore<PARAMS, EXTENDED_STORE> = {
  isLoading: boolean;
  params: Partial<PARAMS>;
} & EXTENDED_STORE;

// Command store with events
type ReactiveCommandStore<PARAMS, EXTENDED_STORE, EXTENDED_EVENTS> = {
  store$: BehaviorSubject<BaseReactiveCommandStore<PARAMS, EXTENDED_STORE>>;
} & BaseReactiveCommandEvents<PARAMS, EXTENDED_STORE> & EXTENDED_EVENTS;
```

#### Protected Methods (Can be overridden)

```typescript
// Override to implement your mutation logic
abstract mutate(...args: any[]): Promise<RESPONSE>;

// Override for initial parameters
getInitialParams(): PARAMS;

// Override for extended store and events
protected initExtendedStore(): {
  initExtendedStore?: EXTENDED_STORE;
  extendedEvents?: (store$: BehaviorSubject<BaseReactiveCommandStore<PARAMS, EXTENDED_STORE>>) => EXTENDED_EVENTS;
};
```

#### Public Methods

```typescript
// Subscribe to store changes
subscribeToParam(): Observable<CommandModelSubscribeResponse<PARAMS>>;

// Parameter management
getModificationValueByKey<T extends keyof PARAMS>(key: T): PARAMS[T] | undefined;
updateModificationStore(params: Partial<PARAMS>): void;
getParams(): PARAMS;
getStore(): BaseReactiveCommandStore<PARAMS, EXTENDED_STORE>;

// State management
updateIsLoading(isLoading: boolean): void;
resetStore(): void;
```