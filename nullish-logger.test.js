import { NullishLogger, debug } from './nullish-logger.js';

// Create test instance
const debugConsole = new NullishLogger();

// Test output capture
const testOutput = {
    logs: [],
    capture: function(method, ...args) {
        this.logs.push({ method, args });
        // Still allow real console for test feedback
        if (method === 'log' && args[0]?.includes('✓')) {
            originalConsole.log(...args);
        }
    },
    clear: function() {
        this.logs.length = 0;
    }
};

// Store original console methods
const originalConsole = {};
['log', 'info', 'warn', 'error', 'assert'].forEach(method => {
    originalConsole[method] = console[method];
    console[method] = (...args) => testOutput.capture(method, ...args);
});


// Test 0: Instance export
try {
    testOutput.clear();
    
    // Import the instance specifically to test
    const { instance } = await import('./nullish-logger.js');
    
    // Verify it's a NullishLogger instance
    originalConsole.assert(
        instance instanceof NullishLogger,
        'Exported instance is not a NullishLogger'
    );
    
    // Test the instance works
    instance.enabled = true;
    instance.logger.log('test instance');
    originalConsole.assert(
        testOutput.logs.length === 1 &&
        testOutput.logs[0].method === 'log' &&
        testOutput.logs[0].args[0] === 'test instance',
        'Exported instance logging failed'
    );
    
    originalConsole.log('✓ Instance export test passed');
} catch (e) {
    originalConsole.error('✗ Instance export test failed:', e.message);
}

// Test 1: Basic logging
try {
    testOutput.clear();
    debug.log('test message');
    originalConsole.assert(
        testOutput.logs.length === 1 &&
        testOutput.logs[0].method === 'log' &&
        testOutput.logs[0].args[0] === 'test message',
        'Basic logging failed'
    );
    originalConsole.log('✓ Basic logging test passed');
} catch (e) {
    originalConsole.error('✗ Basic logging test failed:', e.message);
}

// Test 2: Default settings
try {
    testOutput.clear();
    debug.info('should be suppressed');
    debug.warn('should be suppressed');
    debug.log('should appear');
    originalConsole.assert(
        testOutput.logs.length === 1 &&
        testOutput.logs[0].method === 'log',
        'Method suppression failed'
    );
    originalConsole.log('✓ Default settings test passed');
} catch (e) {
    originalConsole.error('✗ Default settings test failed:', e.message);
}

// Test 3: Toggle logging
try {
    testOutput.clear();
    debugConsole.enabled = false;
    debug?.log('should not appear');
    originalConsole.assert(
        testOutput.logs.length === 0,
        'Disable logging failed'
    );
    
    debugConsole.enabled = true;
    debug.log('should appear');
    originalConsole.assert(
        testOutput.logs.length === 1,
        'Enable logging failed'
    );
    originalConsole.log('✓ Toggle test passed');
} catch (e) {
    originalConsole.error('✗ Toggle test failed:', e.message);
}

// Test 4: Quiet mode toggle
try {
    testOutput.clear();
    debugConsole.quiet = false;
    debug.info('should appear');
    debug.warn('should appear');
    originalConsole.assert(
        testOutput.logs.length === 2,
        'Quiet mode disable failed'
    );
    
    debugConsole.quiet = true;
    debug.info('should not appear');
    debug.warn('should not appear');
    originalConsole.assert(
        testOutput.logs.length === 2,
        'Quiet mode enable failed'
    );
    originalConsole.log('✓ Quiet mode test passed');
} catch (e) {
    originalConsole.error('✗ Quiet mode test failed:', e.message);
}

// Test 5: Suppress list modification
try {
    testOutput.clear();
    debugConsole.suppress = ['error'];
    debug.info('should appear');
    debug.error('should not appear');
    originalConsole.assert(
        testOutput.logs.length === 1 &&
        testOutput.logs[0].method === 'info',
        'Suppress list modification failed'
    );
    
    // Test invalid suppress values
    try {
        debugConsole.suppress = 'error';
        throw new Error('Should have rejected non-array');
    } catch (e) {
        if (!(e instanceof TypeError)) {
            throw new Error('Wrong error type for invalid suppress');
        }
    }
    originalConsole.log('✓ Suppression test passed');
} catch (e) {
    originalConsole.error('✗ Suppression test failed:', e.message);
}

// Test 6: Conditional execution
try {
    testOutput.clear();
    let executed = false;
    
    debugConsole.enabled = true;
    debug && (executed = true);
    originalConsole.assert(executed === true, 'Conditional execution failed when enabled');
    
    debugConsole.enabled = false;
    executed = false;
    debug && (executed = true);
    originalConsole.assert(executed === false, 'Conditional execution failed when disabled');
    
    originalConsole.log('✓ Conditional execution test passed');
} catch (e) {
    originalConsole.error('✗ Conditional execution test failed:', e.message);
}

// Test 7: Conditional activation
try {
    testOutput.clear();
    const originalEnv = process.env.NODE_ENV;
    
    process.env.NODE_ENV = 'production';
    debugConsole.enabled = false;
    debug?.log('should not appear');
    originalConsole.assert(
        testOutput.logs.length === 0,
        'Production environment handling failed'
    );
    
    process.env.NODE_ENV = originalEnv;
    originalConsole.log('✓ Conditional activation test passed');
} catch (e) {
    originalConsole.error('✗ Conditional activation test failed:', e.message);
}

// Cleanup
['log', 'info', 'warn', 'error', 'assert'].forEach(method => {
    console[method] = originalConsole[method];
});