import { Link, useRouter } from "raula";
export const Hello = (): JSX.Element => {
  const { router } = useRouter();
  return (
    <div>
      Hello
      <Link to="/world">world</Link>
    </div>
  );
};
