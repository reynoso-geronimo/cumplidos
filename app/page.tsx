"use client";
import { Button } from "@/components/ui/button";
import puppeteerBrowser from "./utils/pupeteer";

export default function Home() {
  return (
    <main>
      <Button
        onClick={() => {
          puppeteerBrowser({ cuit: "", password: "" });
        }}
      >
        Click
      </Button>
    </main>
  );
}
