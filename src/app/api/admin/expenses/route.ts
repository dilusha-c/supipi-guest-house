import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES = [
  'Electricity', 
  'Water', 
  'Broadband', 
  'Maintenance', 
  'Food', 
  'Supplies', 
  'Staff', 
  'Other'
];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { category, amount, description, date } = body;

    if (!category || typeof category !== 'string' || !VALID_CATEGORIES.includes(category.trim())) {
      return NextResponse.json({ error: "Invalid expense category" }, { status: 400 });
    }

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
      return NextResponse.json({ error: "Invalid amount. Must be a positive finite number." }, { status: 400 });
    }

    let parsedDate = new Date();
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        parsedDate = d;
      }
    }

    const roundedAmount = Math.round(amount * 100) / 100;

    const newExpense = await prisma.expense.create({
      data: {
        category: category.trim(),
        amount: roundedAmount,
        description: description ? String(description).trim().slice(0, 300) : '',
        date: parsedDate,
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
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: "Missing or invalid ID" }, { status: 400 });
    }

    const existing = await prisma.expense.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: "Expense record not found" }, { status: 404 });
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
