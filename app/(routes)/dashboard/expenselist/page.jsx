"use client";

import { useUser } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { sum, count } from 'drizzle-orm';
import { db } from '@/utils/dbConfig'; 
import { Budgets, Expenses} from '@/utils/schema'; 
import { getTableColumns } from 'drizzle-orm';
import { eq, desc, sql } from 'drizzle-orm';
// Removed unused import
import ExpenseListTable from '../expenses/[id]/_components/ExpenseListTable';

export default function ExpenseList() {

      
    const { user } = useUser();
    const [expensesList, setExpensesList]= useState();

    useEffect(() => {
        if (user) { 
          getBudgetList();
        }
      }, [user]);
   

    const getBudgetList = async () => {
        try {
          const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpend: sum(sql`CAST(${Expenses.amount} AS DECIMAL)`).mapWith(Number),
            totalItem: count(Expenses.id).mapWith(Number),
          })
            .from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)) // Use optional chaining
            .groupBy(Budgets.id)
            .orderBy(desc(Budgets.id));
    
          setExpensesList(result);
          getAllExpenses();
        } catch (error) {
          console.error("Error fetching budget list:", error);
        }
      };

    const getAllExpenses= async()=>{
        const result=await db.select({
          id:Expenses.id,
          name:Expenses.name,
          amount:Expenses.amount,
          createdAt:Expenses.createdAt
        }).from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
        .orderBy(desc(Expenses.id));
         
        setExpensesList(result);
      }
   


    return(
        <div>
            <div className='p-8'></div>
            <div className='md:col-span-2'>
                <ExpenseListTable
                expensesList={expensesList}
                refreshData={()=>getBudgetList}/>
            </div>
        </div>
    )
    

}
