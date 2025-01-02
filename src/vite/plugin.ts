import { ViteUserConfig } from 'astro';
import type { CmsConfig } from 'decap-cms-core';
import type { PreviewStyle } from '../types';
import { generateVirtualConfigModule } from './virtual-module';

const virtualModuleId = 'virtual:astro-decap-cms/user-config';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

type VitePlugin = ViteUserConfig['plugins'][number]

interface AdminDashboardPluginOptions {
	config: Omit<CmsConfig, 'load_config_file' | 'local_backend'>;
	previewStyles: PreviewStyle[];
	identityWidget: boolean;
}

export default function AdminDashboardPlugin(
	options: AdminDashboardPluginOptions
): VitePlugin {
	return {
		name: 'vite-plugin-decap-cms-admin-dashboard',

		resolveId(id) {
			if (id === virtualModuleId) return resolvedVirtualModuleId;
		},

		load(id) {
			if (id === resolvedVirtualModuleId)
				return generateVirtualConfigModule(options);
		},
	};
}