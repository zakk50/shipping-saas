import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="hover:text-gray-400">Главная</Link>
        <Link href="/warehouse" className="hover:text-gray-400">Склад</Link>
        <Link href="/products" className="hover:text-gray-400">Товары</Link>
        <Link href="/production" className="hover:text-gray-400">Производство</Link>
        <Link href="/purchasing" className="hover:text-gray-400">Закупки</Link>
        <Link href="/lab-kk" className="hover:text-gray-400">Лаборатория КК</Link>
        <Link href="/departments" className="hover:text-gray-400">Отделы</Link>
        <Link href="/materials/create" className="hover:text-gray-400">Добавить материал</Link>
        <Link href="/users" className="hover:text-gray-400">Пользователи</Link>
        <Link href="/safety" className="hover:text-gray-400">Охрана труда</Link>
        <Link href="/technical" className="hover:text-gray-400">Техническая служба🛠️</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
