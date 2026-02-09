import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/index.tsx'),
  route('tv', 'routes/tv.tsx'),
  route('schedule', 'routes/schedule.tsx'),
  route('challenges', 'routes/challenges.tsx'),
  route('mentors', 'routes/mentors.tsx')
] satisfies RouteConfig
