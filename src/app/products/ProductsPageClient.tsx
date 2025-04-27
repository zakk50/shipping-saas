// src/app/products/ProductsPageClient.tsx
'use client';

import dynamic from 'next/dynamic';

const ProductTable = dynamic(() => import('@/components/Products/ProductTable'), {
  ssr: false,
});

export default function ProductsPageClient() {
  return <ProductTable />;
}
