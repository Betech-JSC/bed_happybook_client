export async function measureSimDuLichServerTiming<T>(
  label: string,
  task: () => Promise<T>
): Promise<T> {
  const startedAt = performance.now();

  try {
    return await task();
  } finally {
    if (process.env.NODE_ENV !== "production") {
      const duration = Math.round(performance.now() - startedAt);
      console.info(`[sim-du-lich][ssr] ${label}: ${duration}ms`);
    }
  }
}
