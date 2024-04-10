import type { AstroIntegration, AstroUserConfig } from 'astro';
import type { CmsConfig } from 'decap-cms-core';
import { spawn } from 'node:child_process';
import type { PreviewStyle } from './types.js';
import AdminDashboard from './vite-plugin-admin-dashboard.js';

const widgetPath = 'astro-decap-cms/identity-widget';

interface DecapCMSOptions {
  /**
   * Path at which the Netlify CMS admin dashboard should be served.
   * @default '/admin'
   */
  adminPath?: string;
  config: Omit<CmsConfig, 'load_config_file' | 'local_backend'>;
  disableIdentityWidgetInjection?: boolean;
  previewStyles?: PreviewStyle[];
}

/**
 * Creates a DecapCMS integration with the given options.
 *
 * @param {DecapCMSOptions} options - the options for configuring the DecapCMS integration
 * @return {AstroIntegration} the DecapCMS integration
 */
export default function DecapCMS(options: DecapCMSOptions): AstroIntegration {
  let { disableIdentityWidgetInjection = false, adminPath = '/admin', config: cmsConfig, previewStyles = [] } = options;

  if (!adminPath.startsWith('/')) {
    throw new Error(`'adminPath' option must be a root-relative pathname, starting with "/", got "${adminPath}"`);
  }

  if (adminPath.endsWith('/')) {
    adminPath = adminPath.slice(0, -1);
  }

  let proxy: ReturnType<typeof spawn>;

  const DecapCMSIntegration = {
    name: 'decap-cms',
    hooks: {
      'astro:config:setup': ({ config, injectRoute, injectScript, updateConfig }) => {
        // const widgetPath = 'path/to/identity/widget'; // Replace with the actual path to the identity widget script

        const identityWidgetScript = `import { initIdentity } from '${widgetPath}'; initIdentity('${adminPath}');`;

        const newConfig: AstroUserConfig = {
          site: config.site || process.env.URL,
          vite: {
            plugins: [
              ...(config.vite?.plugins || []),
              AdminDashboard({
                config: cmsConfig,
                previewStyles,
                identityWidget: disableIdentityWidgetInjection ? identityWidgetScript : '',
              }),
            ],
          },
        };

        updateConfig(newConfig);

        injectRoute({
          pattern: adminPath,
          entrypoint: 'astro-decap-cms/admin-dashboard.astro',
        });

        if (!disableIdentityWidgetInjection) {
          injectScript('page', identityWidgetScript);
        }
      },

      'astro:server:start': () => {
        proxy = spawn('decap-server', {
          stdio: 'inherit',
					shell: (process as NodeJS.Process).platform === 'win32',
        });

        process.on('exit', () => proxy.kill());
      },

      'astro:server:done': () => {
        proxy.kill();
      },
    },
  };

  return DecapCMSIntegration;
}
