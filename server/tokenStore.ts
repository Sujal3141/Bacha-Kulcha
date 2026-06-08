/**
 * Shared server-side state for cross-service access.
 * Stores the latest Google OAuth access token so email notifications
 * can be dispatched from any service route without requiring the
 * frontend to pass the token on every request.
 */

let _googleAccessToken: string | null = null;

export function setGoogleAccessToken(token: string) {
  _googleAccessToken = token;
}

export function getGoogleAccessToken(): string | null {
  return _googleAccessToken;
}
