
import { RouterProvider } from "raula";
import { appRouter } from "./routes";


const App = (): JSX.Element => {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
};

export default App;
