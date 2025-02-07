export const dynamicConfig = 'force-dynamic';

import dynamic from 'next/dynamic';

const BudgetList = dynamic(() => import('./_components/BudgetList'), { ssr: false });

function Budget() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>My Budgets</h2>
      <BudgetList />
    </div>
  );
}

export default Budget;
