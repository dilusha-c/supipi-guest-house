import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { category, amount, description, date } = body;

    if (!category || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: "Invalid expense data" }, { status: 400 });
    }

    const newExpense = await prisma.expense.create({
      data: {
        category,
        amount,
        description: description || '',
        date: date ? new Date(date) : new Date(),
      }
    });

    return NextResponse.json({ success: true, expense: newExpense });
  } catch (error) {
    console.error("Expense Create Error:", error);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await prisma.expense.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Expense Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
