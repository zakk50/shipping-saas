// src/app/storage/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react"; // Импорт иконок

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
  const [storages, setStorages] = useState<StorageType[]>([]);
  const [form, setForm] = useState<StorageType>({
    label: "",
    section: "",
    level: "",
    cell: "",
    barcode: "",
  });

  const [filters, setFilters] = useState({ section: "", level: "", cell: "", search: "", });

  const fetchItems = async () => {
    const res = await fetch("/api/storage");
    const data = await res.json();
    setItems(data);
    setStorages(data); // Показываем всё по умолчанию
  };

  const fetchStorages = async () => {
    const query = new URLSearchParams();
    if (filters.section) query.append("section", filters.section);
    if (filters.level) query.append("level", filters.level);
    if (filters.cell) query.append("cell", filters.cell);
    if (filters.search) query.append("search", filters.search); // ➕ сюда

    const res = await fetch(`/api/storage?${query.toString()}`);
    const data = await res.json();
    setStorages(data);
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
    setForm({ label: "", section: "", cell: "", level: "", barcode: "" });
    fetchItems();
  };
  const handleEdit = (item: StorageType) => {
    setForm(item); // Заполняем форму
    window.scrollTo({ top: 0, behavior: "smooth" }); // Прокрутка к форме (опционально)
  };
  
  const handleDelete = async (id: string) => {
    const confirmed = confirm("Вы уверены, что хотите удалить ячейку?");
    if (!confirmed) return;
  
    await fetch(`/api/storage/${id}`, {
      method: "DELETE",
    });
  
    fetchStorages();
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Создание ячейки хранения</h1>

      <div className="space-y-2">
        <Input className="" placeholder="Метка (label)" name="label" value={form.label} onChange={handleChange} />
        <Input className="" placeholder="Секция (section)" name="section" value={form.section} onChange={handleChange} />
        <Input className="" placeholder="Ячейка (cell)" name="cell" value={form.cell} onChange={handleChange} />
        <Input className="" placeholder="Уровень (level)" name="level" value={form.level} onChange={handleChange} />
        <Input className=""placeholder="Штрихкод (barcode)" name="barcode" value={form.barcode} onChange={handleChange} />
        <Button onClick={handleSubmit}>Создать ячейку</Button>
      </div>

      {/* 🔍 Поиск */}
      <div className="flex gap-2 flex-wrap mt-6">
      
      <Input
        name="search"
        className="w-40"
        placeholder="Поиск по названию или штрихкоду"
        value={filters.search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFilters((prev) => ({ ...prev, search: e.target.value }))
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            fetchStorages();
          }
        }}
      />

      <Input
        name="section"
        className="w-40"
        placeholder="Фильтр: Ряд"
        value={filters.section}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFilters({ ...filters, [e.target.name]: e.target.value })
        }
      />
      <Input
        name="cell"
        className="w-40"
        placeholder="Фильтр: Ячейка"
        value={filters.cell}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFilters({ ...filters, [e.target.name]: e.target.value })
        }
      />
      <Input
        name="level"
        className="w-40"
        placeholder="Фильтр: Ярус"
        value={filters.level}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFilters({ ...filters, [e.target.name]: e.target.value })
        }
      />
        <Button onClick={fetchStorages}>Поиск</Button>
        <Button
          onClick={() => {
            setFilters({ section: "", cell: "", level: "", search: "", });
            fetchItems();
          }}
        >
          Сброс
        </Button>
      </div>

      {/* 📦 Отображение */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
  {storages.map((item) => (
    <div key={item._id} className="border p-4 rounded-xl shadow relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <Pencil
          className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700"
          onClick={() => handleEdit(item)}
        />
        <Trash
          className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
          onClick={() => handleDelete(item._id!)}
        />
      </div>
      <p><strong>{item.label}</strong></p>
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
