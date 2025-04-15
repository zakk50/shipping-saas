'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WarehousePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Склад</h1>
      <p className="mb-6">Добро пожаловать на страницу управления складом.</p>

      <Link href="/warehouse/board">
        <Button variant="default">Перейти к Канбан доске</Button>
      </Link>
    </div>
  );
}
