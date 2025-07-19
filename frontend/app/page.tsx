"use client";

import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "2rem" }}>Product Management System</h1>
      <Button
        type="primary"
        size="large"
        onClick={() => router.push("/products")}
      >
        Go to Products
      </Button>
    </div>
  );
}
