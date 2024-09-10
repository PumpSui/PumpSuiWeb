// components/PaginationComponent.tsx
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLoadMore?: () => void; // 新增的可选属性
  hasNextPage?: boolean; // 新增的可选属性，用于判断是否有下一页
  className?: string;
}

export const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onLoadMore,
  hasNextPage = false,
  className,
}) => {
  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    } else if (hasNextPage && onLoadMore) {
      onLoadMore();
    }
  };

  return (
    <Pagination className={`mt-10 ${className}`}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            isActive={currentPage === 1}
            href={"#"}
          />
        </PaginationItem>
        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i + 1)}
              isActive={currentPage === i + 1}
              href={"#"}
            >
             <p className="text-sm">{i + 1}</p>
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={handleNextClick}
            isActive={currentPage === totalPages && !hasNextPage}
            href={"#"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
