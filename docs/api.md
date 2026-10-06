# مرجع API

endpointها JSON هستند، جز حذف موفق که body ندارد. API محافظت‌شده cookie `rahro_session` می‌خواهد و پاسخ GET داده `Cache-Control: no-store` دارد.

## مجوزها و خطاهای مشترک

- `public`: بدون session
- `read`: تمام نقش‌ها
- `manage`: `admin`، `operations_manager` و `dispatcher`

`401 {"error":"UNAUTHENTICATED"}` برای session نامعتبر و `403 {"error":"FORBIDDEN"}` برای permission ناکافی است.

## Auth

### `POST /api/auth/login` — public

```json
{ "email": "admin@rahro.local", "password": "Rahro123!" }
```

پاسخ ۲۰۰ اطلاعات `id`، `email`، `displayName` و `role` را می‌دهد و cookie هشت‌ساعته تنظیم می‌کند. خطاها: `401 INVALID_CREDENTIALS` و `500 AUTHENTICATION_FAILED`.

### `POST /api/auth/logout` — public

cookie را منقضی و `200 {"ok":true}` برمی‌گرداند.

## Shipments

### `GET /api/shipments` — read

پاسخ ۲۰۰ آرایهٔ مرسوله‌ها است.

### `POST /api/shipments` — manage

```json
{
  "trackingCode": "RH-1405-5001",
  "customer": "فروشگاه نمونه",
  "address": "تهران، میدان ونک",
  "branch": "مرکز تهران",
  "driverId": "DRV-102",
  "status": "assigned",
  "eta": "۳۰ دقیقه",
  "price": 180000
}
```

پاسخ موفق ۲۰۱ است. `driverId` می‌تواند null، price نامنفی و status یکی از `ready | assigned | in_transit | delayed | delivered` باشد.

### `PATCH /api/shipments/{id}` — manage

حداقل یک فیلد لازم است. `id` و `trackingCode` قابل تغییر نیستند.

```json
{ "status": "in_transit", "eta": "۲۰ دقیقه" }
```

### `DELETE /api/shipments/{id}` — manage

پاسخ موفق ۲۰۴ بدون body است.

خطاها: `400 SHIPMENT_PAYLOAD_INVALID`، `404 SHIPMENT_NOT_FOUND`، `409 TRACKING_CODE_ALREADY_EXISTS` و ۵۰۰ برای خطای غیرمنتظره.

## Drivers

### `GET /api/drivers` — read

پاسخ ۲۰۰ آرایهٔ رانندگان است.

### `POST /api/drivers` — manage

```json
{
  "name": "راننده نمونه",
  "phone": "09120000000",
  "vehicle": "موتورسیکلت",
  "plate": "تهران ۱۰۰۰",
  "status": "online",
  "lat": 35.7219,
  "lng": 51.3347
}
```

پاسخ موفق ۲۰۱ است. status یکی از `online | delivering | offline`، lat بین ۹۰- و ۹۰ و lng بین ۱۸۰- و ۱۸۰ است.

### `PATCH /api/drivers/{id}` — manage

حداقل یک فیلد لازم است و `id` تغییر نمی‌کند.

### `DELETE /api/drivers/{id}` — manage

پاسخ موفق ۲۰۴ است. رانندهٔ دارای مرسولهٔ تحویل‌نشده با ۴۰۹ حذف نمی‌شود.

خطاها: `400 DRIVER_PAYLOAD_INVALID`، `404 DRIVER_NOT_FOUND`، `409 DRIVER_PHONE_ALREADY_EXISTS` و `409 DRIVER_HAS_ACTIVE_SHIPMENTS`.

## Locations

### `GET /api/locations` — read

پاسخ ۲۰۰ یک fleet snapshot با کلید `drivers` است. هر راننده `id`، `name`، `phone`، `vehicle`، `plate`، `status`، `lat`، `lng`، `accuracy`، `updatedAt` و `source` دارد.

### `POST /api/locations` — manage

```json
{
  "driverId": "DRV-101",
  "lat": 35.7241,
  "lng": 51.341,
  "accuracy": 8,
  "capturedAt": "2026-10-06T12:00:00.000Z",
  "sequenceNumber": 42,
  "source": "gps"
}
```

پاسخ موفق ۲۰۲ و رانندهٔ به‌روزشده است. تاریخ باید parse شود، accuracy نامنفی، sequenceNumber صحیح و source یکی از `gps | simulator` باشد.

خطاها: `400 LOCATION_PAYLOAD_INVALID`، `404 DRIVER_NOT_FOUND` و `409 STALE_LOCATION`.

## Reports

### `GET /api/reports` — read

پاسخ شامل `generatedAt` و این بخش‌هاست:

- `summary`: کل، فعال، تحویل‌شده، تأخیردار، درآمد و نرخ تکمیل
- `byStatus`: تعداد و درصد هر وضعیت
- `byBranch`: کل، تحویل‌شده، تأخیردار و درآمد هر شعبه
- `byDriver`: تعداد تخصیص، تحویل و فعال هر راننده

## Tracking

### `GET /api/tracking/{code}` — public

کد رهگیری باید URL-encode شود. پاسخ شامل `shipment` و، در صورت تخصیص، `driver` عمومی است. driver عمومی فقط `id`، `name`، `vehicle`، `status`، `lat`، `lng` و `updatedAt` دارد. کد ناشناخته `404 SHIPMENT_NOT_FOUND` می‌دهد.

## WebSocket و health

این مسیرها روی gateway مستقل و پورت پیش‌فرض ۳۰۰۱ هستند:

- `GET /health`: کد ۲۰۰ با `{"status":"ok"}` هنگام اتصال Redis و ۵۰۳ با `unavailable`
- `WS /realtime`: ابتدا رویداد `connection.ready` و سپس رویدادهای دامنه

نمونه:

```json
{
  "type": "driver.location.updated",
  "driverId": "DRV-101",
  "occurredAt": "2026-10-06T12:00:00.000Z"
}
```

نوع‌های دیگر `driver.changed` و `shipment.changed` هستند. client باید پس از event دادهٔ نهایی را از API بخواند.
