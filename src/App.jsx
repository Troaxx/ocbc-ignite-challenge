import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { HomePage, LoginPage, NotFoundPage } from "./pages";
import { Layout } from "./components";

function App() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage /> 
    },
    {
      path: '/',
      element: <Layout />,
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
    <RouterProvider router={router} />
  );
};

export default App;