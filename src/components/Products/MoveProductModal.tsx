// src/components/Products/MoveProductModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface MoveProductModalProps {
  productId: string;
  currentStorageId: string;
  onMoved?: () => void;
}

export default function MoveProductModal({ productId, currentStorageId, onMoved }: MoveProductModalProps) {
  const [storages, setStorages] = useState<{ _id: string; label: string }[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchStorages = async () => {
      const res = await fetch('/api/storage');
      const data = await res.json();
  
      if (Array.isArray(data.items)) {
        setStorages(data.items);
      } else {
        console.error('API /api/storage не вернул массив:', data);
        setStorages([]);
      }
      
    };
    fetchStorages();
  }, []);

  const handleMove = async () => {
    const res = await fetch(`/api/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ storageId: selectedStorage }),
    });

    if (res.ok) {
      toast.success('Товар перемещён');
      setOpen(false);
      onMoved?.();
    } else {
      toast.error('Ошибка при перемещении');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Переместить</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Переместить товар</DialogTitle>
        <div className="space-y-2">
          <Label>Новая ячейка:</Label>
          <Select onValueChange={setSelectedStorage}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите ячейку" />
            </SelectTrigger>
            <SelectContent>
              {storages
                .filter((s) => s._id !== currentStorageId)
                .map((storage) => (
                  <SelectItem key={storage._id} value={storage._id}>
                    {storage.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button onClick={handleMove} disabled={!selectedStorage}>
            Подтвердить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
