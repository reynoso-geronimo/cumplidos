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

// Define the enum type
const EstadoEnum = z.enum(["TODOS", "OBSERVADO"]);

// Validation schema with Zod
const formSchema = z.object({
  cuit: z.string().min(11, "El CUIT debe tener 11 caracteres").max(11, "El CUIT debe tener 11 caracteres"),
  password: z.string().min(4, "La contraseña es obligatoria"),
  estado: EstadoEnum,
  empresa: z.string(),
  rango: z.string().min(1, "El rango debe ser mayor a 0").max(12, "El rango debe ser menor a 12"),
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [responseData, setResponseData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuit: "",
      password: "",
      estado: "TODOS",
      rango: "1",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError("");
    try {
      const response = await puppeteerReintegros(values);

      if (!response || response.length === 0) {
        setError("No se encontraron resultados.");
      } else {
        // Extract and split tab-separated values
        const formattedData = response.map((item: { text: string }) => item.text.split("\t"));
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
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {empresas.map(empresa => (
                      <SelectItem key={empresa.cuit} value={empresa.cuit}>
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

      {/* Response Table */}
      {responseData.length > 0 && (
        <div className="mt-6 w-full ">
          <h3 className="text-lg font-semibold">Resultados</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 capitalize">
                  <th className="border border-gray-300 px-4 py-2">Permiso</th>
                  <th className="border border-gray-300 px-4 py-2">CUIT EMPRESA</th>
                  <th className="border border-gray-300 px-4 py-2">CUIT DESPA</th>
                  <th className="border border-gray-300 px-4 py-2">Oficialización</th>
                  <th className="border border-gray-300 px-4 py-2">Estado</th>
                  <th className="border border-gray-300 px-4 py-2">Fecha estado</th>
                  <th className="border border-gray-300 px-4 py-2">Monto</th>
                  <th className="border border-gray-300 px-4 py-2">Devoluciones</th>
                </tr>
              </thead>
              <tbody>
                {responseData.map((row, index) => (
                  <tr key={index} className="border border-gray-300">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
