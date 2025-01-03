import type { ViteUserConfig } from 'astro';
import { generateVirtualConfigModule } from './virtual-module.js';
import type { CmsConfig, PreviewStyle} from '../types';

const virtualModuleId = 'virtual:@miseya/astro-decap-cms/user-config';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

type VitePlugin = Exclude<ViteUserConfig['plugins'], undefined>[0]

interface AdminDashboardPluginOptions {
	config: CmsConfig;
	previewStyles: PreviewStyle[];
	identityWidget: boolean;
}

export default function AdminDashboardPlugin(
	options: AdminDashboardPluginOptions
): VitePlugin {

	// default options here
	options.config.load_config_file = false

	return {
		name: 'vite-plugin-decap-cms-admin-dashboard',

		// dynamic options here
		config(_, { command }) {
			options.config.local_backend = command === 'serve'
		},
		resolveId(id) {
			if (id === virtualModuleId) return resolvedVirtualModuleId;
		},
		load(id) {
			if (id === resolvedVirtualModuleId)
				return generateVirtualConfigModule(options);
		},
	};
}