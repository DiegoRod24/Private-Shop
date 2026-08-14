# VELORA — Private Shop

PWA móvil-first creada como prototipo funcional de una tienda privada con:

- Catálogo responsive y tarjetas con sensación 3D.
- Filtros, búsqueda y favoritos.
- Bolsa persistente en `localStorage`.
- Reserva para **recojo y pago en tienda**.
- Código de recojo + QR.
- Link compartible que reconstruye la bolsa en otro dispositivo.
- Asistente virtual "Vela".
- Entrada por voz cuando el navegador soporta Web Speech API.
- Instalación como PWA en navegadores compatibles.
- Diseño adaptado a celular, tablet y desktop.

## Ejecutar en local

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

La salida queda en:

```text
dist/
```

## GitHub

```bash
git init
git add .
git commit -m "VELORA v1"
git branch -M main
git remote add origin TU_URL_DE_GITHUB
git push -u origin main
```

## Cloudflare Pages

Conecta el repositorio y usa:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`

## Nota importante sobre esta V1

La bolsa compartida viaja dentro del propio link. Esto permite probar el flujo completo sin backend.

Para una versión de tienda real, el siguiente salto recomendado es:
1. Inventario real.
2. Reservas persistentes.
3. Estado del pedido: reservado / recogido / cancelado.
4. Panel de tienda para escanear el QR.
5. Caducidad de reservas.
6. Control de stock.
7. Supabase o Cloudflare D1.
