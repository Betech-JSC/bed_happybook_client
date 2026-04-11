bed_happybook_api (Laravel API)
├── app/Http/Controllers/Api/V1/ProductFastTrackController.php
├── app/Http/Controllers/Api/V1/BookingProductController.php → bookingProductFastTrack()
├── app/Repositories/ProductFastTrack/ProductFastTrackRepository.php
└── app/Models/
    ├── ProductFastTrack.php
    ├── ProductFastTrackOption.php
    ├── ProductFastTrackPrice.php (bảng: product_fast_track_prices)
    ├── ProductFastTrackType.php
    ├── ProductFastTrackAdditionalFee.php
    ├── ProductFastTrackRequestGuest.php
    └── BookingProductFastTrack.php

bed_happybook_cms (Laravel CMS)
├── Modules/Admin/Http/Controllers/
│   ├── ProductFastTrackController.php (CRUD sản phẩm)
│   ├── ProductFastTrackOptionController.php
│   ├── ProductFastTrackOptionPriceController.php
│   ├── ProductFastTrackTypeController.php
│   └── ProductFastTrackAdditionalFeeController.php
└── Modules/Admin/Models/
    ├── ProductFastTrack.php, ProductFastTrackOption.php, ...
    └── ProductFastTrackRequest.php, ProductFastTrackRequestAdditionalFee.php

bed_happybook_client (Next.js)
├── src/api/ProductFastTrack.ts → search, detail, detailBySlug, getOptionsFilter, getAdditionalFees
├── src/app/fast-track/
│   ├── page.tsx (listing)
│   ├── [slug]/page.tsx (detail hoặc category)
│   ├── checkout/[slug]/page.tsx (checkout form)
│   ├── thong-tin-dat-cho/page.tsx (booking info)
│   └── components/
│       ├── FastTrackDetail.tsx
│       ├── FastTrackDetailInfor.tsx (date picker, gói dịch vụ, phụ phí)
│       ├── FormCheckOut.tsx (form đặt chỗ đầy đủ)
│       ├── FastTrackCategory.tsx
│       └── Search.tsx
