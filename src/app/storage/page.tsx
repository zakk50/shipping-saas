// src/app/storage/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StorageType {
  _id?: string;
  label: string;
  section?: string;
  level: string;
  cell: string;
  barcode?: string;
}

export default function StoragePage() {
  const [items, setItems] = useState<StorageType[]>([]);
  const [form, setForm] = useState<StorageType>({
    label: "",
    section: "",
    level: "",
    cell: "",
    barcode: "",
  });

  const [filters, setFilters] = useState({ section: "", level: "", cell: "" });
  const [storages, setStorages] = useState<StorageType[]>([]);
  const [editingItem, setEditingItem] = useState<StorageType | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/storage");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    await fetch("/api/storage", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setForm({ label: "", section: "", level: "", cell: "", barcode: "" });
    fetchItems();
  };

  const fetchStorages = async () => {
    const query = new URLSearchParams();
    if (filters.section) query.append("section", filters.section);
    if (filters.level) query.append("level", filters.level);
    if (filters.cell) query.append("cell", filters.cell);

    console.log("QUERY:", query.toString()); // 👈 добавь это
    
    const res = await fetch(`/api/storage?${query.toString()}`);
    const data = await res.json();
    setStorages(data);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!editingItem?._id) return;

    await fetch(`/api/storage/${editingItem._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingItem),
    });

    setEditingItem(null);
    fetchItems();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Создание ячейки хранения</h1>
      <div className="space-y-2">
        <Input className="" placeholder="Метка (label)" name="label" value={form.label} onChange={handleChange} />
        <Input className="" placeholder="Секция (section)" name="section" value={form.section} onChange={handleChange} />
        <Input className="" placeholder="Ячейка (cell)" name="cell" value={form.cell} onChange={handleChange} />
        <Input className="" placeholder="Уровень (level)" name="level" value={form.level} onChange={handleChange} />
        <Input className="" placeholder="Штрихкод (barcode)" name="barcode" value={form.barcode} onChange={handleChange} />
        <Button onClick={handleSubmit}>Создать ячейку</Button>
      </div>

      {/* 🔍 Поиск */}
      <div className="flex gap-2 flex-wrap mt-6">
  <Input
    className="w-40"
    placeholder="Фильтр: Ряд"
    value={filters.section}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      setFilters({ ...filters, section: e.target.value })
    }
  />
  <Input
    className="w-40"
    placeholder="Фильтр: Ярус"
    value={filters.level}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      setFilters({ ...filters, level: e.target.value })
    }
  />
  <Input
    className="w-40"
    placeholder="Фильтр: Ячейка"
    value={filters.cell}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      setFilters({ ...filters, cell: e.target.value })
    }
  />
  <Button onClick={fetchStorages}>Поиск</Button>
  <Button
    onClick={() => {
      setFilters({ section: "", level: "", cell: "" });
      fetchStorages();
    }}
  >
    Сброс
  </Button>
</div>


      {/* 📝 Модалка редактирования */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent aria-describedby="dialog-description">
          <DialogTitle>Редактировать ячейку</DialogTitle>
          <div className="space-y-2">
            <Input className="" name="label" placeholder="Метка" value={editingItem?.label || ""} onChange={handleEditChange} />
            <Input className="" name="section" placeholder="Секция" value={editingItem?.section || ""} onChange={handleEditChange} />
            <Input className="" name="level" placeholder="Уровень" value={editingItem?.level || ""} onChange={handleEditChange} />
            <Input className="" name="cell" placeholder="Ячейка" value={editingItem?.cell || ""} onChange={handleEditChange} />
            <Input className="" name="barcode" placeholder="Штрихкод" value={editingItem?.barcode || ""} onChange={handleEditChange} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleUpdate}>Сохранить</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 📦 Список ячеек */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {items.map((item) => (
          <div key={item._id} className="border p-4 rounded-xl shadow space-y-2">
            <div className="flex justify-between items-center">
              <strong>{item.label}</strong>
              <Button variant="default" onClick={() => setEditingItem(item)}>
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <p>Секция: {item.section}</p>
            <p>Ячейка: {item.cell}</p>
            <p>Уровень: {item.level}</p>
            <p>Штрихкод: {item.barcode}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
