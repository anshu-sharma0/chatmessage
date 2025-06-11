import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
    domain="dev-sitmsvuahiop7vn7.us.auth0.com"
    clientId="CDLilOlaP4lrFzhtCUaq8Fmr8prqW6u9"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}

  >
    <RouterProvider router={router} />
    </Auth0Provider>
  </StrictMode>
);
