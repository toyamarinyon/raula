# Laura
Type-safe 3.5kb router.

**It alpha version.**

## Walk-though
```tsx
// routes.tsx
import { Hello } from "./pages/Hello";
import { World } from "./pages/World";
import { createRoutes } from "raula";
export const routes = createRoutes()
  .add("/", <Hello />)
  .add("/world", <World />);

// App.tsx
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

// ./pages/Hello.tsx
import { Link } from "raula";
import { routes } from "../routes";

// routes.path knows all path and you can chose a path on type hints
export const Hello = (): JSX.Element => (
  <div>
    Hello
   
    <Link to={routes.path["/world"]()}>World</Link>
  </div>
);

```

# To do

- [ ] Define a route with param such as `/posts/:postId`.
- [ ] Define a sub route.
- [ ] Define a auth route.(middleware)