'use client';

import { use } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface RecentArticlesTableProps {
  articlesPromise: Promise<{
    id: string;
    title: string;
    slug: string;
    content: string | null;
    excerpt: string | null;
    coverImageUrl: string | null;
    status: "draft" | "published";
    authorId: string;
    publishedAt: Date | null;
    wpId: number | null;
    meta: unknown;
    createdAt: Date;
    updatedAt: Date;
  }[]>;
}

export function RecentArticlesTable({ articlesPromise }: RecentArticlesTableProps) {
  const articles = use(articlesPromise);

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No articles yet. Create your first article!
              </TableCell>
            </TableRow>
          ) : (
            articles.slice(0, 5).map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      item.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>
                  {item.createdAt
                    ? format(new Date(item.createdAt), "MMM d, yyyy")
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Preview"
                    >
                      <Link href={`/blog/${item.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Edit"
                    >
                      <Link href={`/dashboard/articles/${item.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
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