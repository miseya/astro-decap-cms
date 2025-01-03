# Astro + Decap CMS

Add [Decap CMS](https://decapcms.org)’s admin dashboard to any [Astro](https://astro.build) project

## Installation

```sh
npm i @miseya/astro-decap-cms
pnpm i @miseya/astro-decap-cms
yarn add @miseya/astro-decap-cms
```

## Difference with `astro-decap-cms`

This fork offers faster build with over 80% time reduction. Rationale: there's already the build for Decap CMS, there's no need to rebuild it everytime. New features from the `astro-decap-cms` will be merged as to keep the same configurations.

The package also exports `DecapCMSOptions` type for Astro integration options and `DecapCMSConfig` for Decap CMS configuration.

| astro-decap-cms | @miseya/astro-decap-cms |
|-------------------------|-----------------|
| ![astro-decap-cms build](https://github.com/user-attachments/assets/0cd6b3a0-a1d5-4cca-b78c-460f56b8fa2f) | ![@miseya/astro-decap-cms build](https://github.com/user-attachments/assets/45208fe0-ee7a-4715-b644-1e4764688888) |

## What is this?

This is an integration for the [Astro](https://astro.build) site builder,
which adds support for [Decap CMS](https://decapcms.org),
an open-source,
Git-based content management system.

Adding the integration will:

- Add the Decap CMS dashboard at `/admin` (or another route if you prefer)
- Inject Netlify’s [Identity Widget](https://github.com/netlify/netlify-identity-widget) across
your site to support logging in to the admin app
- Run a [local proxy server](https://decapcms.org/docs/beta-features/#working-with-a-local-git-repository) in `dev` mode to allow local content updates via the CMS

Usually each of these requires individual set up and configuration.
Using this integration, you configure your CMS once in `astro.config.mjs`, sit back, and enjoy!

> Looking for a quick way to get started? [Try out the Blog Starter with Decap CMS →](https://github.com/advanced-astro/astro-decap-cms-starter)

## Usage

### Adding the integration

To add Decap CMS to your project, import and use the integration in your Astro config file,
adding it to the `integrations` array.

```js
// astro.config.mjs

import { defineConfig } from 'astro/config';
import DecapCMS from 'astro-decap-cms';

export default defineConfig({
  integrations: [
    DecapCMS({
      config: {
        backend: {
          name: 'git-gateway',
          branch: 'main',
        },
        collections: [
          // Content collections
        ],
      },
    }),
  ],
});
```

### Configuration options

You can pass an options object to the integration to configure how it behaves.

#### `adminPath`

**Type:** `string`
**Default:** `'/admin'`

Determines the route where the Decap CMS admin dashboard will be available on your site.

Feeling nostalgic for WordPress? You could set this to `'/wp-admin'`!

#### `config`

**Type:** `CmsConfig`

This option is **required**.
It allows you to configure Decap CMS with the same options you would use when using Decap CMS’s
`config.yml` file format.

You can see [a full list of configuration options in the Decap CMS docs](https://decapcms.org/docs/configuration-options/).

At a minimum, you _must_ set the `backend` and `collections` options:

```js
config: {
  // Use Netlify’s “Git Gateway” authentication and target our default branch
  backend: {
    name: 'git-gateway',
    branch: 'main',
  },
  collections: [
    // Define a blog post collection
    {
      name: 'posts',
      label: 'Blog Posts',
      folder: 'src/pages/posts',
      create: true,
      delete: true,
      fields: [
        { name: 'title', widget: 'string', label: 'Post Title' },
        { name: 'body', widget: 'markdown', label: 'Post Body' },
      ],
    },
  ],
};
```

#### `previewStyles`

**Type:** `Array<string | [string, { raw: true }]>`

Sets custom CSS styles to apply in the Decap CMS preview pane.

You can provide URLs to external CSS stylesheets (Google Fonts for example), paths to local CSS files in your project, or even raw CSS strings:

```js
previewStyles: [
  // Path to a local CSS file, relative to your project’s root directory
  '/src/styles/main.css',
  // An npm module identifier
  '@fontsource/roboto',
  // A URL to an externally hosted CSS file
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap',
  // Raw CSS!
  ['p { color: red; }', { raw: true }],
];
```

#### `disableIdentityWidgetInjection`

**Type:** `boolean`
**Default:** `false`

By default, `astro-decap-cms` injects Netlify’s [Identity Widget](https://github.com/netlify/netlify-identity-widget) across your site to enable authentication.
If you only want to inject the widget on the admin route, you can set `disableIdentityWidgetInjection: true`.

## To-do

- Support registering custom preview components to render content as it is edited.
- Support registering custom block components for use in the Markdown editor.

## Aknowledgement

- `astro-decap-cms` [`NPM`](https://www.npmjs.com/package/astro-decap-cms) [`GITHUB`](https://github.com/advanced-astro/astro-decap-cms)
- `@jee-r/astro-decap-cms` [`NPM`](https://www.npmjs.com/package/@jee-r/astro-decap-cms) [`GITHUB`](https://github.com/jee-r/astro-decap-cms)
- `astro-netlify-cms` [`NPM`](https://www.npmjs.com/package/astro-netlify-cms) [`GITHUB`](https://github.com/delucis/astro-netlify-cms)
