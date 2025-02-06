"use client"; 
import React, {useEffect} from 'react';
import Image from 'next/image';
import {LayoutGrid, PiggyBank, ReceiptText, ShieldCheck} from "lucide-react";
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function SideNav() {
    const menuList=[
        {
            id:1,
            name:'Dashboard',
            icon:LayoutGrid,
            path:'/dashboard'
        },
        {
            id:2,
            name:'Budget',
            icon:PiggyBank,
            path:'/dashboard/budgets'
        },
        {
            id:3,
            name:'Expenses',
            icon:ReceiptText,
            path:'/dashboard/expenselist'


        },
        {
            id:4,
            name:'Upgrade',
            icon:ShieldCheck,
            path:'/dashboard/upgrade'
        }

    ]
    const path = usePathname();

    useEffect(() => {
        console.log(path)
    }, [])


  return (
    <div className='h-screen p-5 border shadow-sm'>
       <Image 
              src="/logo.svg"  
              alt="logo"
              width={70}
              height={40}
        />
                <div className='mt-5'>
  {menuList.map((menu, index) => (
    <Link href={menu.path}>
      <h2 className={`flex gap-2 items-center
        p-5 cursor-pointer rounded-md 
        text-gray-500 font-medium
        mb-2
        ${path==menu.path&&'text-primary bg-blue-100'}
        hover:text-primary hover:bg-blue-100
      `}>
        <menu.icon />
        {menu.name}
      </h2>
    </Link>
  ))}

                </div>
                <div className='fixed bottom-5 p-5 flex gap-2 items-center'>
                   <UserButton/>
                   Profile
                </div>
        </div>
  )
}

export default SideNav
