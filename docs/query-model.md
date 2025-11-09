---
id: '1-query-model'
title: Query Model
sidebar_label: Query Model
description: A framework-agnostic MVVM Model layer library for querying, storing, and caching data in frontend applications using reactive programming.
slug: /query-model
---

Query Models handle read operations and implement intelligent caching strategies.

### Thinking with Query Models

Query Models are designed around the concept of **parameterized queries** that return cached results. Think of them as smart data fetchers that:

1. **Cache by parameters** - Different parameters create different cache entries
2. **Auto-refresh stale data** - Automatically fetch fresh data when cache expires
3. **Handle loading states** - Provide loading, error, and success states
4. **Retry on failure** - Automatically retry failed requests

### Vault and Store

**Vault**: A collection of stores indexed by hashed parameters. Think of it as a cache container.

**Store**: Individual cache entries containing data, loading states, and metadata.

```typescript
// Vault structure
{
  "user_123": { data: User, isLoading: false, isFetched: true, ... },
  "user_456": { data: User, isLoading: true, isFetched: false, ... },
  "products_filters": { data: Product[], isLoading: false, isFetched: true, ... }
}
```

### Query and Refresh

**Query**: The public method that returns an observable of query results.

**Refresh**: The protected method you implement to fetch data from your API.

```typescript
class UserQueryModel extends ReactiveQueryModel<User> {
  protected async refresh(userId: number): Promise<User> {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }
}

// Usage
const userModel = new UserQueryModel();
const user$ = userModel.query(123); // Observable<User>
```

### Key Hashing and Parameters

Parameters are automatically hashed to create cache keys. The library provides intelligent hashing that:

- Handles primitive values (strings, numbers, booleans)
- Sorts object keys for consistent hashing (Just one layer to avoid heavy time complexity. You can overwrite hashing logics for custom algorithms)
- Handles arrays and nested objects
- Supports custom hashing algorithms

```typescript
// These all create the same hash key
userModel.query({ id: 123, include: 'profile' });
userModel.query({ include: 'profile', id: 123 });

// Different parameters create different cache entries
userModel.query(123);        // Key: "123"
userModel.query(456);        // Key: "456"
userModel.query({ id: 123 }); // Key: '{"id":123}'
```

### Configuration

Query Models support various configuration options:

```typescript
class UserQueryModel extends ReactiveQueryModel<User> {
  protected get configs() {
    return {
      maxRetryCall: 3,           // Retry failed requests 3 times
      cachTime: 5 * 60 * 1000,   // Cache for 5 minutes
      emptyVaultOnNewValue: false, // Keep old cache when new data arrives
      initStore: {
        key: 'default',
        value: { id: 0, name: 'Loading...' },
        staleTime: 60 * 1000
      },
      cacheInvalidationStrategy: CacheInvalidationStrategy.GRACEFUL
    };
  }
}
```

#### Cache Invalidation Strategy Trade-offs
- **FORCE Strategy:**
  - **Pros:** Ensures data is refreshed immediately after cache expiration, giving users access to the latest data quickly.
  - **Cons:** May lead to frequent data fetching even if the data hasn't changed, potentially increasing network load and affecting performance.

- **GRACEFUL Strategy:**
  - **Pros:** Efficient in terms of performance, as it retains data in the cache as long as it's being used. This reduces network requests and minimizes the chances of glitches.
  - **Cons:** Users might experience a delay in data refresh since the cache checks only occur when no active observers are present.

### Query API Reference

#### Exported Types

```typescript
// Main response type for queries
type QueryResponse<DATA> = {
  data?: DATA;
  isLoading: boolean;
  isFetching: boolean;
  isFetched: boolean;
  error?: unknown;
  staled: boolean;
  staleTime?: number;
  lastFetchedTime?: number;
};

// Base store type
type BaseReactiveStore<DATA> = {
  data: DATA;
  isLoading: boolean;
  isFetching: boolean;
  isFetched: boolean;
  error?: unknown;
  staled: boolean;
  staleTime?: number;
  lastFetchedTime?: number;
};

// Vault type for multiple stores
type ReactiveQueryVault<DATA, EVENTS = undefined> = {
  store$: Observable<{ [key: string]: BaseReactiveStore<DATA> }>;
} & QueryVaultEvents<DATA> & EVENTS;
```

#### Protected Methods (Can be overridden)

```typescript
// Override to implement your data fetching logic
protected abstract refresh(params?: unknown): Promise<DATA>;

// Override for custom parameter hashing
protected getHashedKey(params?: unknown): string;

// Override for custom configuration
protected get configs(): {
  maxRetryCall: number;
  cachTime: number;
  emptyVaultOnNewValue: boolean;
  initStore?: {
    key: string;
    value: DATA;
    staleTime?: number;
  };
};
```

#### Public Methods

```typescript
// Main query method
query(params?: unknown, configs?: { staleTime?: number }): Observable<QueryResponse<DATA>>

// Store management
get storeHandler(): {
  invalidate(): void;
  invalidateByKey(params?: unknown): void;
  resetStore(params?: unknown): void;
  resetVault(): void
}

// Utility methods
isSameBaseData(prev: QueryResponse<DATA>, curr: QueryResponse<DATA>): boolean;
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxRetryCall` | `number` | `1` | Maximum retry attempts for failed requests |
| `cachTime` | `number` | `3 * 60 * 1000` | Default cache time in milliseconds |
| `emptyVaultOnNewValue` | `boolean` | `false` | Clear vault when new data arrives |
| `initStore` | `object` | `undefined` | Initial store configuration |
| `cacheInvalidationStrategy` | `CacheInvalidationStrategy` | `CacheInvalidationStrategy.GRACEFUL` | Cache invalidation strategy |
