@/Users/starunity/.codex/RTK.md

# Project Notes

This is an Astro 4 blog using pnpm, Tailwind CSS, DaisyUI, Astro content
collections, RSS, sitemap, robots.txt, and Astro compression.

## Commands

- Prefix shell commands with `rtk`.
- Use pnpm from the repository root.
- `rtk pnpm dev` starts the Astro dev server.
- `rtk pnpm build` runs `astro check && astro build`.
- `rtk pnpm preview` previews the production build.
- `rtk pnpm format` formats the project with Prettier and
  `prettier-plugin-astro`.

## Code Style

- Follow the existing Prettier config: no semicolons, single quotes, and
  `arrowParens: 'avoid'`.
- Prefer Astro components and layouts that match the current small, static blog
  structure.
- Keep styling in Tailwind/DaisyUI utility classes unless a local pattern calls
  for something else.
- The active DaisyUI theme is `night`.

## Project Structure

- `src/pages/` contains Astro routes.
- `src/pages/posts/[...slug].astro` renders content collection posts; quote this
  path in zsh commands because of the brackets.
- `src/content/posts/` contains markdown posts.
- `src/content/config.ts` defines the `posts` content collection schema.
- `src/layouts/` contains shared page and post layouts.
- `src/components/` contains small Astro-only components for navigation, head
  metadata, comments, footer, and link lists.
- `src/config.ts` contains site metadata, navigation links, and publication
  constants.
- Static assets live in `public/`, especially `public/uploads/`.

## Content Conventions

- Blog posts use frontmatter with:
  - `layout`
  - `title`
  - `pubDate`
  - `updatedDate`
  - `description`
  - optional or nullable `tags`
- Existing post language values include `en` and `zh-Hans`.
- Use the existing `PostsLayout.astro` for markdown posts unless a task
  explicitly changes the content model.

## Verification

- For code or content changes that affect the site, run `rtk pnpm build` when
  feasible.
- For pure formatting changes, run `rtk pnpm format` or the narrowest relevant
  Prettier command.
