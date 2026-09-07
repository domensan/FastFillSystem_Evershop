import React from 'react';

export default function FfsLoginBrand() {
  return (
    <>
      <style>{`.admin-login-form>.flex.items-center.justify-center.mb-7{display:none!important}`}</style>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <img src="/ffs/logo.png" alt="Fast Fill Systems" style={{ width: 260, height: 'auto' }} />
      </div>
    </>
  );
}

export const layout = { areaId: 'content', sortOrder: 5 };
