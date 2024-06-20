import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage, LoginPage } from "./pages";

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