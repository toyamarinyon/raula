import { Router } from "raula";
import { appRouter } from "./routes";

const App = (): JSX.Element => {
  return (
    <div>
      <Router routes={appRouter} />
    </div>
  );
};

export default App;
