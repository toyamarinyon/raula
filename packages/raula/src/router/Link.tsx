import { inferRoute } from '../core'
import { replacePathParam } from './replacePathParam'
import { Routing, useRouter } from './useRouter'
import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
  useCallback,
} from 'react'
import { AnyZodObject, z } from 'zod'

type AnchorOmitted = Omit<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  'href' | 'onClick'
>
type LinkProps<Path extends keyof inferRoute<Routing>> =
  Path extends `/${infer _}/:${infer Param}`
    ? inferRoute<Routing>[Path]['search'] extends AnyZodObject
      ? AnchorOmitted & {
          to: Path
          params: { [K in Param]: string | number }
          search?: z.infer<inferRoute<Routing>[Path]['search']>
        }
      : AnchorOmitted & {
          to: Path
          params: { [K in Param]: string | number }
        }
    : inferRoute<Routing>[Path]['search'] extends AnyZodObject
    ? AnchorOmitted & {
        to: Path
        search?: z.infer<inferRoute<Routing>[Path]['search']>
      }
    : AnchorOmitted & {
        to: Path
      }

export function Link<Path extends keyof inferRoute<Routing>>({
  to,
  children,
  ...props
}: LinkProps<Path>): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const args = props as { search?: any; params?: any }
  const { router } = useRouter()
  const handleClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (event) => {
      event.preventDefault()
      router.push(to, {
        search: args.search,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        params: args.params,
      })
    },
    [router, to, args]
  )
  return (
    <a
      {...props}
      onClick={handleClick}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      href={replacePathParam(to, args.params ?? ({} as any))}
    >
      {children}
    </a>
  )
}
