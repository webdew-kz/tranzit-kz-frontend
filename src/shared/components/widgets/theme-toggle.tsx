"use client"

import * as React from "react"
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { useTheme } from "next-themes"
import { Sun } from "lucide-react"

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const isLight = theme === "light";

	return (
		<div className="flex items-center space-x-2 cursor-pointer">
			<Switch
				id="airplane-mode"
				checked={isLight}
				onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
				className="cursor-pointer"
			/>
			<Label
				htmlFor="airplane-mode"
				className="cursor-pointer"
			>
				<Sun size={24} />
			</Label>
		</div>
	);
}
