"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import puppeteerBrowser from "./utils/pupeteer";

// Esquema de validación con Zod
const formSchema = z.object({
  cuit: z.string().min(11, "El CUIT debe tener 11 caracteres").max(11, "El CUIT debe tener 11 caracteres"),
  password: z.string().min(4, "La contraseña es obligatoria"),
});

export default function Home() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuit: "",
      password: "",
    },
  });

  const onSubmit = async (values: { cuit: string; password: string }) => {
    try {
      await puppeteerBrowser(values);
    } catch (err) {
      console.error("Error al ejecutar Puppeteer:", err);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center container mx-auto mt-12 max-w-xs">
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

          {/* Botón de envío */}
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Realizando acciones" : "Comenzar"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
