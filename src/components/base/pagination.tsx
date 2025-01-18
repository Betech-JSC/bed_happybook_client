"use client";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({
  totalPages,
  currentPage,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams.toString());
  const previous = new URLSearchParams(searchParams.toString());
  previous.set("page", (currentPage - 1).toString());
  const next = new URLSearchParams(searchParams.toString());
  next.set("page", (currentPage + 1).toString());
  return (
    <div className="flex items-center justify-between space-x-4">
      {currentPage > 1 ? (
        <Link href={`?${previous.toString()}`} className="p-2">
          <Image
            src="/icon/arrow-left.svg"
            alt="arrow icon"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          />
        </Link>
      ) : (
        <button
          className={`${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          } p-2`}
          disabled
        >
          <Image
            src="/icon/arrow-left.svg"
            alt="arrow icon"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          />
        </button>
      )}
      <div className="flex space-x-2">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNumber = i + 1;
          newSearchParams.set("page", (i + 1).toString());
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            Math.abs(currentPage - pageNumber) < 2
          ) {
            return (
              <Link
                key={pageNumber}
                href={`?${newSearchParams.toString()}`}
                className={`font-medium text-base hover:bg-blue-600 hover:text-white rounded-[8px] ${
                  currentPage === pageNumber
                    ? "bg-blue-700 text-white"
                    : "text-gray-900"
                } rounded-lg px-3 py-2`}
              >
                {pageNumber}
              </Link>
            );
          } else if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return (
              <span key={pageNumber} className="px-3 py-2">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>
      {currentPage < totalPages ? (
        <Link href={`?${next.toString()}`} className={`p-2`}>
          <Image
            src="/icon/arrow-right.svg"
            alt="arrow icon"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          />
        </Link>
      ) : (
        <button
          className={`${
            currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
          } p-2`}
          disabled
        >
          <Image
            src="/icon/arrow-right.svg"
            alt="arrow icon"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          />
        </button>
      )}
    </div>
  );
}
