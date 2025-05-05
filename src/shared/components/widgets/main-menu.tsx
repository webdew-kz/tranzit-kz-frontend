"use client"

import * as React from "react"

import { cn } from "@/shared/lib/utils"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/shared/components/ui/navigation-menu"
import { Cog, Minus, Plus, Search, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

const menuItems = [
	{
		title: "Главная",
		href: "/",
	},
	{
		title: "Груз",
		subItems: [
			{
				title: "Найти груз",
				href: "/cargo/search",
				icon: <Search size={16} strokeWidth={1} />
			},
			{
				title: "Добавить груз",
				href: "/cargo/add",
				icon: <Plus size={16} strokeWidth={1} />
			},
		]
	},
	{
		title: "Транспорт",
		subItems: [
			{
				title: "Найти транспорт",
				href: "/transport/search",
				icon: <Search size={16} strokeWidth={1} />
			},
			{
				title: "Добавить транспорт",
				href: "/transport/add",
				icon: <Plus size={16} strokeWidth={1} />
			},
		]
	},
	{
		title: "Вакансии",
		subItems: [
			{
				title: "Найти вакансию",
				href: "/vacancy/search",
				icon: <Search size={16} strokeWidth={1} />
			},
			{
				title: "Добавить вакансию",
				href: "/vacancy/add",
				icon: <Plus size={16} strokeWidth={1} />
			},
		]
	},
	{
		title: "Фуры",
		subItems: [
			{
				title: "Купить фуру",
				href: "/track/buy",
				icon: <Plus size={16} strokeWidth={1} />
			},
			{
				title: "Продать фуру",
				href: "/track/sell",
				icon: <Minus size={16} strokeWidth={1} />
			},
			{
				title: "Купить запчасти",
				href: "/track/buy",
				icon: <Cog size={16} strokeWidth={1} />
			},
			{
				title: "Продать запчасти",
				href: "/track/sell",
				icon: <Cog size={16} strokeWidth={1} />
			},
		]
	},
	{
		title: "чс",
		href: "/",
	},
]


export default function MainMenu() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				{menuItems.map((item) => (
					item.subItems ? (
						<NavigationMenuItem key={item.title}>
							<NavigationMenuTrigger className='dark:bg-black bg-white cursor-pointer text-[1rem] '>{item.title}</NavigationMenuTrigger>
							<NavigationMenuContent className=''>
								<ul className="grid w-[200px] gap-3 p-4 md:w-[736px] md:grid-cols-2 lg:w-[1168px] ">
									{item.subItems?.map((component) => (
										<ListItem
											key={component.title}
											title={component.title}
											href={component.href}
										>
											{component.icon}
										</ListItem>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
					) : !item.subItems && item.href ? (

						<NavigationMenuItem key={item.title}>
							<NavigationMenuLink asChild className='cursor-pointer text-[1rem] '>
								<Link href={item.href}>
									{item.title}
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					) : (
						<></>
					)
				))}
			</NavigationMenuList>
		</NavigationMenu>
	)
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className
					)}
					{...props}
				>
					<div className=" flex items-center gap-2">
						{children}
						<span className="text-sm font-medium leading-none">{title}</span>
					</div>
				</a>
			</NavigationMenuLink>
		</li>
	)
})
ListItem.displayName = "ListItem"
