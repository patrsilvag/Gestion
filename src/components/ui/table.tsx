// src/components/ui/table.tsx
import * as React from "react";

function cn(...classes: Array<string | undefined | false | null>) {
	return classes.filter(Boolean).join(" ");
}

export const Table = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
	<table
		ref={ref}
		className={cn("w-full caption-bottom text-sm", className)}
		{...props}
	/>
));
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={cn("[&_tr:last-child]:border-0", className)}
		{...props}
	/>
));
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={cn("bg-muted/50 font-medium text-muted-foreground", className)}
		{...props}
	/>
));
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		className={cn(
			"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
			className
		)}
		{...props}
	/>
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			"h-10 px-2 text-left align-middle text-xs font-medium text-muted-foreground",
			className
		)}
		{...props}
	/>
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td ref={ref} className={cn("p-2 align-middle", className)} {...props} />
));
TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption
		ref={ref}
		className={cn("mt-4 text-sm text-muted-foreground", className)}
		{...props}
	/>
));
TableCaption.displayName = "TableCaption";

/** 🔁 Aliases para compatibilidad con tu proyecto actual (OCList.tsx) */
export {
	TableHeader as THead,
	TableBody as TBody,
	TableRow as TR,
	TableHead as TH,
	TableCell as TD,
};
