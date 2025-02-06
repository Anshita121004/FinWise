"use client";

import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
import { getTableColumns, sql, eq, desc } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import BudgetItem from './BudgetItem';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { sum, count } from 'drizzle-orm';

function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    if (!user) return;

    try {
      const result = await db.select({
        ...getTableColumns(Budgets),
        totalSpend: sum(sql`CAST(${Expenses.amount} AS DECIMAL)`).mapWith(Number),
        totalItem: count(Expenses.id).mapWith(Number),
      })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id))

      setBudgetList(result);
    } catch (error) {
      console.error("Error fetching budget list:", error);
      
    }
  };

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateBudget
        refreshData={()=>getBudgetList()} />
        {budgetList?.length>0 ? budgetList.map((budget, index) => (
          <BudgetItem budget={budget} /> 
        ))
        :[1,2,3,4,5].map((item, index)=>(
          <div key={index} className='w-full bg-slate-200 rounded-lg
          h-[150px] animate-pulse'>

          </div>
        ))
      }
      </div>
    </div>
  );
}

export default BudgetList;
