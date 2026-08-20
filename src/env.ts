export type MapboxTokenState =
  | { readonly status: 'missing' }
  | { readonly status: 'secret' }
  | { readonly status: 'ok'; readonly token: string }

export function mapboxTokenState(): MapboxTokenState {
  const value = import.meta.env['VITE_MAPBOX_ACCESS_TOKEN']
  if (typeof value !== 'string') {
    return { status: 'missing' }
  }
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return { status: 'missing' }
  }
  // Mapbox GL JS style requests only accept public tokens in the browser.
  if (trimmed.startsWith('sk.')) {
    return { status: 'secret' }
  }
  if (!trimmed.startsWith('pk.')) {
    return { status: 'missing' }
  }
  return { status: 'ok', token: trimmed }
}
