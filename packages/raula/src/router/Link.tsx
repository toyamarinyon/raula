import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
  useCallback,
} from "react";
import { AnyZodObject, z } from "zod";
import { inferRoute } from "../core";
import { replacePathParam } from "./replacePathParam";
import { Router, useRouter } from "./useRouter";

type AnchorOmitted = Omit<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  "href" | "onClick"
>;
type LinkProps<Path extends keyof inferRoute<Router>> =
  Path extends `/${infer _}/:${infer Param}`
    ? inferRoute<Router>[Path]["search"] extends AnyZodObject
      ? AnchorOmitted & {
          to: Path;
          params: { [K in Param]: string | number };
          search?: z.infer<inferRoute<Router>[Path]["search"]>;
        }
      : AnchorOmitted & {
          to: Path;
          params: { [K in Param]: string | number };
        }
    : inferRoute<Router>[Path]["search"] extends AnyZodObject
    ? AnchorOmitted & {
        to: Path;
        search?: z.infer<inferRoute<Router>[Path]["search"]>;
      }
    : AnchorOmitted & {
        to: Path;
      };

export function Link<Path extends keyof inferRoute<Router>>({
  to,
  children,
  ...props
}: LinkProps<Path>): JSX.Element {
  const args = props as { search?: any; params?: any };
  const { router } = useRouter();
  const handleClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (event) => {
      event.preventDefault();
      // @ts-ignore
      router.push(to, {
        search: args.search,
        // @ts-ignore
        params: args.params,
      });
    },
    [router, to]
  );
  return (
    <a
      {...props}
      onClick={handleClick}
      href={replacePathParam(to, args.params ?? ({} as any))}
    >
      {children}
    </a>
  );
}
