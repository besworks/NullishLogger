class NullishLogger {
  #enabled = true;
  #quiet = true;
  #suppress = ['info', 'warn'];
  
  constructor() {
    this.#methods = Object.create(console);
    this.#configure();
  }

  #instance = null;
  #methods = null;
  #noop = () => {};

  #configure() {
    this.#instance = this.#enabled ? this.#methods : null;
    if (this.#instance && this.#quiet) {
      this.suppress.forEach(method => {
        this.#instance[method] = this.#noop;
      });
    } else if (this.#instance) {
      this.suppress.forEach(method => {
        this.#instance[method] = console[method].bind(console);
      });
    }
  }

  get suppress() {
    return [...this.#suppress];
  }

  set suppress(suppressed) {
    if (!Array.isArray(suppressed)) {
      throw new TypeError('Must provide an array of strings');
    }
    
    if (!suppressed.every(method => typeof method === 'string')) {
      throw new TypeError('Must provide an array of strings');
    }

    this.#suppress = [...suppressed];
    this.#configure();
  }

  get logger() {
    return this.#instance;
  }

  get enabled() {
    return this.#enabled;
  }

  set enabled(val) {
    this.#enabled = !!val;
    this.#configure();
  }

  get quiet() {
    return this.#quiet;
  }

  set quiet(val) {
    this.#quiet = !!val;
    this.#configure();
  }
}

const instance = new NullishLogger();
const debug = instance.logger;

export {
  NullishLogger,
  instance,
  debug
}