"use client";

import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

const Header = () => {
  const { user, isSignedIn } = useUser();

  return (
    <div className='p-5 flex justify-between items-center border shadow-md'>
      <Image src='/logo.svg' alt='logo' width={70} height={40} priority />
      
      {isSignedIn ? <UserButton /> : (
        <Link href='/sign-in'>
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
};

export default Header;
