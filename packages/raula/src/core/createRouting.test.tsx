import { createRouting, RoutingBuilder } from './createRouting'
import { render, screen } from '@testing-library/react'
import { it, expect } from 'vitest'
import { z } from 'zod'

it('creates a new route', () => {
  const route = createRouting()
  expect(route).toBeInstanceOf(RoutingBuilder)
})
it('adds a route', () => {
  createRouting().add(
    '/posts/:postId',
    z.object({ hello: z.string() }),
    ({ params }) => <div>{params.postId}</div>
  )
})
it('adds a route with search', () => {
  createRouting().add(
    '/posts/:postId',
    z.object({ hello: z.string() }),
    ({ params, search }) => (
      <div>
        {params.postId}, {search.hello}
      </div>
    )
  )
})
it('resolves a route', () => {
  const route = createRouting()
    .add('/', () => <div>home</div>)
    .add('/hello', () => <div>hello</div>)
    .add('/users/:userId', ({ params }) => <div>{params.userId}</div>)
    .add(
      '/posts/:postId',
      z.object({ hello: z.string() }),
      ({ params, search }) => (
        <div>
          postId: {params.postId}, hello: {search.hello}
        </div>
      )
    )
  expect(route.resolve('/hello')).toMatchInlineSnapshot(`
    <div>
      hello
    </div>
  `)
  expect(route.resolve('/users/4')).toMatchInlineSnapshot(`
    <div>
      4
    </div>
  `)
  expect(route.resolve('/posts/6', '?hello=2')).toMatchInlineSnapshot(`
    <div>
      postId: 
      6
      , hello: 
      2
    </div>
  `)
})

it('set the layout', () => {
  const route = createRouting()
    .setLayout(({ page }) => (
      <div>
        <span>This is layout</span>
        <main>{page}</main>
      </div>
    ))
    .add('/', () => <div>home</div>)
  render(route.resolve('/'))
  expect(screen.getByText('This is layout')).toBeTruthy()
})

it('handle not found', () => {
  const route = createRouting({
    notFound: <div>Not found</div>,
  }).add('/', () => <div>home</div>)
  render(route.resolve('/nothing'))
  expect(screen.getByText('Not found')).toBeTruthy()
})
