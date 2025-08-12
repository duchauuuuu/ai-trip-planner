'use client'
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
const menuOptions = [
    {
        name:'Home',
        path:'/'
     },
    {
        name:'Pricing',
        path:'/pricing'
    },
    {
        name:'Contact us',
        path:'/contact-us'
    } 
]
const Header = () => {
  const {user} = useUser();
  const path = usePathname();
  return (
    <div className='flex justify-between items-center p-4'>
    {/* logo */}
      <div className='flex items-center gap-2'>
        <Image src={'/logo.svg'} alt='logo' width={30} height={30}></Image>
         <h2 className='font-bold text-2xl'>AI TRIP PLANNER</h2>
      </div>
         {/* menu options */}       
      <div className='flex items-center gap-8'>
        {menuOptions.map((menu,index)=>(
            <Link href={menu.path} key={index}>
                <h2 className='text-lg hover:scale-105 transition-all hover:text-primary'>{menu.name}</h2>
            </Link>
        ))}
        </div>  
    {/* get started button */}
<div className='flex gap-5 items-center'>
    { !user ? 
  <SignInButton mode='modal'>
     <Button>
        Get started
    </Button>
   </SignInButton> :
   path === '/create-new-trip' ?
   <Link href={'/my-trips'}><Button>My trips</Button></Link>
   :
   <Link href={'/create-new-trip'}><Button>Create new trip</Button></Link>
}
<UserButton/>
</div>
    </div>
  )
}

export default Header