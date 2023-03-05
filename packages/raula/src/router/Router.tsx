import { RoutingBuilder } from '../core/createRouting'
import { BrowserHistory, createBrowserHistory, History } from 'history'
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'

interface TRouterContext {
  history: BrowserHistory
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: RoutingBuilder<any>
}
export const RouterContext = createContext<TRouterContext>({} as TRouterContext)

export interface RouterLayout {
  page: JSX.Element
}

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: RoutingBuilder<any>
  overrideHistory?: History
  children?: ReactNode
}
export const Router = ({
  routes,
  overrideHistory,
  children,
}: Props): JSX.Element => {
  const history = useMemo(
    () => overrideHistory ?? createBrowserHistory(),
    [overrideHistory]
  )
  const [location, setLocation] = useState(history.location)

  useEffect(() => {
    const cleanup = history.listen(({ location }) => {
      setLocation(location)
    })
    return () => {
      cleanup()
    }
  }, [history])
  return (
    <RouterContext.Provider value={{ history, routes }}>
      <>
        {routes.resolve(location.pathname, location.search)}
        {/* children props are used for test */}
        {children}
      </>
    </RouterContext.Provider>
  )
}
