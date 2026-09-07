import React from 'react';

export default function Logo() {
  return (
    <a href="/" className="ffs-logo" aria-label="Fast Fill Systems - Home">
      <img src="/ffs/logo.png" alt="Fast Fill Systems" width="355" height="99" />
    </a>
  );
}

export const layout = {
  areaId: 'headerMiddleCenter',
  sortOrder: 10
};
