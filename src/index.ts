import type { AstroIntegration } from 'astro';
import AdminDashboard from './vite/plugin.js';
import type { DecapCMSOptions } from './types';

export type { DecapCMSOptions, DecapCMSConfig } from './types';

/**
 * Creates a DecapCMS integration with the given options.
 *
 * @param {DecapCMSOptions} options - the options for configuring the DecapCMS integration
 * @return {AstroIntegration} the DecapCMS integration
 */
export default function DecapCMS(options: DecapCMSOptions): AstroIntegration {
	let {
		disableIdentityWidgetInjection = false,
		adminPath = '/admin',
		config: cmsConfig,
		previewStyles = [],
	} = options;

	if (!adminPath.startsWith('/')) {
		throw new Error(`'adminPath' option must be a root-relative pathname, starting with "/", got "${adminPath}"`);
	}

	if (adminPath.endsWith('/')) {
		adminPath = adminPath.slice(0, -1);
	}

	return {
		name: 'decap-cms',
		hooks: {
			'astro:config:setup': ({ config, injectRoute, injectScript, updateConfig }) => {
				updateConfig({
					site: config.site || process.env.URL,
					vite: {
						plugins: [
							...(config.vite?.plugins || []),
							AdminDashboard({
								config: cmsConfig,
								previewStyles,
								identityWidget: disableIdentityWidgetInjection,
							}),
						],
					},
				});

				injectRoute({
					pattern: adminPath,
					entrypoint: '@miseya/astro-decap-cms/admin-dashboard.astro',
				});

				if (!disableIdentityWidgetInjection) {
					injectScript('page', 'import "@miseya/astro-decap-cms/identity-widget"');
				}
			},

			'astro:server:start': () => {
				// @ts-ignore
				import('decap-server');
			},
		},
	};
}