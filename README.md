# Numalo — Guía de inicio

## Requisitos previos

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/) y Docker Compose

---

## 1. Clonar e instalar dependencias

```bash
npm install
```

---

## 2. Variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

Variables requeridas:

```env
# Base de datos
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/numalo

# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=un-secret-seguro

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-...
MERCADOPAGO_APP_NUMBER=...
MP_CLIENT_SECRET=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Seed
SEED_USER_EMAIL=
SEED_USER_PASSWORD=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 3. Levantar la base de datos

```bash
docker compose up -d
```

Esto levanta PostgreSQL en el puerto `5433`. Podés verificar que esté corriendo con:

```bash
docker ps
```

---

## 4. Migraciones de Prisma

```bash
npx prisma migrate deploy
```

Aplica todas las migraciones existentes a la base de datos.

---

## 5. Seed

```bash
npx prisma db seed
```

Crea los datos iniciales

---

## 6. Levantar el proyecto

```bash
npm run dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Resumen rápido

```bash
npm install                  # instalar dependencias
docker compose up -d         # levantar base de datos
npx prisma migrate deploy    # aplicar migraciones
npx prisma db seed           # cargar datos iniciales
npm run dev                  # iniciar servidor de desarrollo
```
