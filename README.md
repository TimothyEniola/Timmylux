# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Pages and routes

The current application includes the following page components and route paths:

- `/` — Home
- `/products` — Shop / Products
- `/about` — About
- `/custom-request` — Custom Request
- `/cart` — Cart
- `/checkout` — Checkout
- `/wishlist` — Wishlist
- `/order-history` — Order History
- `/track-order` — Track Order
- `/signin` — Sign In
- `/signup` — Sign Up
- `/settings` — User Settings
- `/admin` — Admin Dashboard
- `/admin/products` — Admin Products
- `/admin/orders` — Admin Orders
- `/admin/add-product` — Admin Add Product

> Note: the current `App.jsx` does not define explicit React Router `<Routes>` / `<Route>` entries, so these paths are inferred from the existing page filenames and `Link` targets in the code.
