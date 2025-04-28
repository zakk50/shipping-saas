// src/components/Products/ProductTable.tsx
'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import AddProductModal from './AddProductModal';
import MoveProductModal from './MoveProductModal';
import { Badge } from '@/components/ui/badge';

export default function ProductTable() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch(`/api/products${search ? '?search=' + search : ''}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      QC: 'Проверка',
      ok: 'Годен',
      nook: 'Брак',
      exp: 'Просрочен',
      rework: 'Доработка',
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'ok':
        return 'default';
      case 'nook':
      case 'exp':
        return 'destructive';
      case 'rework':
        return 'secondary';
      case 'QC':
      default:
        return 'outline';
    }
  };

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
            <TableHead>Статус</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              </TableRow>
            ))
          ) : products.length > 0 ? (
            products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>{p.storageId?.label || '—'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(p.status)}>
                    {getStatusLabel(p.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <MoveProductModal
                    productId={p._id}
                    currentStorageId={p.storageId?._id || ''}
                    onMoved={fetchProducts}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                Ничего не найдено
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
