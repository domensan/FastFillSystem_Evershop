import React from 'react';
import { Image } from '@components/common/Image.js';
import { ProductNoThumbnail } from '@components/common/ProductNoThumbnail.js';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';
import './Media.scss';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'shadow-intensity'?: string;
        exposure?: string;
        'camera-orbit'?: string;
        'field-of-view'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'min-field-of-view'?: string;
        'max-field-of-view'?: string;
      };
    }
  }
}

interface DimensionSpec {
  mm: string;
  inches: string;
}

interface ModelConfig {
  src: string;
  // Nominal measurements from the supplied drawing, used to draw the
  // measurement overlay. Omit if a model has not been measured yet.
  dimensions?: {
    length: DimensionSpec;
    height: DimensionSpec;
    diameter: DimensionSpec;
  };
}

// SKU -> 3D model config. Add an entry here whenever a new interactive
// 3D model is produced for a product.
const MODEL_BY_SKU: Record<string, ModelConfig> = {
  N150ATp: {
    src: '/ffs/3d/n150atp.glb',
    dimensions: {
      length: { mm: '377', inches: '14.84' },
      height: { mm: '165', inches: '6.5' },
      diameter: { mm: '76', inches: '3' }
    }
  }
};

const MODEL_VIEWER_SRC =
  'https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js';

function useModelViewerScript(enabled: boolean) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }
    if (window.customElements && window.customElements.get('model-viewer')) {
      setReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-ffs-model-viewer]'
    );
    if (existing) {
      existing.addEventListener('load', () => setReady(true), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.type = 'module';
    script.src = MODEL_VIEWER_SRC;
    script.dataset.ffsModelViewer = 'true';
    script.addEventListener('load', () => setReady(true), { once: true });
    document.head.appendChild(script);
  }, [enabled]);

  return ready;
}

const CubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" />
    <path d="M3 7l9 5 9-5" />
    <path d="M12 12v10" />
  </svg>
);

const ResetIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
);

const RulerIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="10" rx="1" />
    <path d="M6 7v3M10 7v3M14 7v3M18 7v3" />
  </svg>
);

interface Model3DViewerProps {
  src: string;
  alt: string;
  dimensions?: ModelConfig['dimensions'];
}

const DEFAULT_ORBIT = '90deg 90deg 125%';
const MOBILE_ORBIT = '90deg 90deg 160%';

const Model3DViewer: React.FC<Model3DViewerProps> = ({ src, alt, dimensions }) => {
  const viewerRef = React.useRef<any>(null);
  const overlayRef = React.useRef<SVGSVGElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const mobileQueryRef = React.useRef<MediaQueryList | null>(null);

  const resetView = React.useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const mobile = mobileQueryRef.current?.matches;
    viewer.cameraOrbit = mobile ? MOBILE_ORBIT : DEFAULT_ORBIT;
    viewer.cameraTarget = 'auto auto auto';
    viewer.fieldOfView = '30deg';
    if (typeof viewer.resetTurntableRotation === 'function') {
      viewer.resetTurntableRotation();
    }
    if (typeof viewer.jumpCameraToGoal === 'function') {
      viewer.jumpCameraToGoal();
    }
  }, []);

  React.useEffect(() => {
    const viewer = viewerRef.current;
    const overlay = overlayRef.current;
    const toggle = toggleRef.current;
    if (!viewer || !overlay || !toggle || !dimensions) {
      return undefined;
    }

    mobileQueryRef.current = window.matchMedia('(max-width: 600px)');
    const dimensionGroups: Array<{
      name: string;
      slots: string[];
      group: SVGGElement;
    }> = [];

    function addDimension(
      name: string,
      spec: DimensionSpec,
      positions: number[][]
    ) {
      const slots = positions.map((position, index) => {
        const anchor = document.createElement('span');
        anchor.slot = `hotspot-${name}-${index}`;
        anchor.className = 'ffs-gallery__model-anchor';
        anchor.dataset.position = position.join(' ');
        anchor.setAttribute('aria-hidden', 'true');
        viewer.appendChild(anchor);
        return anchor.slot;
      });
      const group = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g'
      );
      group.innerHTML = `<path/><g><rect x="-27" y="-14" width="54" height="28" rx="4"/><text y="-2">${spec.mm} MM</text><text class="ffs-gallery__model-dim-inches" y="9">${spec.inches} IN</text></g>`;
      overlay!.appendChild(group);
      dimensionGroups.push({ name, slots, group });
    }

    function drawDimensions() {
      if (!viewer.loaded || overlay!.hasAttribute('hidden')) return;
      for (const { name, slots, group } of dimensionGroups) {
        const points = slots.map(
          (slot) => viewer.queryHotspot(slot)?.canvasPosition
        );
        if (points.some((point) => !point)) continue;
        const [a, b, c, d] = points;
        group.style.display =
          Math.hypot(c.x - b.x, c.y - b.y) < (name === 'length' ? 90 : 25)
            ? 'none'
            : '';
        (group.firstElementChild as SVGPathElement).setAttribute(
          'd',
          `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y} L ${d.x} ${d.y}`
        );
        const labelX = Math.max(
          44,
          Math.min(viewer.clientWidth - 44, (b.x + c.x) / 2)
        );
        let labelY = (b.y + c.y) / 2;
        // Keep the height/diameter labels clear of the object itself —
        // their guide lines sit right where the model is, unlike length's
        // line which already runs below the object.
        if (name === 'height') labelY = Math.min(b.y, c.y) - 18;
        if (name === 'diameter') labelY = Math.max(b.y, c.y) + 22;
        (group.lastElementChild as SVGGElement).setAttribute(
          'transform',
          `translate(${labelX} ${labelY})`
        );
      }
    }

    function handleToggle() {
      const show = toggle!.getAttribute('aria-pressed') !== 'true';
      toggle!.setAttribute('aria-pressed', String(show));
      overlay!.toggleAttribute('hidden', !show);
      viewer.autoRotate = !show;
      if (show) resetView();
      drawDimensions();
    }

    function handleLoad() {
      if (dimensionGroups.length) return;
      const size = viewer.getDimensions();
      const center = viewer.getBoundingBoxCenter();
      const bottom = center.y - size.y / 2;
      const top = center.y + size.y / 2;
      const front = center.z + size.z / 2;
      const back = center.z - size.z / 2;
      addDimension('length', dimensions!.length, [
        [0, bottom - 0.006, front],
        [0, bottom - 0.032, front],
        [0, bottom - 0.032, back],
        [0, bottom - 0.006, back]
      ]);
      addDimension('height', dimensions!.height, [
        [0, bottom, front + 0.077],
        [0, bottom, front + 0.102],
        [0, top, front + 0.102],
        [0, top, front + 0.077]
      ]);
      addDimension('diameter', dimensions!.diameter, [
        [0, -0.038, front + 0.006],
        [0, -0.038, front + 0.042],
        [0, 0.038, front + 0.042],
        [0, 0.038, front + 0.006]
      ]);
      toggle!.disabled = false;
      overlay!.removeAttribute('hidden');
      resetView();
      requestAnimationFrame(drawDimensions);
    }

    const handleCameraChange = () => requestAnimationFrame(drawDimensions);
    const handleResize = () => requestAnimationFrame(drawDimensions);
    const handleMobileChange = () => resetView();
    const handleArStatus = (event: any) => {
      overlay!.toggleAttribute(
        'hidden',
        event.detail.status === 'session-started' ||
          toggle!.getAttribute('aria-pressed') !== 'true'
      );
      drawDimensions();
    };

    toggle.addEventListener('click', handleToggle);
    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('camera-change', handleCameraChange);
    viewer.addEventListener('ar-status', handleArStatus);
    mobileQueryRef.current.addEventListener('change', handleMobileChange);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(viewer);

    if (viewer.loaded) handleLoad();

    return () => {
      toggle.removeEventListener('click', handleToggle);
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('camera-change', handleCameraChange);
      viewer.removeEventListener('ar-status', handleArStatus);
      mobileQueryRef.current?.removeEventListener('change', handleMobileChange);
      resizeObserver.disconnect();
      overlay.replaceChildren();
      viewer
        .querySelectorAll('.ffs-gallery__model-anchor')
        .forEach((el: Element) => el.remove());
    };
  }, [dimensions, resetView]);

  return (
    <>
      <div className="ffs-gallery__model-render">
        <model-viewer
          ref={viewerRef as any}
          src={src}
          alt={alt}
          camera-controls
          ar
          ar-modes="webxr scene-viewer quick-look"
          shadow-intensity="1"
          exposure="1"
          camera-orbit={DEFAULT_ORBIT}
          field-of-view="30deg"
          min-camera-orbit="auto auto 80%"
          max-camera-orbit="auto auto 250%"
          min-field-of-view="22deg"
          max-field-of-view="45deg"
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
        {dimensions && (
          <svg
            ref={overlayRef}
            className="ffs-gallery__model-dimensions"
            aria-hidden="true"
            {...{ hidden: true }}
          />
        )}
      </div>
      <div className="ffs-gallery__model-controls">
        {dimensions && (
          <button
            ref={toggleRef}
            type="button"
            className="ffs-gallery__reset"
            aria-pressed="true"
            disabled
          >
            <RulerIcon />
            Measurements
          </button>
        )}
        <button type="button" className="ffs-gallery__reset" onClick={resetView}>
          <ResetIcon />
          Reset view
        </button>
      </div>
    </>
  );
};

const ChevronIcon: React.FC<{ direction: 'left' | 'right' }> = ({
  direction
}) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
  </svg>
);

interface GalleryImage {
  url: string;
  alt: string;
}

interface MediaProps {
  imageSize?: { width: number; height: number };
  thumbnailSize?: { width: number; height: number };
}

export const Media: React.FC<MediaProps> = ({
  imageSize = { width: 640, height: 640 },
  thumbnailSize = { width: 84, height: 84 }
}) => {
  const product = useProduct();
  const model = MODEL_BY_SKU[product.sku];
  const modelUrl = model?.src;

  const images: GalleryImage[] = [];
  if (product.image) {
    images.push({ url: product.image.url, alt: product.image.alt || product.name });
  }
  if (product.gallery && Array.isArray(product.gallery)) {
    product.gallery.forEach((img) => {
      images.push({ url: img.url, alt: img.alt || product.name });
    });
  }

  const [mode, setMode] = React.useState<'image' | '3d'>('image');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const modelViewerReady = useModelViewerScript(mode === '3d' && !!modelUrl);

  const showImage = (index: number) => {
    setActiveIndex(index);
    setMode('image');
  };

  if (images.length === 0 && !modelUrl) {
    return (
      <div className="ffs-gallery ffs-gallery--empty">
        <ProductNoThumbnail className="w-48 h-48" />
      </div>
    );
  }

  return (
    <div className="ffs-gallery">
      <div className="ffs-gallery__thumbs">
        {images.map((image, index) => (
          <button
            key={image.url + index}
            type="button"
            className={`ffs-gallery__thumb${
              mode === 'image' && activeIndex === index
                ? ' ffs-gallery__thumb--active'
                : ''
            }`}
            onClick={() => showImage(index)}
            aria-label={`${product.name} - image ${index + 1}`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              width={thumbnailSize.width}
              height={thumbnailSize.height}
              objectFit="contain"
            />
          </button>
        ))}
        {modelUrl && (
          <button
            type="button"
            className={`ffs-gallery__thumb ffs-gallery__thumb--3d${
              mode === '3d' ? ' ffs-gallery__thumb--active' : ''
            }`}
            onClick={() => setMode('3d')}
          >
            <CubeIcon />
            <span>3D</span>
          </button>
        )}
      </div>

      <div className="ffs-gallery__stage">
        {mode === '3d' && modelUrl ? (
          <div className="ffs-gallery__model">
            {modelViewerReady ? (
              <Model3DViewer
                src={modelUrl}
                alt={`Interactive 3D model of ${product.name}`}
                dimensions={model?.dimensions}
              />
            ) : (
              <div className="ffs-gallery__model-loading">Loading 3D model…</div>
            )}
          </div>
        ) : (
          <div
            className="ffs-gallery__image"
            onClick={() => images.length > 0 && setIsLightboxOpen(true)}
          >
            {images.length > 0 ? (
              <Image
                src={images[activeIndex].url}
                alt={images[activeIndex].alt}
                width={imageSize.width}
                height={imageSize.height}
                objectFit="contain"
              />
            ) : (
              <ProductNoThumbnail className="w-48 h-48" />
            )}
          </div>
        )}

        {modelUrl && (
          <button
            type="button"
            className={`ffs-gallery__3d-pill${
              mode === '3d' ? ' ffs-gallery__3d-pill--active' : ''
            }`}
            onClick={() => setMode(mode === '3d' ? 'image' : '3d')}
          >
            <CubeIcon />
            {mode === '3d' ? 'View photos' : 'View 3D'}
          </button>
        )}

        {mode === 'image' && images.length > 1 && (
          <div className="ffs-gallery__dots">
            {images.map((image, index) => (
              <button
                key={image.url + index}
                type="button"
                aria-label={`Go to image ${index + 1}`}
                className={`ffs-gallery__dot${
                  activeIndex === index ? ' ffs-gallery__dot--active' : ''
                }`}
                onClick={() => showImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      {isLightboxOpen && images.length > 0 && (
        <div className="ffs-gallery__lightbox">
          <div
            className="ffs-gallery__lightbox-overlay"
            onClick={() => setIsLightboxOpen(false)}
          />
          <div className="ffs-gallery__lightbox-content">
            <button
              type="button"
              className="ffs-gallery__lightbox-close"
              aria-label="Close fullscreen view"
              onClick={() => setIsLightboxOpen(false)}
            >
              ×
            </button>
            {images.length > 1 && (
              <button
                type="button"
                className="ffs-gallery__lightbox-arrow ffs-gallery__lightbox-arrow--prev"
                aria-label="Previous image"
                onClick={() =>
                  setActiveIndex((activeIndex - 1 + images.length) % images.length)
                }
              >
                <ChevronIcon direction="left" />
              </button>
            )}
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alt}
              width={1200}
              height={1200}
              objectFit="contain"
            />
            {images.length > 1 && (
              <button
                type="button"
                className="ffs-gallery__lightbox-arrow ffs-gallery__lightbox-arrow--next"
                aria-label="Next image"
                onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
              >
                <ChevronIcon direction="right" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
