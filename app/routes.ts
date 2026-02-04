import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("tv", "routes/tv.tsx"),
] satisfies RouteConfig;
