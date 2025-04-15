'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function WarehousePage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Склад</h1>
        <p className="text-muted-foreground">Добро пожаловать на страницу управления складом.</p>
      </div>

      <div className="space-x-4">
        <Link href="/warehouse/board">
          <Button variant="default">Перейти к Канбан доске</Button>
        </Link>

        <Link href="/warehouse/list">
          <Button variant="secondary">Управление складами</Button>
        </Link>
      </div>
    </div>
  )
}
