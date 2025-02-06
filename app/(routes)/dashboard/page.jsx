"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import CardInfo from './_components/CardInfo';
import { sum, count } from 'drizzle-orm';
import { db } from '@/utils/dbConfig'; 
import { Budgets, Expenses} from '@/utils/schema'; 
import { getTableColumns } from 'drizzle-orm';
import { eq, desc, sql } from 'drizzle-orm';
import BarChartDashboard from './_components/BarChartDashboard';
import { index } from 'drizzle-orm/pg-core';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/[id]/_components/ExpenseListTable';


function Dashboard() {
  const [budgetList, setBudgetList] = useState([]);
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

      setBudgetList(result);
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

  return (
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>Hey, {user?.fullName}💙</h2>
      <p className='text-gray-500'>
        Get a clear picture of your spending and take control of your budget!
      </p>

      <CardInfo budgetList={budgetList} /> 
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
            <BarChartDashboard
            budgetList={budgetList}
            />
            <ExpenseListTable
            expensesList={expensesList}
            refreshData={()=>getBudgetList}/>
        </div>
      <div className='grid gap-5'>
        <h2 className='font-bold text-lg'>Latest Budgets</h2>
       {budgetList.map((budget, index)=>
       <BudgetItem budget={budget} key={index}/>
      )}
       </div>
       </div>
    </div>
  );
}

export default Dashboard;
