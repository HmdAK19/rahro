# معماری و مدل دامنه

## نمای کلی

راهرو از Next.js App Router استفاده می‌کند. routeها در `src/app`، قابلیت‌های کسب‌وکار در `src/features` و زیرساخت مشترک در `src/core` هستند.

```text
Browser
  ├─ HTTP → Route Handler → use case → repository → PostgreSQL | memory
  └─ WebSocket ← gateway ← Redis Pub/Sub ← mutations
```

رویداد realtime فقط اعلان تغییر است؛ client برای state معتبر API را دوباره می‌خواند.

## ساختار و لایه‌ها

```text
database/       migration و seed
scripts/        ابزار DB، ساخت مدیر و realtime gateway
src/app/        page، layout و Route Handler
src/core/       database، i18n، map، realtime، theme و UI مشترک
src/features/   auth، dashboard، fleet، shipments، tracking و reports
```

هر feature در صورت نیاز شامل این لایه‌هاست:

- `domain`: مدل، validation، خطا و قرارداد repository
- `application`: use case مستقل از framework
- `infrastructure`: PostgreSQL، حافظه یا HTTP gateway
- `server`: composition root و wiring
- `api`: adapter نازک Request/Response
- `ui`: component، hook و style

## جریان‌ها

- dashboard: layout، locale و session را بررسی می‌کند؛ کاربر بدون session به login می‌رود.
- mutation: Route Handler مجوز را می‌سنجد، adapter بدنه را validate، use case داده را تغییر و رویداد منتشر می‌کند.
- tracking عمومی: `GET /api/tracking/{code}` بدون session است و از راننده فقط id، نام، وسیله، وضعیت، مختصات و زمان را نشان می‌دهد.

## احراز هویت و RBAC

- password با `scrypt` hash می‌شود.
- session یک JWT از نوع HS256 با عمر ۸ ساعت است.
- cookie `rahro_session` دارای `HttpOnly`، `SameSite=Lax` و در production دارای `Secure` است.

| نقش                  | read | manage |
| -------------------- | ---- | ------ |
| `admin`              | بله  | بله    |
| `operations_manager` | بله  | بله    |
| `dispatcher`         | بله  | بله    |
| `viewer`             | بله  | خیر    |

UI هنوز actionها را براساس نقش کاملاً مخفی نمی‌کند؛ API مرجع قطعی مجوز و برای viewer روی mutation پاسخ ۴۰۳ است.

## مدل دامنه

### مرسوله

وضعیت‌ها `ready`، `assigned`، `in_transit`، `delayed` و `delivered` هستند. tracking code یکتا، price نامنفی و driver اختیاری است.

### راننده و موقعیت

وضعیت راننده `online`، `delivering` یا `offline` و منبع موقعیت `gps` یا `simulator` است. مختصات باید معتبر، accuracy نامنفی و sequenceNumber صحیح و افزایشی باشد؛ sequence قدیمی با `STALE_LOCATION` رد می‌شود. راننده با مرسولهٔ تحویل‌نشده حذف نمی‌شود.

### کاربر

نقش‌ها `admin`، `operations_manager`، `dispatcher` و `viewer` هستند. فقط کاربر فعال وارد می‌شود و رمز خام ذخیره نمی‌شود.

## پایگاه داده

- `branches`: شعب
- `drivers`: مشخصات و آخرین موقعیت
- `shipments`: مرسوله و انتساب
- `location_events`: تاریخچهٔ موقعیت با uniqueness روی driver/sequence
- `users`: حساب، hash، نقش و وضعیت
- `schema_migrations`: migrationهای اعمال‌شده

در shipment، `branch_name` کنار `branch_id` snapshot نام شعبه را حفظ می‌کند؛ API فعلی آن را به‌صورت `branch` ارائه می‌دهد.

## realtime

رویدادها `driver.location.updated`، `driver.changed` و `shipment.changed` هستند. نبود `REDIS_URL` publisher را no-op می‌کند. شکست Redis mutation اصلی را rollback نمی‌کند و polling بازیابی را انجام می‌دهد.

## i18n و مسیریابی

localeهای `fa` و `en` پشتیبانی می‌شوند و پیش‌فرض `fa` است. `src/proxy.ts` مسیر UI بدون locale را براساس `Accept-Language` redirect می‌کند؛ API و assetها مستثنا هستند. dictionaryها type-safe، سند فارسی RTL و انگلیسی LTR است.

## گزارش‌ها

گزارش از snapshot لحظه‌ای ساخته می‌شود: active برابر total منهای delivered، revenue فقط مجموع price تحویل‌شده‌ها و completion rate درصد گرد‌شدهٔ delivered است. تجمیع وضعیت، شعبه و راننده نیز برگردانده می‌شود.

## محدودیت‌های فعلی

- activity screen دادهٔ ثابت دارد و event log واقعی نیست.
- دکمهٔ تنظیمات مقصد فعال ندارد.
- تست خودکار، مدیریت کاربران و observability ساخت‌یافته وجود ندارد.
- CSRF token و rate limiting مجزا پیاده نشده است.
- gateway احراز هویت ندارد؛ eventها شناسه‌محورند و جزئیات کامل از API خوانده می‌شود.

## چک‌لیست قابلیت جدید

1. domain contract و use case مستقل از framework را تعریف کنید.
2. زیرساخت و wiring را اضافه و adapterهای API/UI را نازک نگه دارید.
3. برای schema یک migration جدید و seed سازگار بسازید.
4. مجوز، validation، realtime و fallback را بررسی کنید.
5. `README.md` و فایل‌های مرتبط `docs/` را در همان تغییر به‌روز کنید.
