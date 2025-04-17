'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

type Storage = {
  _id: string
  warehouseId: string
  name: string
  barcode?: string
  description?: string
}

export default function StoragePage() {
  const [storages, setStorages] = useState<Storage[]>([])
  const [form, setForm] = useState({ name: '', warehouseId: '', barcode: '', description: '' })

  useEffect(() => {
    fetch('/api/storage')
      .then((res) => res.json())
      .then(setStorages)
  }, [])

  const handleCreate = async () => {
    const res = await fetch('/api/storage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const newItem = await res.json()
      setStorages((prev) => [...prev, newItem])
      setForm({ name: '', warehouseId: '', barcode: '', description: '' })
      toast.success('Ячейка добавлена')
    } else {
      toast.error('Ошибка при добавлении')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ячейки хранения</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Название</Label>
          <Input
  className="w-full"
  value={form.name}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, name: e.target.value }))}
/>        </div>
        <div>
          <Label >ID склада</Label>
          <Input
  className="w-full"
  value={form.warehouseId}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, warehouseId: e.target.value }))}
/>        </div>
        <div>
          <Label>Штрихкод</Label>
          <Input
  className="w-full"
  value={form.barcode}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, barcode: e.target.value }))}
/>        </div>
        <div>
          <Label>Описание</Label>
          <Input
  className="w-full"
  value={form.description}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, description: e.target.value }))}
/>        </div>
        <Button onClick={handleCreate}>Создать</Button>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Список ячеек:</h2>
        <ul className="mt-4 space-y-2">
          {storages.map((s) => (
            <li key={s._id} className="border p-2 rounded">
              <div><strong>{s.name}</strong> (штрихкод: {s.barcode || '–'})</div>
              <div className="text-sm text-muted-foreground">{s.description}</div>
              <div className="text-xs text-gray-500">ID склада: {s.warehouseId}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
