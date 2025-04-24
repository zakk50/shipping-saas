"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  const [sortField, setSortField] = useState<string>("label");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingItem, setEditingItem] = useState<StorageType | null>(null);

  const fetchItems = async () => {
    const query = new URLSearchParams();
    if (filters.section) query.append("section", filters.section);
    if (filters.level) query.append("level", filters.level);
    if (filters.cell) query.append("cell", filters.cell);
    query.append("sortField", sortField);
    query.append("sortOrder", sortOrder);
    const res = await fetch(`/api/storage?${query.toString()}`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, [filters, sortField, sortOrder]);

  // Обработчик изменения значений в форме
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Обработчик отправки формы
  const handleSubmit = async () => {
    await fetch("/api/storage", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    setForm({ label: "", section: "", level: "", cell: "", barcode: "" });
    fetchItems();
  };

  // Обработчик изменения значений при редактировании ячейки
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [e.target.name]: e.target.value });
  };

  // Обработчик обновления ячейки
  const handleUpdate = async () => {
    if (!editingItem?._id) return;
    await fetch(`/api/storage/${editingItem._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingItem),
    });
    setEditingItem(null);
    fetchItems();
  };

    // Обработчик изменения фильтров
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, filterType: string) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: e.target.value,
      }));
    };
  
    // Обработчик изменения поля сортировки
    const handleSortChange = (value: string) => {
      setSortField(value);
    };
  
    // Обработчик изменения порядка сортировки
    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortOrder(e.target.value as "asc" | "desc");
    };
    console.log("filters:", filters);
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

      <div className="flex flex-wrap gap-2 items-center mt-6">
        <Input
          className="w-32"
          placeholder="Фильтр: Ряд"
          value={filters.section}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(e, "section")}
        />

        <Input
          className="w-32"
          placeholder="Фильтр: Ярус"
          value={filters.level}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(e, "level")}
        />

        <Input
          className="w-32"
          placeholder="Фильтр: Ячейка"
          value={filters.cell}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(e, "cell")}
        />
        <Select value={sortField} onValueChange={handleSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Поле сортировки" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="label">Метка</SelectItem>
            <SelectItem value="section">Секция</SelectItem>
            <SelectItem value="level">Уровень</SelectItem>
            <SelectItem value="cell">Ячейка</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}> 
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Порядок" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">По возрастанию</SelectItem>
            <SelectItem value="desc">По убыванию</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchItems}>Применить</Button>
        <Button onClick={() => { setFilters({ section: "", level: "", cell: "" }); setSortField("label"); setSortOrder("asc"); fetchItems(); }}>Сброс</Button>
      </div>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogTitle>Редактировать ячейку</DialogTitle>
          <div className="space-y-2">
            <Input className="" name="label" placeholder="Метка" value={editingItem?.label || ""} onChange={handleEditChange} />
            <Input className="" name="section" placeholder="Секция" value={editingItem?.section || ""} onChange={handleEditChange} />
            <Input className="" name="level" placeholder="Уровень" value={editingItem?.level || ""} onChange={handleEditChange} />
            <Input className="" name="cell" placeholder="Ячейка" value={editingItem?.cell || ""} onChange={handleEditChange} />
            <Input className="" name="barcode" placeholder="Штрихкод" value={editingItem?.barcode || ""} onChange={handleEditChange} />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleUpdate}>Сохранить</Button>
          </div>
        </DialogContent>
      </Dialog>

      <table className="w-full table-auto mt-6 border rounded">
  <thead>
    <tr className="bg-gray-100">
      <th className="px-4 py-2 text-left">Метка</th>
      <th className="px-4 py-2 text-left">Секция</th>
      <th className="px-4 py-2 text-left">Уровень</th>
      <th className="px-4 py-2 text-left">Ячейка</th>
      <th className="px-4 py-2 text-left">Штрихкод</th>
      <th className="px-4 py-2 text-right">Действия</th>
    </tr>
  </thead>
  <tbody>
    {items.map((item) => (
      <tr key={item._id} className="border-t">
        <td className="px-4 py-2">{item.label}</td>
        <td className="px-4 py-2">{item.section}</td>
        <td className="px-4 py-2">{item.level}</td>
        <td className="px-4 py-2">{item.cell}</td>
        <td className="px-4 py-2">{item.barcode}</td>
        <td className="px-4 py-2 text-right">
          <Button variant="default" onClick={() => setEditingItem(item)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}
