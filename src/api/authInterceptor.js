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

// Refreshes the access token when the API says it has expired, then replays
// the request once. All the requests that fail while a refresh is running
// share it. If the refresh fails, the session is over: log out and go to the
// login page.
export function installAuthInterceptor(store, router) {
  const token = store.getters.accessToken;
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  let refreshTokenPromise = null;

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
      } catch {
        await store.dispatch("logout");
        const current = router.currentRoute.value;
        if (current.name !== "Login") {
          router.push({ name: "Login", query: { next: current.fullPath } });
        }
        return Promise.reject(error);
      }

      config.retriedAfterRefresh = true;
      config.headers.Authorization = `Bearer ${accessToken}`;
      return axios.request(config);
    }
  );
}
