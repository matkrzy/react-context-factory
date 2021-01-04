export class ProviderValueError extends Error {
  constructor() {
    super(`Context value shouldn't be set as undefined`);
  }
}

export class InvalidContextUsage extends Error {
  constructor() {
    super(`Context value is undefined. You should use hook inside of the context Provider.`);
  }
}
