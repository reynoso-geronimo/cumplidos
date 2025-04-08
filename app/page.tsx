"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { puppeteerReintegros } from "./utils/pupeteer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { empresas } from ".";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Cumplido, columns } from "./columns";

// Define the enum type
const EstadoEnum = z.enum(["TODOS", "OBSERVADO"]);

// Validation schema with Zod
const formSchema = z.object({
  cuit: z.string().min(11, "El CUIT debe tener 11 caracteres").max(11, "El CUIT debe tener 11 caracteres"),
  password: z.string().min(4, "La contraseña es obligatoria"),
  estado: EstadoEnum,
  empresa: z.string(),
  rango: z.string().min(1, "El rango debe ser mayor a 0").max(12, "El rango debe ser menor a 12"),
  aduana: z.string(),
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [responseData, setResponseData] = useState<Cumplido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuit: "",
      password: "",
      estado: "TODOS",
      rango: "1",
      aduana: "060",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError("");
    try {
      const response = await puppeteerReintegros(values);

      // Check if response is an error object
      if ("error" in response) {
        setError(response.error);
        return;
      }

      if (!response || response.length === 0) {
        setError("No se encontraron resultados.");
      } else {
        // Extract and split tab-separated values
        const formattedData = response.map((item: { text: string }) => {
          const rowData = item.text.split("\t");
          return {
            permiso: rowData[0] || "",
            cuitEmpresa: rowData[1] || "",
            cuitDespa: rowData[2] || "",
            oficializacion: rowData[3] || "",
            estado: rowData[4] || "",
            fechaEstado: rowData[5] || "",
            monto: rowData[6] || "",
            devoluciones: rowData[7] || "",
          };
        });
        setResponseData(formattedData);
      }
    } catch (err) {
      console.error("Error al ejecutar Puppeteer:", err);
      setError("Hubo un error al obtener los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center container my-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          {/* CUIT */}
          <FormField
            control={form.control}
            name="cuit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CUIT</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese CUIT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contraseña */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Ingrese contraseña" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            {/* Estado */}
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TODOS">TODOS</SelectItem>
                      <SelectItem value="OBSERVADO">OBSERVADO</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rango */}
            <FormField
              control={form.control}
              name="rango"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rango</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione rango" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(12)].map((_, index) => (
                        <SelectItem key={index + 1} value={(index + 1).toString()}>
                          {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Aduana */}
            <FormField
              control={form.control}
              name="aduana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aduana</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione aduana" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(160)].map((_, index) => {
                        // Format the aduana number as a 3-digit string with leading zeros
                        const aduanaNumber = (index + 1).toString().padStart(3, "0");
                        return (
                          <SelectItem key={index + 1} value={aduanaNumber}>
                            {aduanaNumber}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Empresas */}
          <FormField
            control={form.control}
            name="empresa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="max-w-full overflow-hidden">
                      <SelectValue placeholder="Seleccione empresa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {empresas.map(empresa => (
                      <SelectItem
                        key={empresa.cuit}
                        value={empresa.cuit}
                        title={empresa.nombre} // Shows full name on hover
                      >
                        {empresa.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botón de envío */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Realizando acciones..." : "Comenzar"}
          </Button>
        </form>
      </Form>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Response Table - Now using DataTable component */}
      {responseData.length > 0 && (
        <div className="mt-6 w-full">
          <h3 className="text-lg font-semibold mb-4">Resultados</h3>
          <DataTable columns={columns} data={responseData} />
        </div>
      )}
    </main>
  );
}
