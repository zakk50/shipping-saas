import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getUserById } from '@/services/users';

type Props = {
  params: {
    id: string;
  };
};

const UserDetailPage = async ({ params }: Props) => {
  const userId = params.id;

  let user;

  try {
    const res = await getUserById(userId);
    user = res.data;

    if (!user) {
      return notFound();
    }
  } catch (error) {
    console.error('Ошибка получения пользователя', error);
    return notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>

      <div className="border rounded-md p-4 bg-white shadow-sm">
        <p><strong>Имя:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Можно добавить задачи пользователя */}
      </div>

      <div className="mt-4 flex gap-2">
        <Link href="/users">
          <Button variant="default">Назад к списку пользователей</Button>
        </Link>
        <Link href={`/warehouse/board`}>
          <Button>На канбан-доску</Button>
        </Link>
      </div>
    </div>
  );
};

export default UserDetailPage;
