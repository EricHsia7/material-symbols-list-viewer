export function getQueryParameter(query: string): string | null {
  const url = new URL(window.location.href);
  const value = url.searchParams.get(query);
  return value;
}

export function setQueryParameter(query: string, value: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set(query, value);
  window.history.pushState({ page: 1 }, '', url.toString());
}
