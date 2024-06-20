import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx'

import { HomePage, LoginPage, NotFoundPage } from "./pages";
import { Layout, ProtectedRoute } from "./components";

function App() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/',
      element: <ProtectedRoute> <Layout /> </ProtectedRoute>,
      children: [
        {
          index: true,
          element: <HomePage />,
        },

      ]
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;