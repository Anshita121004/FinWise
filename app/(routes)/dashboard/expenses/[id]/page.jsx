"use client"
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { getTableColumns, sql, eq, desc } from 'drizzle-orm';
import { sum, count } from 'drizzle-orm';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from './_components/AddExpense';
import ExpenseListTable from './_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from './_components/EditBudget';

function ExpensesScreen({ params }) {
    const { user } = useUser();
    const [budgetInfo, setBudgetInfo] = useState(null);
    const [expensesList, setExpensesList] = useState([]);
    const route = useRouter();

    useEffect(() => {
        if (user && params.id) {
            getBudgetInfo();
        }
    }, [user, params.id]);

    /** Get Budget Information */
    const getBudgetInfo = async () => {
        try {
            const result = await db.select({
                ...getTableColumns(Budgets),
                totalSpend: sum(sql`CAST(${Expenses.amount} AS DECIMAL)`).mapWith(Number),
                totalItem: count(Expenses.id).mapWith(Number),
            })
                .from(Budgets)
                .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
                .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
                .where(eq(Budgets.id, params.id))
                .groupBy(Budgets.id);

            if (result.length > 0) {
                setBudgetInfo(result[0]);
            } else {
                setBudgetInfo(null);
            }

            getExpenseList();
        } catch (error) {
            console.error("Error fetching budget info:", error);
        }
    };

    /** Get Expense Information */
    const getExpenseList = async () => {
        try {
            const result = await db.select().from(Expenses)
                .where(eq(Expenses.budgetId, params.id))
                .orderBy(desc(Expenses.id));

            setExpensesList(result);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    /** Delete Budget */
    const deleteBudget = async () => {
        try {
            await db.delete(Expenses).where(eq(Expenses.budgetId, params.id));
            await db.delete(Budgets).where(eq(Budgets.id, params.id));
            toast('Budget Deleted!');
            route.replace('/dashboard/budgets');
        } catch (error) {
            console.error("Error deleting budget:", error);
            toast('Failed to delete budget.');
        }
    };

    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold flex justify-between items-center'>
                My Expenses
                <div className='flex gap-2 items-center'>
                    {budgetInfo && <EditBudget budgetInfo={budgetInfo}
                    refreshData={()=>getBudgetInfo()} />}
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button className='flex gap-2' variant='destructive'>
                                <Trash2 /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your budget
                                    along with the related expenses.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteBudget}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {budgetInfo ? (
                    <BudgetItem budget={budgetInfo} />
                ) : (
                    <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
                )}
                <AddExpense budgetId={params.id} user={user} refreshData={getBudgetInfo} />
            </div>

            <div className='mt-4'>
                <ExpenseListTable expensesList={expensesList} refreshData={getBudgetInfo} />
            </div>
        </div>
    );
}

export default ExpensesScreen;
