// app/components/products/AddProductModal.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogTitle  } from '@/components/ui/dialog';

export default function AddProductModal({ storageId, onAdd }: { storageId?: string; onAdd?: () => void }) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, sku, quantity, storageId }),
      });
    setName('');
    setSku('');
    setQuantity(1);
    setOpen(false);
    onAdd?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button><DialogTitle>Добавить товар</DialogTitle></Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-2">
            <Input
            className=""
            placeholder="Название"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
            <Input
            className=""
            placeholder="SKU"
            value={sku}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSku(e.target.value)}
            />
            <Input
            className=""
            type="number"
            placeholder="Количество"
            value={quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))}
            />
          <Button onClick={handleSubmit}>Создать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
