import { docs } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';

import { i18n } from '@/lib/i18n';
import { icons as tablerIcons } from "@tabler/icons-react"
import {icons as lucideIcons} from "lucide-react"
import { createElement } from 'react';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  i18n,
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon) {
      // You may set a default icon
      return;
    }
    if (icon.startsWith('Icon')) {
      // Use Tabler icons for icons starting with "Icon"
      if (icon in tablerIcons) return createElement(tablerIcons[icon as keyof typeof tablerIcons]);
    } else {
      // Use Lucide icons for other icons
      if (icon in lucideIcons) return createElement(lucideIcons[icon as keyof typeof lucideIcons]);
    }
  },
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
