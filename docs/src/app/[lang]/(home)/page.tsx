import Link from 'next/link';
import EnIndex from './en-index';
import ZhIndex from './zh-index';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;


  if (lang === "en") {
    return <EnIndex />;
  }

  return <ZhIndex />;
}
