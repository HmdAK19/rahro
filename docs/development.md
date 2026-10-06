# راه‌اندازی و توسعه

## پیش‌نیازها

- Node.js سازگار با Next.js 16 و npm
- Docker و Docker Compose برای حالت کامل PostgreSQL/Redis
- مرورگر مدرن با WebSocket و WebGL برای نقشه

نسخه‌های دقیق در `package-lock.json` قفل شده‌اند. وابستگی‌ها را با `npm install` نصب کنید.

## حالت‌های ذخیره‌سازی

انتخاب repository فقط با وجود `DATABASE_URL` انجام می‌شود:

- بدون آن، کاربران، رانندگان و مرسوله‌ها در حافظه‌اند؛ دادهٔ نمونه خودکار است و با restart از بین می‌رود.
- با آن، repositoryهای PostgreSQL فعال‌اند و باید migration، seed و ساخت کاربر انجام شود.

اگر `DATABASE_URL` تنظیم باشد اما PostgreSQL در دسترس نباشد، برنامه به حافظه fallback نمی‌کند.

## اجرای حافظه‌ای

```bash
npm install
npm run dev
```

ورود پیش‌فرض `admin@rahro.local` / `Rahro123!` است و با `DEV_ADMIN_EMAIL` و `DEV_ADMIN_PASSWORD` تغییر می‌کند. این دو متغیر فقط در حالت حافظه‌ای کاربرد دارند.

## اجرای کامل محلی

```powershell
npm install
Copy-Item .env.example .env.local
docker compose up -d
npm run db:migrate
npm run db:seed
npm run db:create-admin -- admin@rahro.local "Rahro123!" "Rahro Admin"
npm run dev
```

در ترمینال دوم `npm run realtime` را اجرا کنید. `db:create-admin` ایمیل، رمز حداقل هشت‌کاراکتری و نام اختیاری می‌گیرد؛ اجرای دوباره، همان حساب را فعال و به‌روزرسانی می‌کند.

## متغیرهای محیطی

| متغیر                       | الزام           | توضیح                                                           |
| --------------------------- | --------------- | --------------------------------------------------------------- |
| `DATABASE_URL`              | برای PostgreSQL | وجود آن حالت PostgreSQL را فعال می‌کند                          |
| `DATABASE_SSL`              | خیر             | مقدار `true` اتصال SSL با اعتبارسنجی certificate را فعال می‌کند |
| `AUTH_SECRET`               | در production   | کلید امضای JWT؛ در development fallback ناامن داخلی دارد        |
| `DEV_ADMIN_EMAIL`           | خیر             | ایمیل کاربر حافظه‌ای؛ پیش‌فرض `admin@rahro.local`               |
| `DEV_ADMIN_PASSWORD`        | خیر             | رمز کاربر حافظه‌ای؛ پیش‌فرض `Rahro123!`                         |
| `NEXT_PUBLIC_MAP_STYLE_URL` | خیر             | style URL عمومی MapLibre؛ پیش‌فرض OpenFreeMap Liberty           |
| `REDIS_URL`                 | برای realtime   | آدرس Redis؛ gateway پیش‌فرض `redis://localhost:6379` دارد       |
| `REALTIME_PORT`             | خیر             | پورت gateway؛ پیش‌فرض `3001`                                    |
| `NEXT_PUBLIC_REALTIME_URL`  | خیر             | URL مرورگر؛ در نبود آن hostname فعلی و پورت ۳۰۰۱ استفاده می‌شود |

`NEXT_PUBLIC_*` در bundle مرورگر قرار می‌گیرند و نباید secret باشند. production به `AUTH_SECRET` قوی، HTTPS و `wss://` نیاز دارد.

## فرمان‌ها

| فرمان                                                  | کاربرد                                         |
| ------------------------------------------------------ | ---------------------------------------------- |
| `npm run dev`                                          | dev server با webpack و آماده‌سازی worker نقشه |
| `npm run build` / `npm start`                          | ساخت و اجرای production                        |
| `npm run realtime`                                     | Redis-to-WebSocket gateway                     |
| `npm run db:migrate`                                   | اجرای migrationهای جدید به ترتیب نام           |
| `npm run db:seed`                                      | اجرای seedهای SQL                              |
| `npm run db:create-admin -- <email> <password> [name]` | ساخت/به‌روزرسانی مدیر PostgreSQL               |
| `npm run lint` / `npm run lint:fix`                    | بررسی/اصلاح ESLint                             |
| `npm run format` / `npm run format:check`              | اعمال/بررسی قالب‌بندی                          |

## migration و seed

فایل‌های `database/migrations` به ترتیب نام اجرا و در `schema_migrations` ثبت می‌شوند. migration اعمال‌شده را ویرایش نکنید؛ فایل شماره‌دار جدید بسازید. seed فعلی سه شعبه، چهار راننده و پنج مرسوله می‌سازد، اما حساب مدیر را نمی‌سازد.

## realtime و بازیابی

mutationها روی کانال `rahro:events` publish می‌شوند؛ gateway آن‌ها را به `/realtime` می‌فرستد و client سپس state نهایی را از API می‌خواند.

- reconnect وب‌سوکت: هر ۳ ثانیه
- polling ناوگان: هر ۱۵ ثانیه
- polling رهگیری عمومی: هر ۳۰ ثانیه
- health gateway: `http://localhost:3001/health`؛ پاسخ ۲۰۰ در اتصال Redis و ۵۰۳ در قطعی

## کنترل کیفیت

```bash
npm run lint
npx tsc --noEmit
npm run format:check
npm run build
```

فعلاً test runner تعریف نشده است. تغییرات API را از نظر مجوز، payload نامعتبر و خطاها دستی نیز بررسی کنید.

## عیب‌یابی

- ورود PostgreSQL: `DEV_ADMIN_*` استفاده نمی‌شود؛ migration و سپس `db:create-admin` را اجرا کنید.
- خطای DB: با وجود `DATABASE_URL` اتصال اجباری است؛ سرویس را بررسی یا متغیر را برای حالت حافظه‌ای حذف کنید.
- قطعی realtime: Redis، `npm run realtime` و `NEXT_PUBLIC_REALTIME_URL` را بررسی کنید.
- خطای نقشه: دسترسی style/tile provider و `NEXT_PUBLIC_MAP_STYLE_URL` را بررسی کنید؛ worker در `predev` و `prebuild` کپی می‌شود.
