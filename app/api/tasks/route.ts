import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set');
}
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('todoapp');
    const collection = db.collection('tasks');
    const tasks = await collection.find({}).toArray();

    // Convert MongoDB _id to string id for client-side use
    const formattedTasks = tasks.map((task) => ({
      ...task,
      id: task._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(formattedTasks);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  try {
    const task = await request.json();
    await client.connect();
    const db = client.db('todoapp');
    const collection = db.collection('tasks');
    const result = await collection.insertOne(task);

    // Convert the inserted _id to a string for client-side use
    const insertedTask = {
      ...task,
      id: result.insertedId.toString(),
      _id: undefined,
    };

    return NextResponse.json(insertedTask);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  } finally {
    await client.close();
  }
}