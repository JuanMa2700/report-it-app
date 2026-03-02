import { AuthProvider } from "@/contexts/auth-context";
import { Routes } from "@/routes";

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
