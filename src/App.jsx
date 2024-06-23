import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from './context/AuthContext.jsx'
import { FetchClientsProvider } from "./context/FetchClientsContext.jsx";

import { AddClientPage, ClientManagePage, HomePage, LoginPage, NotFoundPage, SingleClientPage, TransactionsPage } from "./pages";
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
          path: 'singlePage/:clientId',
          element: <SingleClientPage />
        },
        {
          path: 'transactions',
          element: <TransactionsPage />,
        },
        {
          path: 'addClient',
          element: <AddClientPage />,
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
      <FetchClientsProvider>
        <RouterProvider router={router} />
      </FetchClientsProvider>
    </AuthProvider>
  );
};

export default App;