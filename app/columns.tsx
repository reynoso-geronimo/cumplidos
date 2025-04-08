"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define the data type based on your response data
export type Cumplido = {
  permiso: string
  cuitEmpresa: string
  cuitDespa: string
  oficializacion: string
  estado: string
  fechaEstado: string
  monto: string
  devoluciones: string
}

export const columns: ColumnDef<Cumplido>[] = [
  {
    accessorKey: "permiso",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Permiso
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "cuitEmpresa",
    header: "CUIT Empresa",
  },
  {
    accessorKey: "cuitDespa",
    header: "CUIT Despa",
  },
  {
    accessorKey: "oficializacion",
    header: "Oficialización",
  },
  {
    accessorKey: "estado",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "fechaEstado",
    header: "Fecha Estado",
  },
  {
    accessorKey: "monto",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Monto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "devoluciones",
    header: "Devoluciones",
  },
]
