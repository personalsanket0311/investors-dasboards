import DealDetail from '@/features/deals/DealDetail';
export const metadata = { title: 'Deal details' };
export default async function Page({ params }) {
  const { id } = await params;
  return <DealDetail id={id} />;
}
