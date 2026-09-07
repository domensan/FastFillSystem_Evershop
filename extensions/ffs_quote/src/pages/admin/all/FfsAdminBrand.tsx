import React from 'react';

export default function FfsAdminBrand({ dashboardUrl }: { dashboardUrl: string }) {
  return (
    <>
      <style>{`:root{--primary:#5685ad!important;--ring:#5685ad!important}.dark{--primary:#6f9ec4!important;--ring:#6f9ec4!important}.header .logo{display:none!important}.admin-navigation{scrollbar-color:#5685ad #edeeef}.admin-navigation::-webkit-scrollbar-thumb{background-color:#5685ad!important;outline-color:#5685ad!important}`}</style>
      <a href={dashboardUrl} aria-label="Fast Fill Systems dashboard"
        style={{ width: 42, height: 46, overflow: 'hidden', display: 'block' }}>
        <img src="/ffs/logo.png" alt="" style={{ height: 46, width: 'auto', maxWidth: 'none' }} />
      </a>
    </>
  );
}

export const layout = { areaId: 'header', sortOrder: 5 };

export const query = `
  query FfsAdminBrand {
    dashboardUrl: url(routeId: "dashboard")
  }
`;
