'use client';

import { use } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Eye, Search } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import ToggleStatus from "./toggle-status";

interface ArticlesTableProps {
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

export function ArticlesTable({ articlesPromise }: ArticlesTableProps) {
  const articles = use(articlesPromise);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <form className="flex-1" action="/dashboard/articles" method="GET">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="Search articles..."
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="secondary">Search</Button>
          </div>
        </form>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/articles">All</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/articles?status=published">Published</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/articles?status=draft">Drafts</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No articles found.
                    </TableCell>
                </TableRow>
            ) : (
                articles.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                            <ToggleStatus id={item.id} status={item.status} />
                        </TableCell>
                        <TableCell>
                            {item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy') : '-'}
                        </TableCell>
                        <TableCell>
                            {item.publishedAt ? format(new Date(item.publishedAt), 'MMM d, yyyy') : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" asChild title="Preview">
                                    <Link href={`/blog/${item.slug}`} target="_blank">
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="icon" asChild title="Edit">
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
    </>
  );
}