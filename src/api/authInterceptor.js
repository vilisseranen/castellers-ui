import axios from "axios";

// The API returns this code when the access token has expired.
const TOKEN_EXPIRED = "token_expired";

function isTokenExpired(error) {
  const response = error.response;
  return (
    response &&
    (response.status === 401 || response.status === 403) &&
    response.data &&
    response.data.code === TOKEN_EXPIRED
  );
}

function isAuthEndpoint(url) {
  return /\/api\/v1\/(login|refresh|logout)$/.test(url || "");
}

// The API rejected the refresh token itself (expired, revoked or invalid), as
// opposed to a network error or a server error.
function isRefreshRejected(error) {
  return Boolean(error.response && error.response.status < 500);
}

// Refreshes the access token when the API says it has expired, then replays
// the request once. All the requests that fail while a refresh is running
// share it. If the API rejects the refresh token, the session is over: log out
// and, on pages that need a login, go to the login page.
export function installAuthInterceptor(store, router) {
  if (store.getters.isLoggedIn) {
    axios.defaults.headers.common.Authorization = `Bearer ${store.getters.accessToken}`;
  } else if (store.getters.accessToken) {
    // The persisted session has expired: forget it, so public pages are
    // loaded anonymously.
    store.dispatch("reset");
  }

  let refreshTokenPromise = null;
  let sessionEnding = false;

  async function endSession() {
    if (sessionEnding) {
      return;
    }
    sessionEnding = true;
    try {
      await store.dispatch("logout");
      const current = router.currentRoute.value;
      const needsLogin = current.matched.some(
        (record) => record.meta.requiresAuth
      );
      if (needsLogin && current.name !== "Login") {
        await router.push({
          name: "Login",
          query: { next: current.fullPath },
        });
      }
    } finally {
      sessionEnding = false;
    }
  }

  axios.interceptors.response.use(
    (response) => response,
    async function (error) {
      const config = error.config;
      if (
        !config ||
        config.retriedAfterRefresh ||
        // Requests made with a token from an email link: refreshing the
        // session would replay them as the logged-in user.
        config.explicitToken ||
        isAuthEndpoint(config.url) ||
        !isTokenExpired(error)
      ) {
        return Promise.reject(error);
      }
      config.retriedAfterRefresh = true;

      // The request was sent with an older token than the current one (it
      // failed after another request already refreshed the session).
      const currentToken = store.getters.accessToken;
      if (
        currentToken &&
        config.headers.Authorization !== `Bearer ${currentToken}`
      ) {
        config.headers.Authorization = `Bearer ${currentToken}`;
        return axios.request(config);
      }

      if (!refreshTokenPromise) {
        refreshTokenPromise = store
          .dispatch("refreshToken")
          .then((response) => response.data.access_token)
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      let accessToken;
      try {
        accessToken = await refreshTokenPromise;
      } catch (refreshError) {
        if (!isRefreshRejected(refreshError)) {
          // Network or server error: keep the session, the user can retry.
          return Promise.reject(error);
        }
        await endSession();
        // Public pages still work without a session.
        delete config.headers.Authorization;
        return axios.request(config);
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
      return axios.request(config);
    }
  );
}
