// app/components/products/AddProductModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AddProductModal from './AddProductModal';
import MoveProductModal from './MoveProductModal';

export default function ProductTable() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    const res = await fetch(`/api/products${search ? '?search=' + search : ''}`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Поиск по названию или SKU"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="w-64"
        />
        <AddProductModal onAdd={fetchProducts} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Количество</TableHead>
            <TableHead>Ячейка</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.sku}</TableCell>
              <TableCell>{p.quantity}</TableCell>
              <TableCell>{p.storageId?.label || '—'}</TableCell>
              <TableCell>
              <MoveProductModal
                productId={p._id}
                currentStorageId={p.storageId?._id || ''}
                onMoved={fetchProducts} // функция обновления списка после перемещения
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
