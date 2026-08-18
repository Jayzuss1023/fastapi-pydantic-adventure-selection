import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import StoryLoader from "./routes/StoryLoader";
import StoryGenerator from "./routes/StoryGenerator";
import Layout from "./components/Layout";
import StoryLoader from "./routes/StoryLoader";

function App() {
  console.log("loading");
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <StoryGenerator />,
        },
        {
          path: "/story/:id",
          element: <StoryLoader />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
