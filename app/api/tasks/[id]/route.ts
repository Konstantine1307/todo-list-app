import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set');
}
const client = new MongoClient(uri);

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) 
{
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = params;
    const updates = await request.json();
    await client.connect();
    const db = client.db('todoapp');
    const collection = db.collection('tasks');

    // Remove the id from updates to avoid changing it
    const { id: _, ...updateData } = updates;

    // Find the task with the specified id
    const task = await collection.findOne({ _id: new ObjectId(id) });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Update the task with the specified id
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      );
    }

    // Instead of returning the original task, either return the updated data
    const updatedTask = {
      ...task,
      ...updateData, // Merge the updated fields into the original task
      id: task._id.toString(),
    };

    delete updatedTask._id;

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    await client.connect();
    const db = client.db('todoapp');
    const collection = db.collection('tasks');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
