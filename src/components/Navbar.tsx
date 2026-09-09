"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, FileText, CheckCircle2 } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      isActive: pathname === "/",
    },
    {
      name: "Patrocinadores",
      href: "/sponsors",
      icon: Building2,
      isActive: pathname === "/sponsors" || pathname.startsWith("/sponsors/"),
    },
    {
      name: "Contratos",
      href: "/contracts",
      icon: FileText,
      isActive: pathname === "/contracts" || pathname.startsWith("/contracts/"),
    },
    {
      name: "Contrapartidas",
      href: "/deliverables",
      icon: CheckCircle2,
      isActive: pathname === "/deliverables" || pathname.startsWith("/deliverables/"),
    },
  ];

  return (
    <header style={{ width: "100%", position: "sticky", top: 0, zIndex: 40 }}>
      {/* Faixa Tricolor Superior Oficial */}
      <div style={{ display: "flex", height: "4px", width: "100%" }}>
        <div style={{ flex: 1, backgroundColor: "#D71920" }} />
        <div style={{ width: "40px", backgroundColor: "#FFFFFF" }} />
        <div style={{ flex: 1, backgroundColor: "#1A1D20" }} />
      </div>

      {/* Barra de Navegação */}
      <div
        style={{
          borderBottom: "1px solid #1E2328",
          backgroundColor: "#0E1216",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* Logo & Marca Oficial */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/spfc-logo.png"
                alt="Escudo Oficial SPFC"
                width={42}
                height={42}
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                    color: "#FFFFFF",
                  }}
                >
                  SPONSORHUB
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    backgroundColor: "#1A2026",
                    color: "#9CA3AF",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    border: "1px solid #283038",
                  }}
                >
                  SPFC
                </span>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#E5E7EB",
                  opacity: 0.9,
                  margin: "1px 0 0 0",
                  fontWeight: 500,
                }}
              >
                Gestão Oficial de Patrocínios e Ativações
              </p>
            </div>
          </Link>

          {/* Links de Navegação */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: "12px",
                    fontWeight: item.isActive ? 700 : 600,
                    color: "#FFFFFF",
                    textDecoration: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    backgroundColor: item.isActive ? "#D71920" : "#12161B",
                    border: item.isActive
                      ? "1px solid #D71920"
                      : "1px solid #283038",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.15s ease-in-out",
                    boxShadow: item.isActive
                      ? "0 2px 8px rgba(215, 25, 32, 0.35)"
                      : "none",
                  }}
                >
                  <Icon size={14} color={item.isActive ? "#FFFFFF" : "#D1D5DB"} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
