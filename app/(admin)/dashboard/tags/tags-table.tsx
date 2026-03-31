'use client';

import { use } from 'react';
import { getAllTags } from "@/lib/data/tags";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import DeleteButton from "./delete-button";

interface TagsTableProps {
  tagsPromise: Promise<{
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
  }[]>;
}

export function TagsTable({ tagsPromise }: TagsTableProps) {
  const tags = use(tagsPromise);

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
          {tags.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No tags found.
              </TableCell>
            </TableRow>
          ) : (
            tags.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                <TableCell>
                  {item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy') : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/tags/${item.id}`}>
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