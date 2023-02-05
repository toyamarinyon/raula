
import { Router } from "raula";
import { routes } from "./routes";


const App = (): JSX.Element => {
  return (
    <main>
      <Router routes={routes} />
    </main>
  );
};

export default App;
