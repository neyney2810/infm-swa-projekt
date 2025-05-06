"use client";
import { DataUnit } from "@/app/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface TableContextProps {
  tableData: DataUnit[];
  setTableData: (data: DataUnit[]) => void;
  filter: { year: number | null; bundesland: string | null };
  setFilter: (filter: { year: number | null; bundesland: string | null }) => void;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

export const TableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tableData, setTableData] = useState<DataUnit[]>([]);
  const [filter, setFilter] = useState<{ year: number | null; bundesland: string | null }>({
    year: 2023,
    bundesland: "by"
  });

  return <TableContext.Provider value={{ tableData, setTableData, filter, setFilter }}>{children}</TableContext.Provider>;
};

export const useTableContext = (): TableContextProps => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};
