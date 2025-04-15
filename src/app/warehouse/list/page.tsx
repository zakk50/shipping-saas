'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

type Warehouse = {
  _id: string
  name: string
  location?: string
  description?: string
}

export default function WarehouseListPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [form, setForm] = useState({ name: '', location: '', description: '' })
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [currentWarehouse, setCurrentWarehouse] = useState<Warehouse | null>(null)

  useEffect(() => {
    fetch('/api/warehouses')
      .then((res) => res.json())
      .then(setWarehouses)
  }, [])

  const handleCreate = async () => {
    const res = await fetch('/api/warehouses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      const created = await res.json()
      setWarehouses((prev) => [...prev, created])
      setForm({ name: '', location: '', description: '' })
      setOpen(false)
      toast.success('Склад успешно добавлен')
    } else {
      toast.error('Ошибка при добавлении склада')
    }
  }

  const handleEdit = async () => {
    if (currentWarehouse) {
      const res = await fetch(`/api/warehouses/${currentWarehouse._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        const updated = await res.json()
        setWarehouses((prev) =>
          prev.map((wh) => (wh._id === updated._id ? updated : wh))
        )
        setForm({ name: '', location: '', description: '' })
        setEditOpen(false)
        setCurrentWarehouse(null)
        toast.success('Склад успешно обновлен')
      } else {
        toast.error('Ошибка при обновлении склада')
      }
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/warehouses/${id}`, {
      method: 'DELETE',
    })
  
    if (res.ok) {
      setWarehouses((prev) => prev.filter((wh) => wh._id !== id)) // Удаляем склад из состояния
      toast.success('Склад удален')
    } else {
      toast.error('Ошибка при удалении склада')
      console.error('Ошибка при удалении склада:', res.status, await res.text()) // Логирование ошибок
    }
  }

  const openEditDialog = (warehouse: Warehouse) => {
    setCurrentWarehouse(warehouse)
    setForm({
      name: warehouse.name,
      location: warehouse.location || '',
      description: warehouse.description || '',
    })
    setEditOpen(true)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление складами</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={() => setOpen(true)}>Добавить склад</Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый склад</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Название</Label>
                <Input
                  className="your-class-name-here"
                  value={form.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Локация</Label>
                <Input
                  className="your-class-name-here"
                  value={form.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Input
                  className="your-class-name-here"
                  value={form.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>
              <Button onClick={handleCreate}>Создать</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warehouses.map((wh) => (
          <div key={wh._id} className="border rounded-lg p-4 shadow-sm">
            <div className="font-semibold text-lg">{wh.name}</div>
            <div className="text-sm text-muted-foreground">{wh.location}</div>
            <div className="text-sm">{wh.description}</div>
            <div className="mt-4 flex space-x-2">
              <Button onClick={() => openEditDialog(wh)} className="w-1/2">Редактировать</Button>
              <Button
                onClick={() => handleDelete(wh._id)}
                variant="default"
                className="w-1/2"
              >
                Удалить
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для редактирования */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать склад</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Название</Label>
              <Input
              className="your-class-name-here"
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Локация</Label>
              <Input
              className="your-class-name-here"
                value={form.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Описание</Label>
              <Input
              className="your-class-name-here"
                value={form.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
            <Button onClick={handleEdit}>Сохранить изменения</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
