import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { ArrowUpRight } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  return <HomeLayout {...baseOptions(lang)} links={[{
    url: `${lang}/docs`,
    text: lang === 'zh' ? '主题文档' : 'Documentation'
  },
  {
    url: 'https://redefine.ohevan.com',
    text: <span className="flex flex-row items-center">
      {lang === 'zh' ? '演示站点' : 'Demo'}
      <ArrowUpRight className="w-4 h-4 ml-1" />
    </span>,
  },
  {
    type: 'icon',
    url: 'https://github.com/evannotfound/hexo-theme-redefine',
    text: 'GitHub',
    icon: <SiGithub />
  }
  ]}>
    {children}
  </HomeLayout>;
}