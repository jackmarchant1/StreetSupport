import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const root = ReactDOM.createRoot(document.getElementById('root'));
const stripePromise = loadStripe('pk_test_51PBb2OCxJlYqOmKBoqVFE7cyhj99pnPBpA57VilAIWpB1yodR7NpCRTiGUgemxQFZIKrg819GkbVEA8hDtY58x4H00KZ2Vxp5g');

root.render(
  <React.StrictMode>
      <Elements stripe={stripePromise}>
          <AuthProvider>
              <App />
          </AuthProvider>
      </Elements>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
