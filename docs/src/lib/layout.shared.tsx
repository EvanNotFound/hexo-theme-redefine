import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n } from '@/lib/i18n';
import redefineIcon from '@/components/icons/redefine.svg';
import Image from 'next/image';
import { SiGithub } from '@icons-pack/react-simple-icons';

export function baseOptions(locale: string): BaseLayoutProps {

  return {
    i18n,
    nav: {
      title: <>
        <Image src={redefineIcon} alt="Redefine" width={16} height={16} />
        Redefine Docs
      </>,
    },
    links: [{
      type: 'icon',
      url: 'https://github.com/evannotfound/hexo-theme-redefine',
      icon: <SiGithub />,
      text: 'GitHub'
    }],
  };
}
