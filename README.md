# NullishConsole

[![npm version](https://badge.fury.io/js/nullish-logger.svg)](https://www.npmjs.com/package/nullish-logger)

A lightweight, configurable javascript console wrapper with selective method suppression. Perfect for toggling debug output without removing logging code.

## Features

- Toggle all logging output at will
- Selectively suppress specific log methods
- Runtime configuration
- No dependencies
- Preserves original console behavior
- Zero global scope pollution
- Terse syntax

## Installation

```bash
npm install nullish-logger
```

## Basic Usage

```javascript
import { debug } from './nullish-console.js';
debug?.log('This works like console.log');
debug?.table({ 'tested' : true });
debug?.info('all console features are available');
```

Essentially, you just use it as a direct replacement to the `console` object. With one key difference. Use the optional chaining operator
to access the methods.

### Change Settings On The Fly
```javascript
import { instance as nc, debug } from './nullish-console.js';
nc.enabled = false;
debug?.log('suppressed');
nc.enabled = true;
debug?.log('now it works');
debug?.warn('suppressed');
nc.quiet = false;
debug?.warn('not suppressed anymore');
```

### Custom Configuration

```javascript
import { NullishConsole } from './nullish-console.js';
const nc = new NullishConsole();
nc.suppress = [ 'error', 'warn' ];
const debug = nc.logger;
debug?.error('suppressed');
debug?.warn('also suppressed');
debug?.info('works');
```

### Properties

- `enabled` (boolean) - Master switch for all logging
- `quiet` (boolean) - When true, suppresses methods in suppress list
- `suppress` (string[]) - Array of console methods to suppress when quiet

## Advanced Usage

### Conditional Activation

Automatically enable/disable verbose logging based on the detected environment.

```javascript
import { instance as nc, debug } from './nullish-console.js';
const debug = new NullishConsole().logger;

if (process.env.NODE_ENV === 'production') {
    nc.enabled = false;
}

debug?.log('Initializing...'); // only outputs in dev env
```

### Conditional Execution

 When `NullishLogger` is disabled. `debug === null`. So you can use it as a conditional for running other debug code.

```javascript
debug && doSomething();

if (debug && !test()) {
  debug?.warn('uh-oh');
} else {
  debug?.info('perfect');
}
```