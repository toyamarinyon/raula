import { createRouting } from '../core'
import { Link } from './Link'
import { Router } from './Router'
import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { expect, it } from 'vitest'

it('pushes a route on click', () => {
  const routes = createRouting()
    .add('/', () => (
      <div>
        <Link to="/users">Link to user</Link>Hello
      </div>
    ))
    .add('/users', () => <div>users</div>)
  const history = createMemoryHistory({ initialEntries: ['/'] })
  render(<Router routes={routes} overrideHistory={history} />)
  fireEvent.click(screen.getByRole('link'))
  expect(history.location.pathname).toBe('/users')
})
