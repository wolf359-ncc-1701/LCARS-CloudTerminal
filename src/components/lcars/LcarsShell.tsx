import React from "react";

interface LcarsShellProps {
  mode?: string;
  alert?: string;
  visual?: string;
  children: React.ReactNode;
}

export const LcarsShell: React.FC<LcarsShellProps> = ({ mode, alert, visual, children }) => {
  return (
    <main className="lcars-app" data-mode={mode} data-alert={alert} data-visual={visual}>
      <div className="ambient-grid" aria-hidden="true" />
      {children}
    </main>
  );
};
