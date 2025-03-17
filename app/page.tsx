"use client";
import { Button } from "@/components/ui/button";
import puppeteerBrowser from "./utils/pupeteer";

export default function Home() {
  return (
    <main>
      <Button
        onClick={() => {
          puppeteerBrowser({ cuit: "20222222222", password: "123456" });
        }}
      >
        Click
      </Button>
    </main>
  );
}
