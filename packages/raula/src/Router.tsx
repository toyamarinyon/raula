import {
  AnchorHTMLAttributes,
  createContext,
  DetailedHTMLProps,
  MouseEventHandler,
  useCallback,
  useEffect,
  useContext,
  useMemo,
  useState,
} from "react";
import { BrowserHistory, createBrowserHistory } from "history";
import { RoutesBuilder } from "./RoutesBuilder";

interface Router {
  history: BrowserHistory;
}
const RouterContext = createContext<Router>({} as Router);

type LinkProps = Omit<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  "href" | "onClick"
> & {
  to: string;
};
export const Link = ({ to, children, ...props }: LinkProps) => {
  const { router } = useRouter();
  const handleClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (event) => {
      event.preventDefault();
      router.push(to);
    },
    [router, to]
  );
  return (
    <a {...props} onClick={handleClick} href={to}>
      {children}
    </a>
  );
};

export const useRouter = () => {
  const router = useContext(RouterContext);
  return { router: router.history };
};

type Props = {
  routes: RoutesBuilder;
};
export const Router = ({ routes }: Props): JSX.Element => {
  const history = useMemo(() => createBrowserHistory(), []);
  const [pathname, setPathname] = useState(history.location.pathname);

  useEffect(() => {
    const cleanup = history.listen(({ location }) => {
      setPathname(location.pathname);
    });
    return () => {
      cleanup();
    };
  }, [history]);
  return (
    <RouterContext.Provider value={{ history }}>
      {routes.resolve(pathname)}
    </RouterContext.Provider>
  );
};
