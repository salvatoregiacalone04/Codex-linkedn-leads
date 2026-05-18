# SAXOPHONE

Questa cartella conserva l'immagine del sax e il codice collegato, senza interferire con il codice principale della dashboard.

## Asset

- `saxophone-aesthetic.png`

## Import Originale

```jsx
import saxophoneAesthetic from './assets/saxophone-aesthetic.png';
```

Se vuoi riattivare l'immagine nella UI principale, copia prima `saxophone-aesthetic.png` in `src/assets/`, poi ripristina import, markup e CSS.

## Markup Originale

```jsx
<figure className="saxophone-card" aria-label="Sax estetico">
  <img src={saxophoneAesthetic} alt="Sax dorato estetico con luci viola" />
</figure>
```

## CSS Originale

```css
.saxophone-card {
  position: relative;
  overflow: hidden;
  justify-self: center;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  padding: 4px;
  border: 2px solid transparent;
  border-radius: 8px;
  background:
    linear-gradient(#09070d, #09070d) padding-box,
    conic-gradient(from 0deg, rgba(196, 181, 253, 0.38), #a855f7, #ec4899, #fbbf24, #c4b5fd, rgba(196, 181, 253, 0.38)) border-box;
  background-size:
    auto,
    180% 180%;
  box-shadow: 0 0 0 1px rgba(216, 180, 254, 0.14), 0 0 30px rgba(168, 85, 247, 0.28), 0 16px 34px rgba(0, 0, 0, 0.24);
  animation: sax-gradient-border 4.8s linear infinite;
}

.saxophone-card::before,
.saxophone-card::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.saxophone-card::before {
  z-index: 1;
  width: 76%;
  height: 76%;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(216, 180, 254, 0.38), rgba(168, 85, 247, 0.18) 46%, transparent 72%);
  filter: blur(24px);
  transform: translate(-50%, -50%);
  animation: sax-purple-cloud 5.8s ease-in-out infinite;
}

.saxophone-card::after {
  z-index: 1;
  width: 54%;
  height: 54%;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(236, 72, 153, 0.18), rgba(196, 181, 253, 0.14) 46%, transparent 74%);
  filter: blur(20px);
  transform: translate(-50%, -50%);
  animation: sax-cloud-drift 4.9s ease-in-out infinite;
}

.saxophone-card img {
  position: relative;
  z-index: 2;
  display: block;
  width: auto;
  max-width: min(190px, calc(100vw - 56px));
  max-height: 250px;
  height: auto;
  object-fit: contain;
  object-position: center;
  filter: drop-shadow(0 18px 22px rgba(0, 0, 0, 0.42)) drop-shadow(0 0 20px rgba(216, 180, 254, 0.26));
}

@keyframes sax-purple-cloud {
  0%,
  100% {
    opacity: 0.58;
    transform: translate(-58%, -46%) scale(0.92) rotate(0deg);
  }

  50% {
    opacity: 0.95;
    transform: translate(-42%, -56%) scale(1.14) rotate(12deg);
  }
}

@keyframes sax-cloud-drift {
  0%,
  100% {
    opacity: 0.38;
    transform: translate(-66%, -40%) scale(0.9);
  }

  50% {
    opacity: 0.76;
    transform: translate(-34%, -64%) scale(1.18);
  }
}

@keyframes sax-gradient-border {
  to {
    background-position:
      0 0,
      180% 180%;
  }
}
```

## Reduced Motion

Se ripristini la card, aggiungi di nuovo queste classi nel blocco `@media (prefers-reduced-motion: reduce)`:

```css
.saxophone-card,
.saxophone-card::before,
.saxophone-card::after {
  animation: none;
}
```
