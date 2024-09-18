"use client";
import Image from "next/image";
import { useState } from "react";

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(3); // Set trang hiện tại là 3

  const totalPages = 10;
  const arrPage = [...Array(10)];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex items-center justify-between space-x-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className={`${
          currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
        } p-2`}
        disabled={currentPage === 1}
      >
        <Image
          src="/icon/arrow-left.svg"
          alt="arrow icon"
          width={20}
          height={20}
          style={{ width: 20, height: 20 }}
        />
      </button>

      <div className="flex space-x-2">
        {arrPage.map((_, index) => {
          const pageNumber = index + 1;
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            Math.abs(currentPage - pageNumber) < 2
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`font-medium text-base hover:bg-blue-600 hover:text-white rounded-[8px] ${
                  currentPage === pageNumber
                    ? "bg-blue-700 text-white"
                    : "text-gray-900"
                } rounded-lg px-3 py-2`}
              >
                {pageNumber}
              </button>
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
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className={`${
          currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
        } p-2`}
        disabled={currentPage === totalPages}
      >
        <Image
          src="/icon/arrow-right.svg"
          alt="arrow icon"
          width={20}
          height={20}
          style={{ width: 20, height: 20 }}
        />
      </button>
    </div>
  );
}
