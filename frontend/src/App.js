import AuthGate from "./components/AuthGate";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="955280427755-t9juu37a24v9049av3uj7fa89fv4na66.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthGate />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
