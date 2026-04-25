import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminPanel from './AdminPanel';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token  = cookieStore.get('admin_token')?.value;
  const secret = process.env.ADMIN_SECRET;

  if (!secret || token !== secret) redirect('/admin');

  return <AdminPanel />;
}
