"use client";

import { ConfigProvider, Modal } from "antd";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface FormModalShellProps {
  children: ReactNode;
  closeHref: string;
  title?: string;
  description?: string;
}

export function FormModalShell({
  children,
  closeHref,
  title,
  description,
}: FormModalShellProps) {
  const router = useRouter();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4f46e5",
          borderRadiusLG: 18,
          fontFamily: "var(--font-body)",
        },
      }}
    >
      <main className="min-h-[calc(100vh-100px)] px-4 py-6 sm:py-10 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_32%)]"
        />

        <Modal
          open
          centered
          footer={null}
          width={980}
          rootClassName="inventory-ant-modal"
          destroyOnClose
          onCancel={() => router.push(closeHref)}
          title={
            <div className="min-w-0 pr-8">
              {title ? (
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                  {title}
                </h1>
              ) : null}
              {description ? (
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              ) : null}
            </div>
          }
          styles={{
            mask: {
              backdropFilter: "blur(6px)",
            },
            header: {
              marginBottom: 0,
              borderBottom: "1px solid rgb(226 232 240 / 0.8)",
              padding: "1.1rem 1.4rem",
            },
            body: {
              maxHeight: "calc(100vh - 10rem)",
              overflowY: "auto",
              padding: "1.25rem 1.4rem",
            },
          }}
        >
          {children}
        </Modal>
      </main>
    </ConfigProvider>
  );
}
