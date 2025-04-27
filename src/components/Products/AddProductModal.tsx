// app/components/products/AddProductModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function AddProductModal({ storageId: initialStorageId, onAdd }: { storageId?: string; onAdd?: () => void }) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [storages, setStorages] = useState<{ _id: string; label: string }[]>([]);
  const [selectedStorage, setSelectedStorage] = useState(initialStorageId || '');
  const [openPopover, setOpenPopover] = useState(false);

  useEffect(() => {
    if (!initialStorageId) {
      const fetchStorages = async () => {
        try {
          const res = await fetch('/api/storage?pageSize=1000');
          const data = await res.json();
          console.log('storages:', data);
          setStorages(Array.isArray(data.items) ? data.items : []);
        } catch (error) {
          console.error('Ошибка при загрузке ячеек:', error);
        }
      };
      fetchStorages();
    }
  }, [initialStorageId]);

  const handleSubmit = async () => {
    try {
      if (!name.trim() || !sku.trim()) return;

      await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          sku: sku.trim(),
          quantity,
          storageId: initialStorageId || selectedStorage,
        }),
      });

      setName('');
      setSku('');
      setQuantity(1);
      if (!initialStorageId) setSelectedStorage('');
      setOpen(false);
      onAdd?.();
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Добавить товар</Button>
      </DialogTrigger>
      <DialogContent>
      <DialogTitle>Добавление товара</DialogTitle>
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

          {!initialStorageId && (
            <>
              <Label>Ячейка хранения</Label>
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="default"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedStorage
                      ? storages.find((s) => s._id === selectedStorage)?.label
                      : 'Выберите ячейку'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Поиск ячейки..." />
                    <CommandList>
                      <CommandEmpty>Ничего не найдено.</CommandEmpty>
                      {storages.map((s) => (
                        <CommandItem
                          key={s._id}
                          onSelect={() => {
                            setSelectedStorage(s._id);
                            setOpenPopover(false);
                          }}
                        >
                          {s.label}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </>
          )}

          <Button
            onClick={handleSubmit}
            disabled={
              !name.trim() || !sku.trim() || (!initialStorageId && !selectedStorage)
            }
          >
            Создать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
