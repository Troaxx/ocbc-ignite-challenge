import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx'

import { ClientManagePage, HomePage, LoginPage, NotFoundPage, TransactionsPage } from "./pages";
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
        {
          path: 'clientManage',
          element: <ClientManagePage />,
        },
        {
          path: 'transactions',
          element: <TransactionsPage />,
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