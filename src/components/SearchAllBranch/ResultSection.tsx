"use client";

import { AlignLeft, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import CustomTag from "@/components/CustomTag";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BranchStatusEnum } from "@/types";
import type IBranch from "@/types/branch";

import { EmptyComponent } from "../Empty";

type ResultSectionProps = {
  branches: IBranch[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const ResultSection = ({
  branches,
  currentPage,
  totalPages,
  onPageChange,
}: ResultSectionProps) => {
  return (
    <div>
      {/* Results Section */}
      <div className="mt-4">
        {branches?.length > 0 ? (
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {branches?.map(
              (br) =>
                br.status === BranchStatusEnum.ACTIVE && (
                  <div
                    key={br.id}
                    className="rounded-lg border border-green-500 bg-white p-2 shadow-md"
                  >
                    <Link href={`/badminton/${br.name}`}>
                      <div className="relative h-48">
                        <Image
                          src={br.images[0] ?? ""}
                          alt={br.name}
                          layout="fill"
                          objectFit="cover"
                          className="h-48 rounded-md object-cover"
                        />
                      </div>
                      <div className="my-1">
                        <CustomTag status={br.status} />
                      </div>
                      <h2 className="mt-2 text-lg font-bold">{br.name}</h2>
                      <div className="flex items-start gap-1">
                        <div className="w-5">
                          <MapPin className="w-5" />
                        </div>
                        <span className="text-sm">{br.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5">
                          <AlignLeft className="w-5" />
                        </div>
                        <p className="description flex overflow-hidden truncate text-sm">
                          {br.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5">
                          <Clock className="w-5" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {br.availableTime}
                        </span>
                      </div>
                    </Link>
                  </div>
                )
            )}
          </div>
        ) : (
          <EmptyComponent
            title="No Branch Found"
            description="Search other keyword instead!"
            className="w-full"
          />
        )}
        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    onPageChange(currentPage - 1);
                  }
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(index + 1);
                  }}
                  isActive={index + 1 === currentPage}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) {
                    onPageChange(currentPage + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ResultSection;
