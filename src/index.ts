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
 * Returns an integration object for Astro that sets up the necessary configurations and scripts for the Decap CMS admin dashboard.
 * @param options - The options for the Decap CMS integration.
 * @returns The integration object for Astro.
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

  const DecapCMSIntegration: AstroIntegration = {
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
          entryPoint: 'astro-decap-cms/admin-dashboard.astro',
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
