import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import AgentLogin from "./pages/AgentLogin";
import ClientLogin from "./pages/ClientLogin";
import AgentDashboard from "./pages/AgentDashboard";
import BuyerPortal from "./pages/BuyerPortal";
import SellerPortal from "./pages/SellerPortal";

function useAgentAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("realtyflow_agent_token"));
  return { token, isAuthed: !!token, setToken };
}

function useClientAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("realtyflow_client_token"));
  return { token, isAuthed: !!token, setToken };
}

function AgentLoginRoute() {
  const navigate = useNavigate();
  return <AgentLogin onLoginSuccess={() => navigate("/dashboard")} />;
}

function ClientLoginRoute() {
  const navigate = useNavigate();
  // Real app: read the client's own contact_type from /portal/me and route
  // to the matching portal automatically instead of asking here.
  return (
    <ClientLogin
      onLoginSuccess={() => navigate("/portal/buyer")}
    />
  );
}

function RequireAgentAuth({ children }) {
  const { isAuthed } = useAgentAuth();
  return isAuthed ? children : <Navigate to="/login" replace />;
}

function RequireClientAuth({ children }) {
  const { isAuthed } = useClientAuth();
  return isAuthed ? children : <Navigate to="/portal/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Agent Dashboard */}
        <Route path="/login" element={<AgentLoginRoute />} />
        <Route
          path="/dashboard"
          element={
            <RequireAgentAuth>
              <AgentDashboard />
            </RequireAgentAuth>
          }
        />

        {/* Client Portal - buyer and seller are separate flows per the brief */}
        <Route path="/portal/login" element={<ClientLoginRoute />} />
        <Route
          path="/portal/buyer"
          element={
            <RequireClientAuth>
              <BuyerPortal />
            </RequireClientAuth>
          }
        />
        <Route
          path="/portal/seller"
          element={
            <RequireClientAuth>
              <SellerPortal />
            </RequireClientAuth>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
