import type { CmsConfig } from 'decap-cms-core';

export type NormalizedPreviewStyle =
  | [pathOrUrl: string]
  | [rawCSS: string, meta: { raw: boolean }];

export type PreviewStyle = string | NormalizedPreviewStyle;

export interface InitCmsOptions {
  config: CmsConfig;
  previewStyles?: NormalizedPreviewStyle[];
}