import { connect } from "@/lib/connect";
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// GET tasks
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = connect();
    const { rows: data } = await db.query(
      "SELECT * FROM progressTrackerTasks WHERE user_id = $1",
      [userId]
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

// ADD task
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, progress, frequency } = body;

    const db = connect();
    const query = `INSERT INTO progressTrackerTasks (title, description, progress, frequency, user_id) 
                    VALUES ($1, $2, $3, $4, $5) 
                    RETURNING *`;
    const values = [title, description, progress, frequency, userId];
    const { rows: data } = await db.query(query, values);

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error adding task" }, { status: 500 });
  }
}

// EDIT task
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, progress, frequency } = body;

    const db = connect();
    const query = `UPDATE progressTrackerTasks 
                    SET title = $1, description = $2, progress = $3, frequency = $4, updated_at = NOW() 
                    WHERE id = $5 AND user_id = $6
                    RETURNING *`;
    const values = [title, description, progress, frequency, id, userId];
    const { rows: data } = await db.query(query, values);

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error editing task" }, { status: 500 });
  }
}

// DELETE task
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    const db = connect();
    const query =
      "DELETE FROM progressTrackerTasks WHERE id = $1 AND user_id = $2 RETURNING *";
    const { rows: data } = await db.query(query, [id, userId]);

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}
