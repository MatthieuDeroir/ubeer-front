import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain="dev-8fxkevvel3hh1xm2.us.auth0.com"
    clientId="v5Ugyp0BXlwvjdxxO17bRcn7SVuqRHbU"
    useRefreshTokens={true}
    cacheLocation="localstorage"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "ubeer-api",
      scope: "openid profile email",
    }}
  >
      <App />
  </Auth0Provider>,
);
