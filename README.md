# راهرو | Rahro

راهرو یک سامانهٔ دوزبانه برای مدیریت عملیات ارسال، ناوگان و رهگیری مرسوله است. پروژه با Next.js 16 (App Router)، React 19، TypeScript، Material UI، PostgreSQL، Redis، WebSocket و MapLibre ساخته شده و کد آن به‌صورت feature-based و با مرزبندی‌های Clean Architecture سازمان‌دهی شده است.

> وضعیت پروژه: نسخهٔ فعلی یک MVP عملیاتی است. مدیریت مرسوله و راننده، احراز هویت و RBAC، گزارش‌ها، رهگیری عمومی و به‌روزرسانی لحظه‌ای پیاده‌سازی شده‌اند؛ صفحهٔ تنظیمات و activity feed واقعی هنوز پیاده‌سازی نشده‌اند.

## راهنمای مستندات

- [راه‌اندازی و توسعه](docs/development.md): پیش‌نیازها، اجرای حافظه‌ای و کامل، متغیرهای محیطی، اسکریپت‌ها و عیب‌یابی
- [معماری و مدل دامنه](docs/architecture.md): لایه‌ها، جریان داده، پایگاه داده، realtime، امنیت و بین‌المللی‌سازی
- [مرجع API](docs/api.md): endpointها، مجوزها، payloadها، پاسخ‌ها و کدهای خطا

## قابلیت‌های فعلی

- داشبورد عملیاتی با نقشهٔ زندهٔ ناوگان، شاخص‌ها و فهرست مرسوله‌ها
- ثبت، ویرایش و حذف مرسوله و راننده با اعتبارسنجی سمت سرور
- جلوگیری از حذف راننده‌ای که مرسولهٔ فعال دارد
- دریافت موقعیت راننده از GPS یا شبیه‌ساز داخلی و رد کردن sequenceهای قدیمی
- رهگیری عمومی مرسوله با کد رهگیری و نمایش موقعیت راننده
- گزارش وضعیت، شعب، رانندگان، درآمد محقق‌شده و خروجی CSV در رابط کاربری
- session امضاشدهٔ هشت‌ساعته در cookie امن و نقش‌های `admin`، `operations_manager`، `dispatcher` و `viewer`
- انتشار رویداد از Redis Pub/Sub به WebSocket، reconnect خودکار و polling بازیابی
- رابط فارسی RTL و انگلیسی LTR، واکنش‌گرا و مبتنی بر theme مرکزی MUI
- PostgreSQL با migration و seed، همراه با repository حافظه‌ای برای اجرای سریع محلی

## شروع سریع بدون Docker

این حالت از داده‌ها و کاربر حافظه‌ای استفاده می‌کند؛ تغییرات با restart فرایند از بین می‌روند.

```bash
npm install
npm run dev
```

سپس `http://localhost:3000` را باز کنید. برنامه براساس زبان مرورگر به `/fa` یا `/en` هدایت می‌شود.

- ایمیل پیش‌فرض: `admin@rahro.local`
- رمز پیش‌فرض: `Rahro123!`
- نمونهٔ رهگیری عمومی: `http://localhost:3000/fa/track/RH-1405-4021`

در این حالت Redis و gateway اجرا نیستند؛ رابط همچنان با polling تازه می‌شود و نشانگر realtime ممکن است در وضعیت اتصال مجدد بماند.

## اجرای کامل توسعه

```bash
npm install
Copy-Item .env.example .env.local
docker compose up -d
npm run db:migrate
npm run db:seed
npm run db:create-admin -- admin@rahro.local "Rahro123!" "Rahro Admin"
npm run dev
```

gateway لحظه‌ای را در ترمینال دیگری اجرا کنید:

```bash
npm run realtime
```

آدرس‌های پیش‌فرض:

- برنامه: `http://localhost:3000`
- WebSocket: `ws://localhost:3001/realtime`
- سلامت gateway: `http://localhost:3001/health`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## مسیرهای رابط کاربری

تمام مسیرهای UI با locale شروع می‌شوند (`fa` یا `en`).

| مسیر                     | دسترسی       | کاربرد                         |
| ------------------------ | ------------ | ------------------------------ |
| `/{locale}/login`        | عمومی        | ورود                           |
| `/{locale}`              | نیازمند ورود | نمای کلی عملیات و نقشهٔ ناوگان |
| `/{locale}/shipments`    | نیازمند ورود | مدیریت مرسوله‌ها               |
| `/{locale}/drivers`      | نیازمند ورود | مدیریت رانندگان                |
| `/{locale}/reports`      | نیازمند ورود | گزارش‌های عملیاتی              |
| `/{locale}/activity`     | نیازمند ورود | نمایش activity نمونهٔ فعلی     |
| `/{locale}/track/{code}` | عمومی        | رهگیری یک مرسوله               |

## کنترل کیفیت

```bash
npm run lint
npx tsc --noEmit
npm run format:check
npm run build
```

در حال حاضر test runner و مجموعه تست خودکار در پروژه تعریف نشده است؛ بنابراین lint، type-check و build حداقل دروازه‌های صحت تغییرات هستند.

## قرارداد نگهداری مستندات

مستندات بخشی از تعریف انجام‌شدن هر تغییر است. هر افزودن، حذف یا تغییر قابلیت باید در همان تغییر، بخش‌های مرتبط `README.md` و فایل‌های `docs/` را نیز به‌روزرسانی کند. این الزام در `AGENTS.md` نیز ثبت شده تا در کارهای بعدی پروژه رعایت شود.
