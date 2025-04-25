// app/products/page.tsx

import ProductTable from '@/components/Products/ProductTable';

export default function ProductsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📦 Все товары</h1>
      <ProductTable />
    </div>
  );
}

