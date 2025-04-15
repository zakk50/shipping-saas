'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  useEffect(() => {
    fetch('/api/warehouses')
      .then(res => res.json())
      .then(setWarehouses)
  }, [])

  const handleCreate = async () => {
    const res = await fetch('/api/warehouses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const created = await res.json()
    setWarehouses(prev => [...prev, created])
    setForm({ name: '', location: '', description: '' })
    setOpen(false)
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
                  className=""
                  value={form.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm(prev => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Локация</Label>
                <Input
                  className=""
                  value={form.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm(prev => ({ ...prev, location: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Input
                  className=""
                  value={form.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm(prev => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>
              <Button onClick={handleCreate}>Создать</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warehouses.map(wh => (
          <div key={wh._id} className="border rounded-lg p-4 shadow-sm">
            <div className="font-semibold text-lg">{wh.name}</div>
            <div className="text-sm text-muted-foreground">{wh.location}</div>
            <div className="text-sm">{wh.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
