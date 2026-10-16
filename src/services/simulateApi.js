// Simulates network behaviour: latency (300-800ms) + optional random failures.
export const serviceConfig = { minDelay: 300, maxDelay: 800, errorRate: 0 };

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class ServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServiceError';
  }
}

/** Runs `handler` after an artificial delay, like a real HTTP call would. */
export async function simulateRequest(handler) {
  const { minDelay, maxDelay, errorRate } = serviceConfig;
  await wait(minDelay + Math.random() * (maxDelay - minDelay));
  if (Math.random() < errorRate) {
    throw new ServiceError('Network error: the server did not respond. Please retry.');
  }
  return handler();
}
