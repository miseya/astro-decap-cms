import type { VirtualModuleConfig } from "../types";

export function generateVirtualConfigModule({
	config,
	previewStyles = [],
	identityWidget = false,
}: VirtualModuleConfig) {
	const imports: string[] = [];
	const styles: string[] = [];

	previewStyles.forEach((entry, index) => {
		if (!Array.isArray(entry)) entry = [entry];
		const [style, opts] = entry;
		if (opts?.raw || style.startsWith('http')) {
			styles.push(JSON.stringify([style, opts]));
		} else {
			const name = `style__${index}`;
			imports.push(`import ${name} from '${style}?raw';`);
			styles.push(`[${name}, { raw: true }]`);
		}
	});

	return `${imports.join('\n')}
${identityWidget}
export default {
config: JSON.parse('${JSON.stringify(config)}'),
previewStyles: [${styles.join(',')}],
};
`;
}