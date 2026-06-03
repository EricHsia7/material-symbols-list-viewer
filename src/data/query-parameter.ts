export function getQueryParameter(query: string): string | null {
  const url = new URL(window.location.href);
  const value = url.searchParams.get(query);
  return value;
}
