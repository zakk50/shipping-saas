import dbConnect from '../../../lib/dbConnect';
import Department from '../../../models/Department';

// Получить все отделы
export async function GET() {
  await dbConnect();
  try {
    const departments = await Department.find();
    return new Response(JSON.stringify(departments), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

// Добавить новый отдел
export async function POST(req) {
  await dbConnect();
  try {
    const { name, description } = await req.json();

    if (!name) {
      return new Response(
        JSON.stringify({ message: 'Department name is required' }),
        { status: 400 }
      );
    }

    const newDepartment = new Department({ name, description });
    const savedDepartment = await newDepartment.save();

    return new Response(JSON.stringify(savedDepartment), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

// Обновить отдел
export async function PUT(req) {
  await dbConnect();
  try {
    const { id } = req.params;
    const { name, description } = await req.json();

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return new Response(
        JSON.stringify({ message: 'Department not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(updatedDepartment), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

// Удалить отдел
export async function DELETE(req) {
  await dbConnect();
  try {
    const { id } = req.params;

    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return new Response(
        JSON.stringify({ message: 'Department not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ message: 'Department deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
