import { NextRequest, NextResponse } from 'next/server';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  agentId?: string;
  modelId?: string;
  input?: unknown;
  output?: unknown;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

const taskStore = new Map<string, Task>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');
    const status = searchParams.get('status');
    const agentId = searchParams.get('agentId');

    if (taskId) {
      const task = taskStore.get(taskId);
      if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: task });
    }

    let tasks = Array.from(taskStore.values());

    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }

    if (agentId) {
      tasks = tasks.filter((t) => t.agentId === agentId);
    }

    tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: tasks,
      meta: { total: tasks.length },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, agentId, modelId, input } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'title is required' },
        { status: 400 }
      );
    }

    const id = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();

    const task: Task = {
      id,
      title,
      description: description || undefined,
      status: 'pending',
      agentId: agentId || undefined,
      modelId: modelId || undefined,
      input: input || undefined,
      createdAt: now,
      updatedAt: now,
    };

    taskStore.set(id, task);

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}