import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AccesAdmin() {
  const router = useRouter();
  useEffect(() => {
    try {
      localStorage.setItem("vs_customer", "vc-admin-sophie-2026");
      localStorage.setItem("vs_plan", "premium");
    } catch (e) {}
    router.replace("/app");
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#09090f", color: "#f1f5f9", fontFamily: "sans-serif" }}>
      Connexion en cours…
    </div>
  );
}
