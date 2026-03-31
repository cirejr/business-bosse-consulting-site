'use client';

import { use } from 'react';
import { getAllCategories } from "@/lib/data/categories";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import DeleteButton from "./delete-button";

interface CategoriesTableProps {
  categoriesPromise: Promise<{
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
  }[]>;
}

export function CategoriesTable({ categoriesPromise }: CategoriesTableProps) {
  const categories = use(categoriesPromise);

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                <TableCell>
                  {item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy') : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/categories/${item.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteButton id={item.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}