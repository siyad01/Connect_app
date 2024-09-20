import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/userContext.jsx";
import { PostProvider } from "./context/postContext.jsx";
import ErrorBoundary from "./pages/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <UserProvider>
        <PostProvider>
          <App />
        </PostProvider>
      </UserProvider>
    </ErrorBoundary>
  </StrictMode>
);
