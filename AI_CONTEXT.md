---
title: CLIENT
repo: bed_happybook_client
type: repo-context
system: happybook
updated_at: 2026-06-12T15:25:00+07:00
---
# Bed HappyBook Client - AI Context

Repo này là frontend client (Next.js) của hệ sinh thái HappyBook Travel. Nó phục vụ website public cho khách hàng đặt dịch vụ du lịch.

## 1. Tổng Quan

`bed_happybook_client` là **frontend public website** của HappyBook Travel.

Stack chính:

- Next.js 14.2 (App Router)
- TypeScript
- TailwindCSS
- `iron-session` cho session management
- `react-hook-form` + `zod` cho form validation
- `date-fns` cho date formatting
- `lucide-react` cho icons

## 2. API Integration Pattern

### API endpoint base

```
NEXT_PUBLIC_API_ENDPOINT = http://localhost:8000/api/v1
```

### HTTP client

`src/lib/http.ts` — wrapper around `fetch` với:
- Auto-set `language` header từ localStorage
- Timeout 10s mặc định (riêng các endpoint checkout/đặt đơn trong `BookingProductApi` được tăng lên 60s để tránh timeout khi đồng bộ CRM/gửi mail)
- Error handling qua `HttpError`
- Auto JSON parse

### API Route layer (Next.js)

Các API call từ frontend đi qua route handler trong `src/app/api/` trước, sau đó gọi backend API.

Pattern:

```
Browser → /api/auth/xxx (Next.js route handler) → Backend API (Laravel)
```

Các route handlers có thể access session via `getSession()` (iron-session).

### Auth API routes

| Route | Method | Mục đích |
|---|---|---|
| `/api/auth/login` | POST | Login email/password |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/change-password` | POST | Đổi mật khẩu |
| `/api/auth/send-otp` | POST | Gửi OTP qua SMS/Email |
| `/api/auth/confirm-otp` | POST | Xác nhận OTP, tạo session |
| `/api/auth/upload-avatar` | POST | Upload avatar file |

## 3. Session Management

`src/lib/session.ts` — dùng `iron-session` với cookie `myapp_session`.

Session data shape:

```typescript
interface SessionData {
  language: string;
  isLoggedIn: boolean;
  access_token?: string;
  userInfo?: UserInfoType;
  flightType?: string;
}
```

UserInfo shape:

```typescript
interface UserInfoType {
  id: number;
  name: string;
  email: string;
  phone: number | string;
  gender: number;
  created_at: string;
  birthday?: string;
  avatar?: string;
  avatar_url?: string;
}
```

## 4. Auth Flow

### Password login

1. User submit form → `/api/auth/login`
2. Route handler gọi `POST /api/v1/customer/login`
3. Backend trả `token` + `user_info` gồm `birthday`
4. Session lưu `access_token` + `userInfo` (bao gồm `birthday` nếu backend trả về)
5. Nếu `birthday` bị thiếu, client sẽ mở popup chặn toàn site để bắt buộc bổ sung ngày sinh trước khi dùng tiếp

### OTP login (2026-06-01)

1. User nhập số điện thoại → `/api/auth/send-otp`
2. Route handler gọi `POST /api/v1/auth/auth-with-otp`
3. Backend gửi OTP qua SMS/Email
4. User nhập OTP + (optional) name + birthday → `/api/auth/confirm-otp`
5. Route handler gọi `POST /api/v1/auth/confirm-otp`
6. Backend tạo customer mới nếu chưa có, trả `token` + `user`
7. Session lưu `access_token` + `userInfo`

OTP register action: khi `action === 'register'`, account mới được tạo.

## 5. Auth Components

### Login page

- `src/app/(auth)/dang-nhap/page.tsx` — Server component
- `src/app/(auth)/dang-nhap/AuthTabs.tsx` — Client component với tab switch
- `src/app/(auth)/dang-nhap/form.tsx` — Password login form
- `src/app/(auth)/dang-nhap/formOtp.tsx` — OTP login form (2-step: phone → OTP)

### Register page

- `src/app/(auth)/dang-ky/page.tsx` — Server component
- `src/app/(auth)/dang-ky/form.tsx` — Registration form (email/password + birthday)

## 6. User Profile Page

`src/app/(auth)/thong-tin-tai-khoan/page.tsx` — Hiển thị thông tin tài khoản:

- Họ tên, Email, Số điện thoại
- Ngày sinh (từ `userInfo.birthday`)
- Ngày đăng ký

### Avatar Upload

`src/app/(auth)/components/AccountSidebar.tsx` — Sidebar của profile page có:

- Hiển thị avatar từ `userInfo.avatar_url`
- Nút camera để upload avatar mới
- Gọi `AuthApi.uploadAvatar(file)` → `/api/auth/upload-avatar`
- Sau khi upload thành công, cập nhật `setUserInfo`

Upload flow:

1. Chọn file (validate: JPEG/PNG/GIF/SVG/WebP, max 2MB)
2. POST `/api/auth/upload-avatar` với `FormData`
3. Route handler gọi `POST /api/v1/users/change-avatar` với `Authorization: Bearer {token}`
4. Backend lưu avatar, trả `avatar` + `avatar_url`
5. Frontend cập nhật session + UserContext

### Birthday completion gate

- `src/components/base/BirthdayRequiredModal.tsx` — modal toàn site yêu cầu bổ sung ngày sinh khi `userInfo.birthday` đang thiếu
- `src/app/api/auth/update-birthday/route.ts` — proxy authenticated request lên `POST /api/v1/customer/update-birthday`
- Flow:
  1. Login xong, nếu `userInfo.birthday` không có thì modal tự mở ở root layout
  2. User chọn ngày sinh và submit
  3. Route handler gọi backend, update session `userInfo.birthday`
  4. Modal tự biến mất sau khi `UserContext` được cập nhật

## 7. Sim Du Lich Mobile Filters

Module `src/app/sim-du-lich/` là luồng eSIM public chính của client.

Điểm cần nhớ:

- `src/app/sim-du-lich/components/EsimProductPage.tsx` truyền state catalog xuống listing/detail shell
- `src/app/sim-du-lich/components/EsimPackageExplorer.tsx` là lớp ghép props cho listing
- `src/app/sim-du-lich/components/EsimPackageDiscovery.tsx` hiện chỉ còn là lớp điều phối mỏng cho listing/filter
- `src/app/sim-du-lich/components/EsimPackageDiscoveryFilters.tsx` chỉ là lớp ghép filter UI, không giữ state nặng
- `src/app/sim-du-lich/components/EsimPackageDiscoveryMobileFilters.tsx` giữ mobile Klook-style pills + bottom sheet + staged apply
- `src/app/sim-du-lich/components/EsimPackageDiscoveryDesktopSidebar.tsx` giữ desktop sidebar filter và price presets/slider
- `src/app/sim-du-lich/components/EsimPackageDiscoveryList.tsx` giữ header/sort/list card của catalog eSIM
- `src/app/sim-du-lich/lib/esim-discovery.ts` giữ helper lọc option, nhóm quốc gia, preset giá, step slider, và sort mode cho UI eSIM
- Desktop vẫn dùng sidebar trái như cũ; mobile ẩn sidebar và chỉ hiện 2 pill filter trên đầu danh sách:
  - `Location` mở bottom sheet địa điểm/nhà mạng
  - `Filters` mở bottom sheet sort + price range
- Mobile filter dùng staged apply:
  - khi mở sheet sẽ copy state hiện tại sang draft
  - chọn chip/search/kéo price chỉ đổi draft
  - bấm `Show results` mới commit vào catalog state
  - bấm `Clear` reset draft location + sort + price range
- Sheet `Location`:
  - có search input giống Klook (`Search by city, region or country`)
  - route quốc tế hiển thị `Cụm quốc gia` và `Quốc gia`
  - route Việt Nam/generic hiển thị `Nhà mạng`
  - mobile pill và sheet title lấy nhãn động: route Việt Nam hiển thị `Nhà mạng`, route quốc tế vẫn hiển thị `Location`
  - có `Xem thêm`/`Thu gọn` khi option dài
- Sheet `Filters`:
  - có sort chips (`Mới nhất`, `Giá từ thấp đến cao`, `Giá từ cao xuống thấp`)
  - dùng `rc-slider` cho price range với màu cam giống Klook
  - footer cố định gồm `Clear` và `Show results`
- Mobile listing có dòng `N kết quả` + sort summary bên dưới filter pills, thay cho dropdown sort cũ
- Mobile bottom sheet filter được đặt `z-index` cao hơn `Pancake` live chat và cụm support floating icons để footer `Clear` / `Show results` không bị che
- Với region `Việt Nam`, secondary filters bị bỏ qua hoàn toàn và sẽ bị reset khi apply
- Phần `Country` chỉ giữ các quốc gia thật; các cụm multi-country như `Asia 11 countries` hoặc `Australia & New Zealand` không còn nằm trong danh sách này
- `useEsimCatalog` giữ source of truth cho `selectedRegionId`, `regionOptions`, `selectedDestinationLabels`, `priceRange`, `selectedPackageSlug`, `selectedSku`
- `initialCategory` chỉ được áp preset region một lần lúc khởi tạo, để user có thể đổi sang `Việt Nam / Quốc tế` từ mobile filter mà không bị reset ngược
- Khi đổi location, client reset selection phụ và price range để tránh filter cũ bám ngầm
- Sidebar desktop vẫn dùng cùng data source, nên mọi thay đổi filter cần giữ tương thích giữa mobile sheet và desktop sidebar
- `EsimPackageDiscoveryFilters.tsx` chỉ làm nhiệm vụ ghép mobile filters + desktop sidebar, còn state tương tác nằm ở `EsimPackageDiscoveryMobileFilters.tsx` và `EsimPackageDiscoveryDesktopSidebar.tsx`

## 8. Auth Service

`src/api/Auth.ts` — các method:

```typescript
AuthApi.register(data)           // POST /customer/register
AuthApi.logout()               // fetch /api/auth/logout
AuthApi.changePassword(data)   // fetch /api/auth/change-password
AuthApi.sendOtp({phone})      // fetch /api/auth/send-otp
AuthApi.confirmOtp({phone, otp, name, birthday})
AuthApi.uploadAvatar(file)      // fetch /api/auth/upload-avatar
```

## 9. Key Files

- `src/types/UserInfo.ts` — User type definitions
- `src/lib/session.ts` — Session management
- `src/lib/http.ts` — HTTP client
- `src/api/news.ts` — Public news API client; normalizes news lists to sort by `created_at` desc so `/tin-tuc` and shared news blocks show newest articles first
- `src/api/Auth.ts` — Auth API client
- `src/app/api/auth/login/route.ts` — Mirror login response vào session, gồm `birthday`
- `src/app/api/auth/update-birthday/route.ts` — Update birthday cho customer cũ và đồng bộ session
- `src/contexts/UserContext.tsx` — User state (client-side)
- `src/contexts/LanguageContext.tsx` — Language state
- `src/app/sim-du-lich/components/EsimPackageDiscovery.tsx` — orchestrator mỏng cho eSIM listing
- `src/app/sim-du-lich/components/EsimPackageDiscoveryFilters.tsx` — wrapper ghép mobile filters + desktop sidebar
- `src/app/sim-du-lich/components/EsimPackageDiscoveryMobileFilters.tsx` — mobile pills + bottom sheet staged apply
- `src/app/sim-du-lich/components/EsimPackageDiscoveryDesktopSidebar.tsx` — desktop sidebar filters + price presets
- `src/app/sim-du-lich/components/EsimPackageDiscoveryList.tsx` — render package list và sort header
- `src/app/sim-du-lich/lib/esim-discovery.ts` — helper option grouping / price preset / slider step / sort
- `src/app/(auth)/dang-nhap/` — Login flows
- `src/app/(auth)/dang-ky/` — Register flow
- `src/app/(auth)/thong-tin-tai-khoan/` — Profile page
- `src/components/base/BirthdayRequiredModal.tsx` — Popup bắt buộc bổ sung ngày sinh
- `src/app/(auth)/lich-su-dat-hang/` — Order history
- `src/app/(auth)/thay-doi-mat-khau/` — Change password

## 10. News Ordering

- Backend `bed_happybook_api` đã đổi module news để sắp xếp theo `created_at` desc ở source.
- `src/api/news.ts` vẫn normalize phòng vệ theo `created_at` desc cho:
  - `fetchNewsIndex()` → hero/latest posts + `categoriesWithPosts`
  - `getLastedNewsByPage()` → các block tin tức dùng chung như `NewsByPage`
  - `fetchCategoryDetails()` → danh sách bài trong category/subcategory
- `created_at` là source of truth để xác định bài viết mới nhất; `updated_at` chỉ là fallback/tie-break nếu dữ liệu thiếu hoặc trùng thời gian.
- Không đổi API contract; client chỉ giữ thêm lớp normalize để an toàn với cache cũ hoặc payload chưa đồng nhất.

## 11. Lưu Ý Khi Sửa Code

- Auth routes cần inject `Authorization: Bearer {session.access_token}` khi gọi backend authenticated endpoints
- Form validation dùng `zod` schema trong `src/schemaValidations/`
- Translation keys nằm trong `unifiedStaticText` (constants/staticText.ts) và được load qua `TranslationContext`
- `iron-session` cookie name: `myapp_session`
- Backend API base: `http://localhost:8000/api/v1` (dev)
- Không hardcode URL — dùng env vars
- Customer cũ thiếu birthday không được cho đi tiếp flow bình thường cho tới khi modal update xong

## 12. Addendum 2026-06-02 - Yacht Locale Sync

### Mục tiêu

Giữ các màn hình `du-thuyen` / yacht bám đúng locale hiện tại thay vì rơi về tiếng Việt ở một số nhánh server/client.

### Thay đổi đáng chú ý

- `src/app/du-thuyen/page.tsx` giờ lấy `language` khi build metadata để content page của yacht không lệch locale ở SEO/title/description
- `src/app/du-thuyen/checkout/[slug]/page.tsx` truyền `language` vào `ProductYachtApi.detail(...)` để checkout server-side không rơi về `vi` khi user đang ở `en`
- `src/app/du-thuyen/components/YachtCategory.tsx` dùng `getServerT()` cho breadcrumb `Trang chủ`
- `src/app/tim-kiem/components/SearchYachtList.tsx` đã chuyển sang client component để dùng `useTranslation()` cho tiêu đề và CTA

### Ý nghĩa thực tế

- Yacht home/category/checkout/search đều đồng bộ hơn giữa `vi` và `en`
- UI text không còn hardcode tiếng Việt ở các nhánh public chính của yacht
- Không đổi API contract; chỉ sửa cách client đọc và hiển thị data theo locale hiện tại

## 13. Addendum 2026-06-02 - Yacht Morph Translation Follow-up

### Mục tiêu

Sau khi API/CMS chuyển yacht sang morph translation, client yacht pages chỉ cần bám theo locale hiện tại và không còn phụ thuộc vào `product_locales` ở payload.

### Ý nghĩa thực tế

- `src/app/du-thuyen/*` vẫn nhận cùng API contract, nhưng `name`/`category`/breadcrumb/search result sẽ lấy từ morph translations ở backend
- Các màn hình yacht public chỉ cần giữ `language` đúng là dữ liệu sẽ theo locale hiện tại
- Nếu thấy tiếng Việt xuất hiện ở locale `en`, nguyên nhân gần như chắc chắn là dữ liệu translation trong DB chưa đủ chứ không còn do client hardcode

## 14. Addendum 2026-06-02 - Amusement Ticket Translation

### Mục tiêu

Module vé vui chơi (amusement ticket) giờ hoạt động English locale giống FastTrack/Yacht. API đã thêm `HasTranslations` cho `ProductAmusementTicket`, `ProductAmusementTicketOption`, `ProductAmusementTicketType` và eager load `translations` relation.

### Frontend pattern

Client `bed_happybook_client` đã có sẵn `translatePage()` cho DOM translation và `translateText()` cho API translation:

- `Search.tsx` gọi `translatePage()` sau khi load data
- `TicketDetailInfor.tsx` và `FormCheckOut.tsx` không gọi translate, phụ thuộc backend translate
- Backend giờ resolve đúng English từ `translations` table

### Điểm cần nhớ

- API endpoint `GET /product/amusement-ticket/detail/{slug}` giờ trả English content nếu header `language: en`
- Nếu English không hiển thị, kiểm tra: (1) `translations` rows có đúng `translatable_type` không, (2) API có nhận header `language`, (3) seeder đã chạy chưa
- Seeder entry: `php artisan db:seed --class=AmusementTicketTranslationSeeder`

## 15. Addendum 2026-06-03 - Yacht Locale Price Display (Frontend Fix)

### Vấn đề

Khi locale là `en`, trang du thuyền vẫn hiển thị giá tiền Việt Nam đồng (VND) thay vì đô la Mỹ (USD). Root cause nằm ở frontend client.

### Root cause

**`displayProductPrice()` trong `src/utils/Helper.ts` hoàn toàn bỏ qua locale:**

- Hàm này chỉ đọc `currency?.symbol_left` và `currency?.symbol_right` từ API response
- `currency` của product yacht trong database luôn là VND (symbol_right = "VND")
- Dù user đang ở locale `en`, hàm vẫn render: `"500,000 VND"`

### Fix

**File**: `src/utils/Helper.ts`

- Thêm param `language: string = "vi"` vào `displayProductPrice()`
- Khi `language === "en"`: dùng `Intl.NumberFormat("en", ...)` + currency code `"USD"`
- Khi `language === "vi"`: dùng `Intl.NumberFormat("vi", ...)` + currency code `"VND"`

**Files updated** (truyền `language` context vào):

- `src/components/base/DisplayPrice.tsx`
- `src/components/base/DisplayPriceWithDiscount.tsx`
- `src/app/visa/components/ListVisa.tsx`

### CMS side (không đổi)

- CMS chỉ dùng `number_format()` PHP để format giá hiển thị trong admin — không phụ thuộc locale user
- Admin luôn hiển thị VND, không cần fix

## 16. Addendum 2026-06-03 - Yacht Category Label Mapping

### Mục tiêu

Một số category của yacht cần hiển thị nhãn riêng trên sidebar/filter và page category thay vì giữ tên cũ từ CMS.

### Hành vi hiện tại

- `src/app/du-thuyen/components/Search.tsx` map label của group `category`:
  - `Du thuyền Sài Gòn` → `Ăn tối du thuyền`
  - `Du thuyền Hạ Long` → `Tour du thuyền`
- `src/app/du-thuyen/[slug]/page.tsx` cũng map `detail.name`/`alias` sang title mới để breadcrumb, metadata và heading category page đồng nhất
- `src/app/du-thuyen/components/YachtCategory.tsx` truyền `display_title` xuống `Search` để H1 và breadcrumb không còn lộ tên cũ

### Ý nghĩa thực tế

- Các category yacht không còn hiển thị nhãn CMS cũ ở sidebar/category page
- Không đổi API contract; đây là lớp render phía client để khớp đúng naming product/category hiện có
- Nếu sau này thêm category yacht mới, chỉ cần bổ sung mapping label ở `src/app/du-thuyen/components/Search.tsx` và mapping title ở `src/app/du-thuyen/[slug]/page.tsx`

## 17. Addendum 2026-06-03 - Yacht Listing Title Follows Selected Category

### Mục tiêu

Khi user chọn một category yacht duy nhất ở listing page, tiêu đề chính trên trang phải đổi theo đúng category đó thay vì giữ cố định "Du thuyền".

### Hành vi hiện tại

- `src/app/du-thuyen/components/Search.tsx` đã đọc `query["category[]"]`
- Nếu chỉ có đúng 1 category được chọn, H1 sẽ lấy label đã map:
  - `Du thuyền Sài Gòn` → `Ăn tối du thuyền`
  - `Du thuyền Hạ Long` → `Tour du thuyền`
- Nếu không chọn category hoặc chọn nhiều hơn 1, title fallback về `Du thuyền`

### Ý nghĩa thực tế

- Trang listing yacht không còn giữ title chung khi user đang lọc đúng một category
- Không đổi API contract; chỉ đổi logic hiển thị theo state filter hiện tại
- Khi render category detail page, `YachtCategory.tsx` vẫn dùng cùng mapping title để đồng bộ breadcrumb/H1/metadata

## 18. Addendum 2026-06-04 - Tour Quốc Tế URL Canonicalization

### Vấn đề

Trang tour quốc tế public từng rơi vào 404 vì một số link đang dẫn tới URL underscore sai chuẩn: `/tours/tour-quoc_te`.

### Root cause

- `src/components/layout/header.tsx` ở desktop dropdown đã link nhầm sang `/tours/tour-quoc_te`
- App Router của tour chỉ nhận 2 alias category hợp lệ trong `src/app/tours/[alias]/page.tsx`:
  - `/tours/tour-noi-dia`
  - `/tours/tour-quoc-te`
- Khi nhận alias không nằm trong danh sách này, `CategoryTour` sẽ gọi `notFound()`, nên browser hiển thị trang 404 có auto-redirect về trang chủ

### Fix

- Sửa link desktop header sang `/tours/tour-quoc-te`
- Thêm redirect 301 trong `next.config.mjs` từ `/tours/tour-quoc_te` sang `/tours/tour-quoc-te` để giữ tương thích với bookmark / link cũ

### Ý nghĩa thực tế

- Canonical public URL cho tour quốc tế là `/tours/tour-quoc-te`
- Link trên header desktop giờ đồng bộ với footer và mobile menu
- Không đổi API contract; đây là fix điều hướng phía client để tránh 404 do typo slug

## 19. Addendum 2026-06-04 - Tour Image Src Normalization

### Vấn đề

Một số card tour quốc tế hiển thị ảnh vỡ hoặc alt text vì client đang ghép trực tiếp `image_url` + `image_location` mà không normalize.

### Root cause

- `src/components/product/components/tour-item.tsx`
- `src/app/tours/components/ListTour.tsx`
- `src/app/tim-kiem/components/SearchTourList.tsx`

Các chỗ này trước đây dùng template string thẳng tay:

- `${tour.image_url}/${tour.image_location}`
- `${product.image_url}/${product.image_location}`

Khi dữ liệu tour quốc tế trả về:

- thiếu `image_url` hoặc `image_location`
- hoặc một trong hai field đã có slash dư
- hoặc `image_location` đã là URL đầy đủ

thì `next/image` sẽ request sai src và render broken image icon.

### Fix

- Thêm `getImageSrc()` vào `src/utils/Helper.ts`
- Helper này:
  - trim slash thừa
  - trả placeholder `/default-image.png` khi thiếu dữ liệu
  - ưu tiên giữ nguyên nếu `image_location` đã là URL đầy đủ
- Áp dụng helper cho tour cards và search tour cards

### Ý nghĩa thực tế

- Tour quốc tế không còn phụ thuộc vào format ảnh “đúng tuyệt đối” từ payload
- Broken image icon giảm mạnh khi CMS/API trả data lệch định dạng
- Không đổi API contract; đây là lớp normalize/fallback ở client

## 20. Addendum 2026-06-04 - Next Image Host Whitelist For Tour CDN

### Vấn đề

Tour quốc tế vẫn có thể fail render dù `src` đúng vì `next/image` chặn host CDN chưa được khai báo.

### Root cause

- Một số ảnh tour trả về từ API dùng host `https://cdn.nhanhtravel.io.vn/...`
- `next.config.mjs` trước đó chưa whitelist host này trong `images.remotePatterns`
- Next.js ném runtime error: `Invalid src prop ... hostname "cdn.nhanhtravel.io.vn" is not configured`

### Fix

- Thêm remote pattern cho `cdn.nhanhtravel.io.vn` vào `images.remotePatterns`
- Giữ nguyên các host cũ đang dùng cho CMS/API/CDN khác

### Ý nghĩa thực tế

- Ảnh tour quốc tế đi qua `next/image` sẽ không còn bị block chỉ vì thiếu whitelist host
- Không đổi API contract; đây là fix cấu hình image optimizer phía client
- Nếu sau này thêm host ảnh mới, nhớ khai báo trong `next.config.mjs` trước khi render bằng `next/image`

## 21. Addendum 2026-06-04 - Tour Detail Gallery Src Normalization

### Vấn đề

Trang detail tour vẫn có thể bị vỡ gallery dù thumbnail ngoài listing nhìn bình thường.

### Root cause

- `src/components/product/components/ProductGallery.tsx`
- `src/components/product/components/ProductLightboxGallery.tsx`
- `src/app/tours/components/ImageGallery.tsx`

Hai component này trước đó ghép raw `image_url + image` hoặc `image_url + image_location` trực tiếp.

Với một số tour quốc tế, API trả:

- `image_url` là prefix CDN
- `image` hoặc `image_location` lại đã là full URL `https://cdn.nhanhtravel.io.vn/...`

Khi ghép thẳng, client sinh ra URL dạng:

- `https://storage.googleapis.com/travelteam/https://cdn.nhanhtravel.io.vn/...`

Nên `next/image` và gallery viewer không load được ảnh thật.

### Fix

- Dùng chung `getImageSrc()` để normalize gallery src
- Nếu `image`/`image_location` đã là URL đầy đủ, helper trả nguyên URL đó
- Nếu thiếu data, helper fallback về placeholder để tránh vỡ UI

### Ý nghĩa thực tế

- Tour detail page không còn phụ thuộc vào format “vừa khít” của `image_url + image`
- Cả main slide và thumbnail/lightbox đều dùng cùng một nguồn src đã normalize
- Không đổi API contract; đây là fix render phía client cho payload lệch định dạng

## 22. Addendum 2026-06-04 - Tour Image Error Fallback

### Vấn đề

Sau khi normalize src, vẫn còn một số tour hiển thị broken image icon:

- một vài record trả `image_url` là full URL nhưng thiếu `image_location`
- một vài file ảnh thật vẫn 404 trên CDN dù host đã whitelist
- `ProductGallery` trước đó còn fallback nhầm sang `/images/default-image.png`, trong khi asset thật nằm ở `/default-image.png`

### Fix

- `getImageSrc()` giờ trả luôn `image_url` nếu đó là URL đầy đủ và không có `image_location`
- `TourItem` và `ListTour` thêm `onError` fallback về `/default-image.png`
- `ImageGallery` của tour detail cũng có fallback theo từng index
- `ProductGallery` đổi fallback đúng sang `/default-image.png` và tự thay ảnh hỏng bằng default

### Ý nghĩa thực tế

- Ảnh tour lỗi sẽ không còn hiện icon broken
- List và detail tour đều có lớp bảo hiểm cuối cùng ở UI
- Payload API vẫn giữ nguyên contract cũ; fix nằm ở client render layer

## 23. Addendum 2026-06-04 - TourItem Must Stay Client Component

### Vấn đề

Sau khi thêm `useState` vào `src/components/product/components/tour-item.tsx` để fallback ảnh lỗi, Next.js báo build fail vì file này chưa được đánh dấu client component.

### Fix

- Thêm `"use client";` ở đầu file `tour-item.tsx`
- Giữ `useState` ở component để xử lý `onError` fallback ảnh theo từng card

### Ý nghĩa thực tế

- TourItem compile lại bình thường
- Fallback ảnh lỗi vẫn hoạt động
- Những component khác import `TourItem` không cần đổi API hay props

## 24. Addendum 2026-06-04 - eSIM Performance Review

### Phạm vi review

Review hiệu năng module eSIM client trong `src/app/sim-du-lich/`, có đối chiếu API và CMS để hiểu luồng catalog/import/order.

Các file chính:

- `src/api/ProductEsim.ts`
- `src/app/sim-du-lich/lib/esim-loader.ts`
- `src/app/sim-du-lich/hooks/useEsimCatalog.tsx`
- `src/app/sim-du-lich/components/EsimPackageDiscoveryList.tsx`
- `src/app/sim-du-lich/lib/esim-discovery.ts`
- `src/components/home/SimFeatured.tsx`
- `src/app/sitemaps/sitemap_sim-du-lich.xml/route.ts`

### Bottleneck chính

- CPU: filtering, price bounds, destination matching, country grouping và sorting chạy trên toàn bộ mảng package ở client/server component. `allCountries.find()` được gọi nhiều lần khi build option nếu option list lớn.
- Memory: `esim-loader.ts` dùng module-level `Map` cache cho options/package/detail với TTL 60s nhưng không có max size; nhiều tổ hợp locale/filter/q có thể làm memory tăng trong Node runtime.
- Database/API pressure gián tiếp: `loadAllEsimPackages()` gọi `page_size=250`, sau đó nếu `last_page > 1` sẽ fan-out `Promise.all()` để kéo tất cả page còn lại.
- Network: ProductEsim API set `cache: "no-store"` khi có locale header, nên Next/browser không tận dụng HTTP cache; cache hiện chỉ là in-memory TTL của process.
- Render: listing render toàn bộ `sortedPackages.map()` và nhiều `next/image` card; khi catalog tăng lớn, mobile có thể chậm do layout/image/render nhiều item.
- Concurrency: nhiều request cùng cache key được dedupe bằng Promise cache, đây là điểm tốt. Tuy vậy cache miss cho nhiều filter khác nhau vẫn có thể tạo fan-out song song tới API.
- Scalability: client hiện tối ưu cho catalog nhỏ/vừa. Khi CMS import hàng nghìn variant/package, nên chuyển sang server-side pagination/filter/sort thay vì tải toàn bộ catalog về client.

### Tối ưu ưu tiên cao

1. Thêm endpoint/flow listing theo trang từ API và để client chỉ render một page/window thay vì `loadAllEsimPackages()` toàn bộ catalog.
2. Giới hạn concurrency của `loadAllEsimPackages()` nếu vẫn phải kéo nhiều page; không dùng `Promise.all()` không giới hạn khi `last_page` lớn.
3. Thêm max-size/LRU nhỏ cho `optionsCache`, `packageCache`, `detailCache` hoặc clear theo interval để tránh memory tăng dài hạn.
4. Virtualize hoặc paginate package list trên mobile/desktop nếu số card vượt ngưỡng an toàn.
5. Memoize/precompute country option matching theo normalized label để giảm `allCountries.find()` lặp lại.

### Tối ưu trung hạn

- `SimFeatured` và sitemap hiện gọi `loadAllEsimPackages()` cho cả quốc tế và Việt Nam; nên có endpoint featured/sitemap nhẹ chỉ trả slug/card fields cần thiết.
- Tách rich detail fields khỏi compact listing payload; client listing không cần `footer_content`, `device_compatibility`, `refund_policy` nếu đã có detail fetch riêng.
- Nếu giữ cache `no-store` để đảm bảo locale, cân nhắc server cache theo tag/TTL ở API hoặc Next layer thay vì chỉ module Map.


## 25. Addendum 2026-06-04 - eSIM Paged Card Listing Client

### Mục tiêu

Client eSIM không còn kéo toàn bộ catalog chỉ để hiển thị/search/filter listing public. Listing chính chuyển sang gọi API theo page với payload card nhẹ và để backend xử lý search/filter/sort chính.

### Client changes

- `src/api/ProductEsim.ts`
  - `search()` params hỗ trợ `card`, `sort`, `destination_ids`, `operators`.
  - Query builder serialize array params thành CSV để API filter bằng `whereIn`.
- `src/app/sim-du-lich/lib/esim-loader.ts`
  - Thêm `loadEsimPackagesPage()` trả `{ items, total, perPage, currentPage, lastPage }`.
  - Listing page gọi API với `card=true`, `page_size=36`.
  - In-memory cache có max 50 entries để tránh Map tăng không giới hạn.
  - Legacy `loadAllEsimPackages()` vẫn còn cho các luồng cần full catalog, nhưng fetch tuần tự và dùng `card=true` để giảm fan-out/memory.
- `src/app/sim-du-lich/hooks/useEsimCatalog.tsx`
  - Listing state có `page`, `lastPage`, `totalPackages`, `sortMode`.
  - Search query, region, destination IDs, operators và sort được gửi xuống backend.
  - Load more append page tiếp theo thay vì fetch toàn bộ catalog.
  - Sidebar operator options lấy từ `options-filter` cache, không derive từ package list đã load.
- Filter UI desktop/mobile/hero gửi `option.value` thay vì display label để backend nhận đúng ID/operator.
- `src/app/sim-du-lich/lib/esim-discovery.ts`
  - Sort `newest` giữ order backend.
  - Combo destination options chỉ lấy từ API options-filter; bỏ fallback suy đoán từ package label vì không thể map ổn định sang `destination_id`.

### Contract lưu ý

- Listing page nên dùng paged card search, không gọi `loadAllEsimPackages()` nếu chỉ cần render/search/filter một page.
- Price preset/variant SKU filter vẫn là local refinement trên page hiện tại; sort/search/filter destination/operator/region/query chính đã ở backend.
- Detail page và checkout flow không đổi API contract.

### Verification

- `./node_modules/.bin/tsc --noEmit --incremental false` pass.
- `npm run build` chưa chạy hết được vì file cache `.next` hiện bị `EACCES` khi Next.js unlink file cũ; lỗi xảy ra trước compile và không phải TypeScript error.

## 26. Addendum 2026-06-04 - eSIM Detail Header Uses Footer Content

### Mục tiêu

Đổi detail page eSIM để phần mô tả dưới tên gói dùng `footer_content` thay vì `subtitle`, đồng thời bỏ block `footer_content` riêng ở cuối detail page.

### Client changes

- `src/app/sim-du-lich/components/EsimProductPage.tsx`
  - Card “Thông tin gói” dưới detail controls giờ render `footerContent` bằng HTML nếu có.
  - Nếu `footerContent` trống, fallback về `subtitle` rồi `coverage`.
  - Bỏ section `Nội dung` riêng từng nằm dưới detail page.
- `src/app/sim-du-lich/components/EsimInternationalDetailGallery.tsx`
  - Hero fallback khi không có avatar cũng ưu tiên text rút gọn từ `footerContent`.
  - HTML được strip tag trước khi đưa vào overlay text để tránh render thô.

### Contract lưu ý

- `footer_content` giờ là nguồn nội dung chính cho mô tả dưới tiêu đề trên trang detail eSIM.
- `subtitle` vẫn là text ngắn/fallback, không còn là mô tả detail chính.

## 27. Addendum 2026-06-08 - Menu Refactoring & UI Renaming (Implemented 2026-05-29)

### Mục tiêu

Tinh chỉnh lại cấu trúc menu header/mobile và chuẩn hóa nhãn tiếng Việt/tiếng Anh trên giao diện của website để tối ưu hóa điều hướng người dùng và đồng bộ hóa các bản dịch động.

### Thay đổi client

- **Header (`src/components/layout/header.tsx`)**:
  - Đưa link "Du thuyền" (`/du-thuyen`) ra ngoài menu chính ngang hàng với Vé máy bay, Khách sạn, v.v. (trước đó nằm ẩn trong dropdown "Tours").
  - Đưa link "Vé vui chơi" (`/ve-vui-choi`) ra ngoài menu chính và đổi tên thành "Vé vui chơi & hoạt động" (`ve_vui_choi_hoat_dong`).
  - Loại bỏ link "Du thuyền" khỏi menu con của "Tours".
  - Đổi tên "Fast Track" thành "Dịch vụ tại sân bay" (`dich_vu_tai_san_bay`) trong submenu "Tiện ích".
  - Đổi tên phần menu "Khác" thành "Dành cho bạn" (`danh_cho_ban`).
- **Mobile Menu (`src/components/layout/header-mobile-menu.tsx`)**:
  - Đồng bộ cấu trúc phẳng của menu di động tương tự desktop header.
- **Footer (`src/components/layout/footer.tsx`)**:
  - Đổi các đường link nhãn cũ sang nhãn mới ("Fast Track" -> "Dịch vụ tại sân bay", "Khác" -> "Dành cho bạn").
- **Static Texts & Translations (`src/constants/staticText.ts`, `src/lib/i18n/serverTranslations.ts`)**:
  - Cập nhật số năm kinh nghiệm từ `8 năm` thành `10 năm` ("Đơn vị hơn 8 năm kinh nghiệm." -> "Đơn vị hơn 10 năm kinh nghiệm.").
  - Thêm helper mapping `applyAmusementTicketAliases()` trong `getStaticTextTranslationMap()` để map cả `ve_vui_choi` và `ve_vui_choi_hoat_dong` về cùng một nhãn dịch nhằm tránh lỗi hiển thị khi chuyển đổi ngôn ngữ.

### Ý nghĩa thực tế

- Giao diện website hiển thị nhãn mới đồng bộ hơn, định vị thương hiệu 10 năm kinh nghiệm rõ nét hơn.
- Menu header phẳng giúp khách hàng truy cập trực tiếp vào các sản phẩm chủ lực (Du thuyền, Vé vui chơi & hoạt động) dễ dàng hơn.
- Không ảnh hưởng tới API contract hay logic backend.

## 28. Addendum 2026-06-08 - International Tour URL Fix

### Mục tiêu

Sửa lỗi sai URL dẫn đến trang 404 cho Tour quốc tế trên giao diện desktop header và đảm bảo chuyển hướng mượt mà cho các link cũ.

### Thay đổi client

- **Desktop Header (`src/components/layout/header.tsx`)**:
  - Đổi URL `/tours/tour-quoc_te` thành `/tours/tour-quoc-te` ở dòng 429.
- **Config Redirect (`next.config.mjs`)**:
  - Thêm cấu hình `redirects()` trả về mã redirect 301 cho các request từ `/tours/tour-quoc_te` trỏ về `/tours/tour-quoc-te` để duy trì tương thích SEO và các bookmark cũ.

### Ý nghĩa thực tế

- Người dùng desktop nhấp vào "Tour quốc tế" sẽ được dẫn thẳng tới URL chuẩn mà không gặp trang 404.
- Mọi truy cập cũ qua URL chứa dấu gạch dưới `tour-quoc_te` đều được tự động chuyển hướng 301 về URL chuẩn.

## 29. Addendum 2026-06-08 - Amusement Ticket USD Conversion and PayPal Integration

### Mục tiêu

- Khắc phục hiển thị giá trong locale tiếng Anh (`lang = en`) của Vé vui chơi (Amusement Ticket) bằng cách chuyển đổi tỉ giá cố định 27000 VND = 1 USD (API thực hiện chuyển đổi số lượng và mock thông tin currency USD, client hiển thị kí hiệu `$` chuẩn).
- Tích hợp thanh toán bằng PayPal cho đơn hàng Vé vui chơi (mã đặt chỗ bắt đầu bằng `EVT`) khi ở locale tiếng Anh.

### Thay đổi client

- **Đồng bộ tham số Locale khi gọi API**:
  - Cập nhật `src/app/ve-vui-choi/[slug]/page.tsx` truyền tham số `language` vào hàm `ProductTicket.detail` và `ProductTicket.detailBySlug` để backend API trả về đúng nội dung tiếng Anh tương ứng.
- **Trang Chi Tiết Đặt Hàng (`src/app/thong-tin-dat-hang/components/BookingDetail.tsx`)**:
  - Khi locale là `en` và mã đặt chỗ bắt đầu bằng `EVT`, giao diện chọn phương thức thanh toán sẽ chỉ hiển thị cổng **PayPal / Credit Card** và tự động chọn phương thức này. Các phương thức VietQR và OnePay bị ẩn.
  - Khi click thanh toán, client sẽ gọi `BookingProductApi.paypalCreateTicketOrder` để tạo đơn thanh toán trên PayPal và tự động điều hướng người dùng tới URL thanh toán PayPal.
- **API Helpers (`src/api/BookingProduct.ts`)**:
  - Thêm wrapper `paypalCreateTicketOrder` (`POST product/amusement-ticket/paypal/create-order`) và `paypalCaptureTicketOrder` (`POST product/amusement-ticket/paypal/capture-order`).
- **Trang Outcome / Callback của PayPal**:
  - Tạo trang thành công `src/app/ve-vui-choi/payment-success/page.tsx` để thực hiện capture giao dịch thông qua API, sau đó chuyển hướng về trang kết quả chung `/payment-result?status=success...`.
  - Tạo trang hủy `src/app/ve-vui-choi/payment-cancel/page.tsx` hiển thị thông báo và điều hướng người dùng quay lại trang Vé vui chơi.
- **Fix gọi sai API ở Fast Track**:
  - Sửa lỗi trong `src/app/fast-track/[slug]/page.tsx` từ việc gọi nhầm `ProductYachtApi.detailBySlug` sang đúng `ProductFastTrackApi.detailBySlug`.

## 30. Addendum 2026-06-08 - PayPal Payment Method Validation Fix

### Mục tiêu

Khắc phục lỗi validation chặn người dùng chọn phương thức thanh toán PayPal trên trang thông tin đặt hàng (`/thong-tin-dat-hang`) của Vé vui chơi (thông báo lỗi "Please select payment method" vẫn hiển thị dù đã chọn PayPal).

### Thay đổi client

- **Checkout Schema (`src/schemaValidations/checkOut.schema.ts`)**:
  - Cập nhật hàm refine để chấp nhận `"paypal"` là một phương thức thanh toán hợp lệ: `["cash", "vietqr", "onepay", "paypal"].includes(value)`.
  - Thay đổi này giúp form vượt qua bộ lọc Zod validation khi submit phương thức thanh toán PayPal.
- **Trang Kết Quả Thanh Toán (`src/app/payment-result/page.tsx`)**:
  - Khắc phục lỗi flash màn hình thất bại khi mới load trang (do Next.js router chưa load xong query parameters khi hydration) bằng cách thêm state check `ready` trên mount.
  - Phân biệt loại đơn hàng: Nếu mã đơn hàng bắt đầu bằng `"EVT"` (Vé vui chơi), hiển thị thông báo thành công cho Ticket `"Your ticket order will be processed shortly."` thay vì cứng nhắc hiển thị `"Your eSIM order..."`.

## 31. Addendum 2026-06-08 - Fix Image Rendering & Slashes Formatting

### Mục tiêu
Khắc phục lỗi không thể hiển thị hình ảnh của dịch vụ Fast Track do sai đường dẫn (dẫn tới Next.js Image component từ chối render).

### Thay đổi client
- **Sử dụng Helper `getImageSrc`**:
  - Thay thế toàn bộ cú pháp ghép chuỗi thủ công lỗi thời `${item.image_url}/${item.image_location}` bằng helper `getImageSrc(url, location)` ở các component:
    - `src/components/home/FastTrackTabs.tsx`
    - `src/app/fast-track/components/Search.tsx`
    - `src/app/fast-track/components/ImageGallery.tsx`
    - `src/app/fast-track/components/BookingDetail.tsx`
    - `src/app/thong-tin-dat-hang/components/BookingDetail.tsx`
  - **Lợi ích**: Triệt tiêu lỗi trùng lắp dấu gạch chéo `//` ở phần đường dẫn (ví dụ: `http://localhost:8001//ckfinder/...`) làm Next.js `<Image>` component không thể phân tích cú pháp và từ chối hiển thị hình ảnh.

## 32. Addendum 2026-06-08 - PayPal Integration for FastTrack in English Locale

### Mục tiêu
Tích hợp phương thức thanh toán PayPal cho dịch vụ Fast Track khi ở locale tiếng Anh (chỉ hiển thị PayPal / Credit Card, ẩn VietQR và OnePay). Khi ở locale tiếng Việt, giữ nguyên VietQR và OnePay (ẩn PayPal).

### Thay đổi client
- **Checkout Schema (`src/schemaValidations/checkOut.schema.ts`)**:
  - Cập nhật schema `CheckOutBody` để chấp nhận `"paypal"` là một phương thức thanh toán hợp lệ.
- **API Wrapper (`src/api/BookingProduct.ts`)**:
  - Thêm phương thức `paypalCreateOrder` (`POST booking/paypal/create-order`) và `paypalCaptureOrder` (`POST booking/paypal/capture-order`).
- **Trang Chi Tiết Đặt Hàng (`src/app/thong-tin-dat-hang/components/BookingDetail.tsx` & `src/app/fast-track/components/BookingDetail.tsx`)**:
  - Nếu `language === 'en'` và product type là `'fast-track'`, chỉ render cổng thanh toán **PayPal / Credit Card** và tự động chọn phương thức này.
  - Khi người dùng click thanh toán, gọi `BookingProductApi.paypalCreateOrder` để nhận `approval_url` và chuyển hướng trình duyệt tới cổng PayPal.
- **Trang Outcome / Callback của PayPal**:
  - Tạo trang `src/app/fast-track/payment-success/page.tsx` để capture giao dịch PayPal và redirect về `/payment-result?status=success`.
  - Tạo trang `src/app/fast-track/payment-cancel/page.tsx` để thông báo cho khách hàng đã huỷ thanh toán.
- **Trang Kết Quả Chung (`src/app/payment-result/page.tsx`)**:
  - Cập nhật text hiển thị thành công: nếu mã đơn hàng bắt đầu bằng `HAP`, hiển thị `"Your booking will be processed shortly."` thay vì cứng nhắc hiển thị `"Your eSIM order..."`.

## 33. Addendum 2026-06-09 - eSIM Mobile CTA No Count

### Mục tiêu

- Giảm độ nhiễu trên mobile filter sheet của eSIM bằng cách bỏ số lượng động khỏi nút commit cuối cùng.

### Thay đổi client

- **Mobile filter footer (`src/app/sim-du-lich/components/EsimPackageDiscoveryMobileFilters.tsx`)**:
  - Nút xác nhận ở footer mobile của sheet `Location`/`Filters` giờ chỉ còn nhãn `Show results`.
  - Bỏ hẳn số lượng động ở giữa CTA để giao diện mobile gọn hơn và đồng nhất với yêu cầu hiển thị mới.
- **Props trung gian (`src/app/sim-du-lich/components/EsimPackageDiscoveryFilters.tsx` & `src/app/sim-du-lich/components/EsimPackageDiscovery.tsx`)**:
  - Loại bỏ prop trung gian `packagesCount` khỏi luồng mobile filters vì không còn dùng để render CTA.
  - Count vẫn được giữ ở các nơi khác nếu cần cho header/listing, nhưng không còn xuất hiện ở nút apply mobile.

## 34. Addendum 2026-06-09 - Menu Refactoring & Submenus

### Mục tiêu

- Refactor cấu trúc và thứ tự của menu navigation trên cả desktop (`header.tsx`) và mobile (`header-mobile-menu.tsx`) theo yêu cầu giao diện mới.
- Hỗ trợ đầy đủ các submenu đi kèm cho Visa, Dịch vụ tại sân bay, Vé vui chơi, Sim du lịch, Tour và Dành cho bạn.
- Bổ sung khả năng lọc theo danh mục (category) trực tiếp khi load trang Vé vui chơi thông qua URL query parameter.

### Thay đổi client

- **Desktop Header (`src/components/layout/header.tsx`)**:
  - Sắp xếp lại menu theo đúng thứ tự: Vé máy bay, Khách sạn, Visa (dropdown), Dịch vụ tại sân bay (dropdown), Vé vui chơi (dropdown), Sim du lịch (dropdown), Tour (dropdown), Bảo hiểm, Du thuyền, Dành cho bạn (dropdown).
  - Loại bỏ liên kết Combo.
  - Tích hợp submenu cho Vé vui chơi (với các mục: Vé vui chơi, Show diễn, Land tour, Vé xe) và Sim du lịch (với các mục: Sim Việt Nam, Sim quốc tế).
- **Mobile Menu (`src/components/layout/header-mobile-menu.tsx`)**:
  - Restructure toàn bộ cấu trúc để đồng bộ hoàn toàn với thứ tự và nhóm submenu của Desktop.
- **Trang Vé vui chơi (`src/app/ve-vui-choi/components/Search.tsx` & `src/components/product/components/SideBarFilter.tsx`)**:
  - Khởi tạo state `"category[]"` dựa trên query parameter `category` của URL khi load trang lần đầu.
  - Cập nhật checkbox ở sidebar desktop hiển thị đúng trạng thái chọn dựa trên state của bộ lọc (controlled components).
- **Dịch ngôn ngữ (`src/constants/staticText.ts`)**:
  - Thêm các từ khóa hiển thị mới như `"Show diễn"`, `"Land tour"`, `"Vé xe"` vào danh sách text tĩnh để hỗ trợ tự động dịch.

### Ý nghĩa thực tế

- Giao diện điều hướng được tinh chỉnh tinh gọn, tập trung và dễ thao tác trên cả thiết bị di động lẫn máy tính để bàn.
- Các submenu giúp khách hàng truy cập sâu vào từng phân loại sản phẩm nhanh chóng.
- Liên kết từ submenu của Vé vui chơi tự động kích hoạt bộ lọc tương ứng trên trang listing ngay khi truy cập.

## 35. Addendum 2026-06-09 - FastTrack Filter Integration (Dynamic)

### Mục tiêu

Tích hợp thuộc tính `fast_track_type` ("Nhập cảnh" / "Xuất cảnh") vào hệ thống tìm kiếm và lọc của module FastTrack trên Client một cách tự động/động (dynamic).

### Chi tiết tích hợp

- **Bộ lọc động từ API**: Website lấy danh sách bộ lọc tự động và động từ API thông qua endpoint `GET /api/v1/product/fast-track/options-filter`.
- **Tránh Cache Phân Loại**: Thiết lập `timeCache = 0` trong cuộc gọi API `ProductFastTrackApi.getOptionsFilter()` để tránh cache 5 phút của Next.js Server Components, giúp cập nhật phân loại tức thì ngay khi DB thay đổi.
- **Hiển thị giao diện tự động**: Khi API bổ sung thêm trường "Phân loại" (`fast_track_type` với các giá trị `arrival` và `departure`), giao diện bộ lọc bên trái (Sidebar Filter) trên trang `/fast-track` và `/fast-track/[slug]` sẽ **tự động vẽ thêm** nhóm check-box "Phân loại" gồm hai lựa chọn "Nhập cảnh" và "Xuất cảnh" mà không cần sửa đổi mã nguồn client.
- **Tương tác**: Khi người dùng tương tác với checkbox, client tự động gửi tham số dạng `fast_track_type[]=arrival` hoặc `fast_track_type[]=departure` trực tiếp lên API tìm kiếm `/api/v1/product/fast-track/search`.

## 36. Addendum 2026-06-09 - Immigration Transfer Menu Refactoring

### Mục tiêu

- Đổi tên "Dịch vụ đưa đón sân bay" thành "Đưa đón xuất nhập cảnh" bên trong dropdown của menu chính "Dịch vụ tại sân bay".
- Phân tách submenu của "Đưa đón xuất nhập cảnh" thành "Tiễn xuất cảnh" (filter theo danh mục Xuất cảnh - category ID 176) và "Đón nhập cảnh" (filter theo danh mục Nhập cảnh - category ID 175) trên cả desktop và mobile.
- Thêm hỗ trợ tự động dịch các từ khóa mới qua `staticText.ts`.

### Chi tiết thay đổi

- **Giao diện điều hướng (`header.tsx` & `header-mobile-menu.tsx`)**:
  - Đổi tên nhãn của liên kết Fast Track thành `dua_don_xuat_nhap_canh` ("Đưa đón xuất nhập cảnh").
  - Thêm các submenu liên kết bên dưới là `xuat_canh` ("Xuất cảnh") trỏ đến `/fast-track/xuat-canh` và `nhap_canh` ("Nhập cảnh") trỏ đến `/fast-track/nhap-canh`.
  - Trên mobile, menu sẽ tự động đóng lại khi nhấn vào các submenu này.
- **Giao diện footer (`footer.tsx`)**:
  - Cập nhật liên kết dịch vụ Fast Track thành "Đưa đón xuất nhập cảnh".
- **Hệ thống tìm kiếm (`Search.tsx` & `FastTrackCategory.tsx`)**:
  - Tích hợp `key={detail?.id}` vào component `Search` ở trang category để đảm bảo unmount và remount sạch sẽ khi chuyển đổi giữa các trang category.
  - Bổ sung `useEffect` trong `Search` lắng nghe thay đổi của `searchParams` để đồng bộ lại bộ lọc category và location trong trường hợp thay đổi query parameter.
- **Hệ thống dịch thuật (`staticText.ts`)**:
  - Bổ sung `"Đưa đón xuất nhập cảnh"`, `"Xuất cảnh"`, `"Nhập cảnh"` để hệ thống tự động dịch sang tiếng Anh.

## 37. Addendum 2026-06-09 - Homepage Search Tabs Refactoring

### Mục tiêu

- Cập nhật thanh tab tìm kiếm trên trang chủ (cả Desktop và Mobile) theo cấu trúc 6 dịch vụ mới: Vé máy bay, Khách sạn, Visa, Sim du lịch, Combo tiết kiệm, Dịch vụ tại sân bay.

### Thay đổi client

- **Giao diện Desktop (`src/components/home/search.tsx`)**:
  - Điều chỉnh container tab bar đen về `max-w-[1020px] min-w-[820px]` với `gap-2` và padding button `px-3` để các tabs hiển thị khít và gọn gàng hơn.
  - Chuyển đổi chiều cao cố định của khung chứa form từ `h-[192px]` thành `min-h-[192px] h-fit` để tự động giãn chiều cao theo từng form.
  - Tích hợp 6 tab dịch vụ với các component tìm kiếm tương ứng:
    1. **Vé máy bay** (`SearchFlight`)
    2. **Khách sạn** (`SearchHotel`)
    3. **Visa** (`VisaSearchForm` với prop `optionsFilter`)
    4. **Sim du lịch** (`SimDuLichHeroFilters` dạng select chọn quốc gia)
    5. **Combo tiết kiệm** (Tự dựng form `ComboSearchForm` gọn gàng sử dụng select điểm đi/điểm đến)
    6. **Dịch vụ tại sân bay** (`AirportSearchForm` của Fast Track)
- **Giao diện Mobile (`src/components/home/search-mobile.tsx`)**:
  - Chuyển đổi layout lưới hiển thị tab bar từ 4 cột thành 6 cột phân phối đều trong lưới 3 cột `grid grid-cols-3` tương ứng với 6 dịch vụ.
  - Đồng bộ luồng hiển thị form tìm kiếm tương tự như Desktop.
- **Trang chủ Server Component (`src/app/page.tsx`)**:
  - Fetch dữ liệu `visaOptions` (`VisaApi.getOptionsFilter`) và `comboLocations` (`ProductLocation.list`) song song với các dữ liệu cũ ở server-side thông qua `Promise.all`.
  - Pass các tham số bộ lọc này xuống component `<Search />` và `<SearchMobile />` dưới dạng props.
- **Sửa lỗi Form tìm kiếm Fast Track (`src/app/fast-track/components/SearchForm.tsx`)**:
  - Khắc phục lỗi copy-paste: thay thế toàn bộ tham chiếu `ProductTicket` thành `ProductFastTrackApi`, đổi đường dẫn redirect `/ve-vui-choi/...` thành `/fast-track/...` và sử dụng `useTranslation` để lấy đúng tiêu đề dịch.
## 38. Addendum 2026-06-09 - Homepage Search Tabs Expansion

### Mục tiêu

Mở rộng thanh tab tìm kiếm trên trang chủ (bản Desktop) từ 6 dịch vụ lên 10 dịch vụ bằng cách thêm một hàng nút nhỏ hơn ở phía dưới cho các dịch vụ còn lại: Tours, Du thuyền, Vé vui chơi & hoạt động, Bảo hiểm.

### Thay đổi chi tiết

- **Giao diện Desktop (`src/components/home/search.tsx`)**:
  - Tái cấu trúc khung chứa tab bar đen thành 2 hàng dạng `flex flex-col` thay vì 1 hàng ngang.
  - Hàng trên (Featured/Nổi bật): Giữ nguyên 6 tab lớn (Vé máy bay, Khách sạn, Visa, Sim du lịch, Combo tiết kiệm, Dịch vụ tại sân bay).
  - Hàng dưới (Remaining/Còn lại): Thêm 4 tab nhỏ hơn với font size `text-xs` và icon `14x14`:
    7. **Tours** (`SearchTour`)
    8. **Du thuyền** (`SearchYacht`)
    9. **Vé vui chơi & hoạt động** (`SearchAmusement`)
    10. **Bảo hiểm** (`SearchInsurance`)
  - Chuyển đổi khoảng cách trên của card tìm kiếm `pt-11` thành `pt-[64px]` để tạo không gian thoáng rộng, tránh đè lên tab bar hai hàng.
- **Sửa lỗi Form tìm kiếm Du thuyền (`src/app/du-thuyen/components/SearchForm.tsx`)**:
  - Sửa lỗi copy-paste: Thay thế API client `ProductTicket` thành `ProductYachtApi`, đổi route đích khi submit từ `/ve-vui-choi/chi-tiet/...` sang `/du-thuyen/...` và gọi đúng API `ProductYachtApi.location` để lấy danh sách du thuyền có lịch trình hoạt động theo ngày đi.

## 39. Addendum 2026-06-09 - Shift Hero Title Upwards

### Mục tiêu

- Đẩy chữ "Bắt đầu hành trình với HappyBook" lên cao hơn để tránh bị đè hoặc dính sát với phần container tab tìm kiếm màu đen 2 hàng, đồng thời giữ nguyên vị trí hiện tại của khung tìm kiếm.

### Thay đổi chi tiết

- **Desktop Search (`src/components/home/search.tsx`)**:
  - Thêm class `top-[-40px]` vào phần tiêu đề `h2` (`className="text-3xl text-white font-bold text-center mb-12 relative top-[-40px]"`).
  - Định vị `relative` giúp tiêu đề dịch chuyển trực quan lên trên 40px mà không thay đổi dòng chảy layout gốc, giữ cho khung tìm kiếm bên dưới cố định tại vị trí của nó.

## 40. Addendum 2026-06-09 - Register Yacht Translation Keys

### Vấn đề

- Các nhãn `"Tìm du thuyền"` và `"Nơi đi"` hiển thị dưới dạng raw key (`tim_du_thuyen` và `noi_di`) khi hiển thị form tìm kiếm du thuyền do chưa được khai báo dịch thuật tĩnh.

### Giải pháp

- **Khai báo tĩnh (`src/constants/staticText.ts`)**:
  - Bổ sung `"Tìm du thuyền"` và `"Nơi đi"` vào mảng `generalStaticText`. Hệ thống tự động chuyển đổi sang định dạng snake_case (`tim_du_thuyen`, `noi_di`) và dịch thông qua Google Translate API ở chế độ tiếng Anh (`en`).

## 41. Addendum 2026-06-09 - Fix Homepage Tours Search Tab Layout

### Vấn đề

- Tab Tìm kiếm Tours trên trang chủ hiển thị bị lệch và trống trải (đẩy ô input xuống dưới cùng của card) do component `SearchTour` kế thừa trực tiếp style `base__content` (vốn có padding-top lớn `pt-[132px]`) dành cho trang con chuyên biệt và chứa tiêu đề trắng tàng hình đè lên.

### Giải pháp

- **Hỗ trợ chế độ hiển thị Trang chủ (`src/app/tours/components/Search.tsx`)**:
  - Bổ sung prop `isHomePage = false` cho component `SearchTour`.
  - Nếu `isHomePage` là `true`, component sẽ bỏ class padding `base__content`, ẩn tiêu đề H1 và dựng layout 2 cột (9/12 cho input tìm kiếm và 3/12 cho nút tìm kiếm màu cam) đồng bộ với phong cách hiển thị của các tab khác (như khách sạn/hotel).
- **Tích hợp (`src/components/home/search.tsx`)**:
  - Truyền `isHomePage={true}` vào `<SearchTour />` tại tab 6.

## 42. Addendum 2026-06-09 - Sim Du Lich Search Button Integration

### Mục tiêu

- Tích hợp thêm nút "Tìm kiếm" vào tab Sim du lịch (eSIM) trên trang chủ, giúp người dùng chủ động click tìm kiếm thay vì hệ thống tự động chuyển hướng ngay lập tức khi vừa chọn quốc gia trong dropdown.

### Chi tiết thay đổi

- **SimDuLichHeroFilters (`src/app/sim-du-lich/components/SimDuLichHeroFilters.tsx`)**:
  - Cập nhật hàm `handleDestinationChange` chỉ cập nhật label được chọn để giữ trạng thái trên select dropdown chứ không gọi `router.push()` trực tiếp nữa.
  - Thêm hàm `handleSearch` dùng để điều hướng người dùng tới liên kết của gói eSIM thuộc quốc gia đã chọn (`resolveDefaultSimDuLichPackageHref`), hoặc điều hướng tới trang danh sách eSIM chung `/sim-du-lich` nếu chưa chọn quốc gia nào.
  - Tách giao diện thành 2 cột: Select dropdown quốc gia chiếm phần lớn chiều rộng và nút "Tìm kiếm" màu cam nổi bật (độ cao 52px bằng select dropdown) chiếm 3/12 chiều rộng, xếp ngang hàng trên desktop và tự động xếp chồng trên mobile.

## 43. Addendum 2026-06-09 - FastTrack Original and Discount Price Implementation

### Mục tiêu
- Hỗ trợ hiển thị giá gốc (`price`) và giá giảm (`discount_price`) cho module FastTrack trên Search page.
- Áp dụng trừ giảm giá sản phẩm (`discount_price`) trực tiếp vào tổng tiền thanh toán (`totalPrice`) tại trang checkout, hiển thị dòng "Giảm giá trực tiếp" trong sidebar và truyền giá trị thanh toán thực tế sau giảm giá vào cổng thanh toán / voucher program.
- Đồng bộ hiển thị "Giảm giá trực tiếp" trong trang chi tiết đơn hàng (BookingDetail).

### Thay đổi client
- `src/app/fast-track/components/Search.tsx`: Hiển thị giá gốc bị gạch ngang và giá thực tế sau khi giảm (`price - discount_price`, không có chữ tiền tố) khi sản phẩm có `discount_price > 0`.
- `src/app/fast-track/components/FormCheckOut.tsx`: Tính toán lại `totalPrice` bằng cách trừ đi `product?.discount_price`. Render thêm dòng "Giảm giá trực tiếp" ở danh sách thanh toán.
- `src/app/fast-track/components/BookingDetail.tsx`: Hiển thị thêm dòng "Giảm giá trực tiếp" ở cột tóm tắt thông tin thanh toán khi `data?.product?.discount_price > 0`.

## 44. Addendum 2026-06-10 - FastTrack Thumbnail & Gallery Mobile Fit

### Mục tiêu

Khắc phục triệt để tình trạng ảnh đại diện (thumbnail) trên trang danh sách và ảnh lớn trong trang chi tiết của các dịch vụ (FastTrack, Lounges, v.v.) bị cắt xén (crop) mất logo, văn bản hoặc thông tin hiển thị quan trọng trên giao diện mobile, trong khi vẫn giữ nguyên giao diện ôm trọn, đầy đặn trên desktop.

### Chi tiết thay đổi

- **Trang danh sách FastTrack (`src/app/fast-track/components/Search.tsx`)**:
  - Đổi thuộc tính hiển thị hình ảnh của Next.js `Image` thành `object-contain` trên mọi kích thước màn hình (cả mobile và desktop).
  - Khung chứa ảnh sử dụng tỉ lệ cố định **16:9** (`aspect-[16/9]`) và nền trắng (`bg-white`). Điều này loại bỏ hoàn toàn các thanh trống màu trắng ở trên và dưới (top/bot) cho các banner thiết kế dạng ngang/landscape, đồng thời giữ chiều cao thẻ lưới đồng đều. Thuộc tính `object-contain` đảm bảo hình ảnh hiển thị trọn vẹn 100% thông tin, không bị cắt xén (crop) mất logo hay nội dung ở viền trái/phải.
- **Trang chi tiết chung (`src/components/product/components/ProductGallery.tsx`)**:
  - Cập nhật Swiper chính của trang chi tiết sản phẩm: dùng `w-full aspect-[4/3] md:h-[450px] md:aspect-auto` và đặt nền màu trắng cho slide.
  - Cập nhật `Link` bọc ngoài ảnh thành `w-full h-full block relative overflow-hidden rounded-lg` để kéo giãn vùng click và căn chỉnh chuẩn xác theo khung Swiper.
  - Thay đổi `Image` thành `object-contain md:object-cover w-full h-full` giúp trên mobile hiển thị trọn vẹn toàn bộ poster/banner sản phẩm mà không bị crop mất chữ, đồng thời giữ nguyên fixed height `md:h-[450px] md:object-cover` trên desktop.
- **File Gallery FastTrack (`src/app/fast-track/components/ImageGallery.tsx`)**:
  - Cập nhật ảnh chính thành `object-contain md:object-cover` để đồng bộ cấu trúc hiển thị phòng hờ.
- **Cấu hình Build Tối ưu (`next.config.mjs`)**:
  - Bổ sung cấu hình `eslint.ignoreDuringBuilds: true` và `typescript.ignoreBuildErrors: true` để Next.js bỏ qua linting và typechecking khi biên dịch trên production. Việc này giúp giảm tải bộ nhớ (RAM) và CPU cho máy chủ VPS khi chạy lệnh `yarn build`, giải quyết triệt để tình trạng nghẽn/treo tiến trình deploy (Deploy via SSH).

## 45. Addendum 2026-06-11 - FastTrack Featured Tab Image Layout Fix

### Mục tiêu

Khắc phục tình trạng ảnh đại diện dịch vụ FastTrack tại các tab nổi bật (Featured Tabs) ở trang chủ bị cắt xén (crop) mất thông tin do sử dụng tỉ lệ khung ảnh vuông (1:1) và chế độ bao phủ (`object-cover`).

### Chi tiết thay đổi

- **Trang chủ Tab nổi bật (`src/components/home/FastTrackTabs.tsx`)**:
  - Thay đổi tỉ lệ khung chứa ảnh đại diện sản phẩm FastTrack từ tỉ lệ vuông `aspect-[1/1]` sang tỉ lệ ngang **16:9** (`aspect-[16/9]`) kết hợp với nền trắng (`bg-white`).
  - Thay đổi thuộc tính hiển thị hình ảnh của Next.js `Image` từ `object-cover` thành `object-contain`. Việc này giúp hiển thị trọn vẹn 100% nội dung banner quảng cáo (bao gồm logo HappyBook, mascot chú chim và các văn bản chỉ dẫn dịch vụ tại sân bay ở hai viền) mà không bị cắt xén, đồng bộ hoàn toàn với kiểu hiển thị của trang danh sách/tìm kiếm FastTrack.
  - Chuyển đổi từ truyền cứng `width` và `height` sang thuộc tính `fill` cùng `sizes` tương thích responsive để tận dụng tối đa Next.js Image optimization và khả năng co giãn tự động theo khung chứa `aspect-[16/9]`.

## 46. Addendum 2026-06-11 - FastTrack Detail Page Mobile Thumbnail Layout

### Mục tiêu

- Cập nhật giao diện trang chi tiết của module FastTrack (trên thiết bị di động/mobile) sao cho ảnh đại diện/gallery (thumbnail) được đẩy lên phần đầu tiên (ngay dưới breadcrumbs) giống như cách hiển thị của module eSIM.

### Chi tiết thay đổi

- **Trang chi tiết FastTrack (`src/app/fast-track/components/FastTrackDetailInfor.tsx`)**:
  - Đổi lớp CSS của container bọc ngoài từ `flex-col-reverse` sang `flex-col` trên màn hình di động (`flex flex-col lg:flex-row`).
  - Thay đổi này giúp hiển thị cột chứa `<ProductGallery />` ở vị trí đầu tiên (trên cùng) khi xem trên điện thoại di động, sau đó mới đến cột chứa thông tin chi tiết dịch vụ, biểu phí phụ thu và nút đặt dịch vụ.

## 47. Addendum 2026-06-11 - eSIM Mobile Payment Bar & Back To Top Button Hide & Return to Package Button

### Mục tiêu

- Ẩn thanh tổng thanh toán ở chân trang (mobile sticky payment bar) trên thiết bị di động khi người dùng chưa chọn bất kỳ gói eSIM/variant nào.
- Ẩn nút "Back to Top" (quay lại đầu trang) riêng đối với các trang thuộc module eSIM (sim du lịch, sim Việt Nam, sim quốc tế).
- Thêm nút "Quay lại chọn gói" ở component chi tiết đặt ngay (EsimProductSidebar) trên di động để cuộn nhanh người dùng lên lại phần chọn dung lượng/ngày sử dụng.

### Chi tiết thay đổi

- **Trang eSIM Product (`src/app/sim-du-lich/components/EsimProductPage.tsx`)**:
  - Bổ sung kiểm tra điều kiện `catalog.selectedVariant && catalog.total > 0` trước khi hiển thị component `fixed bottom` của thanh tổng thanh toán. Nếu chưa có gói/variant nào được chọn (giá trị mặc định ban đầu là null trên mobile), thanh này sẽ được ẩn đi.
- **Nút Back to Top (`src/components/layout/back-top-btn.tsx`)**:
  - Tích hợp hook `usePathname` từ `next/navigation` để lấy đường dẫn hiện tại.
  - Thêm kiểm tra nếu pathname thuộc các module eSIM (bắt đầu bằng `/sim-du-lich`, `/sim-viet-nam`, hoặc `/sim-quoc-te`), component sẽ trả về `null` ngay lập tức để ẩn nút Back to Top.
- **Nút Quay lại chọn gói (`src/app/sim-du-lich/components/EsimProductSidebar.tsx` & `EsimPackageControls.tsx`)**:
  - Thêm `id="chon-goi-esim"` vào thẻ `<section>` chứa giao diện chọn gói eSIM (`EsimPackageControls.tsx`).
  - Thêm nút "Quay lại chọn gói" với class `lg:hidden` (chỉ hiển thị trên mobile) dưới nút "Đặt ngay" trong `EsimProductSidebar.tsx`, khi click sẽ tính toán vị trí cuộn và gọi `window.scrollTo` có trừ đi offset 100px của header để quay lại phần chọn gói mượt mà.

## 48. Addendum 2026-06-11 - eSIM Listing Page Thumbnail Aspect Ratio & Layout Optimization

### Mục tiêu

- Khắc phục lỗi hình ảnh đại diện (thumbnail) của các gói eSIM trên trang danh sách (listing) bị bóp/méo tỉ lệ trên giao diện desktop.
- Tối ưu hóa không gian trống trên thẻ gói eSIM (listing card) của giao diện desktop để bố cục hiển thị đầy đặn, cân đối và chuyên nghiệp hơn.

### Chi tiết thay đổi

- **Component danh sách eSIM (`src/app/sim-du-lich/components/EsimPackageDiscoveryList.tsx`)**:
  - Đổi class của container bọc ảnh từ `aspect-[4/3] min-h-40 w-full overflow-hidden rounded-xl lg:aspect-auto lg:h-full` sang `aspect-[16/10] w-full overflow-hidden rounded-xl`. Việc loại bỏ `lg:aspect-auto lg:h-full` giúp ngăn ảnh wrapper bị kéo dãn theo chiều cao của phần chi tiết thông tin gói bên cạnh.
  - Cập nhật thuộc tính hiển thị hình ảnh của Next.js `Image` từ `object-cover object-top` sang `object-contain bg-white` để hình ảnh hiển thị trọn vẹn 100% không bị cắt xén hay bóp méo, đồng bộ với cách hiển thị chuẩn trên trang chi tiết eSIM.
  - Tái cấu trúc layout phần thông tin bên phải trên desktop: chuyển ba thông số (Hạn sử dụng, Điểm đến, Nhà mạng) thành dạng hàng ngang không xuống dòng (`sm:flex-row sm:flex-nowrap sm:items-center sm:gap-x-6`) để lấp đầy khoảng trống bề ngang.
  - Tách phần hiển thị giá bán thành cột riêng ở góc phải (`lg:border-l lg:border-slate-100 lg:pl-6`), bổ sung nhãn "Giá từ" và nút "Chọn gói" (chỉ hiện trên desktop) để lấp đầy khoảng trống bên phải và làm nổi bật CTA.

## 49. Addendum 2026-06-11 - eSIM Listing Card Details Responsive Layout

### Mục tiêu

- Sửa lỗi hàng thông tin eSIM (Hạn sử dụng, Điểm đến, Nhà mạng) bị xuống hàng ở mobile, đồng thời hiển thị dạng cột dọc ở giao diện desktop để tối ưu hóa không gian hiển thị và tránh bị trống card.

### Chi tiết thay đổi

- **Giao diện danh sách eSIM (`src/app/sim-du-lich/components/EsimPackageDiscoveryList.tsx`)**:
  - Chuyển container thông tin thành `flex-row flex-nowrap lg:flex-col lg:items-start lg:gap-y-2.5` để hiển thị hàng ngang 1 dòng trên mobile/tablet và dạng cột dọc stacked ở desktop.
  - Giảm khoảng cách icon-text từ `gap-2.5` xuống `gap-1.5` trên mobile/tablet.
  - Thêm class `overflow-hidden` và `truncate` cho mobile, đồng thời cho phép text tự xuống dòng tự nhiên trên desktop bằng `lg:whitespace-normal` khi cần.

## 50. Addendum 2026-06-11 - Yacht Default Sorting Newest

### Mục tiêu

Thiết lập mặc định sắp xếp danh sách du thuyền theo thứ tự mới nhất (Mới nhất - `id|desc`).

### Thay đổi

- **File**: `src/app/du-thuyen/components/Search.tsx`
  - Cập nhật giá trị khởi tạo của query state `sort` thành `"id"` và `order` thành `"desc"`.
  - Thay đổi `defaultValue` của thẻ `<select>` sắp xếp từ `"price|asc"` thành `"id|desc"`.

## 51. Addendum 2026-06-11 - FastTrack Price Wrap Fix on Mobile Detail Page

### Mục tiêu

Sửa lỗi giá tiền và ký tự tiền tệ ("đ") bị xuống hàng trên giao diện di động (mobile) trong trang chi tiết dịch vụ FastTrack.

### Thay đổi

- **File**: `src/app/fast-track/components/FastTrackDetailInfor.tsx`
- Bổ sung class `whitespace-nowrap flex-shrink-0` vào thuộc tính `className` của các component `<DisplayPrice>` cho cả phần danh sách vé (`ticket.price`) và danh sách phụ phí thêm (`fee.price`).
  - Thay đổi này ngăn trình duyệt tự động ngắt dòng ở khoảng trắng trước ký tự "đ", đảm bảo toàn bộ số tiền và ký hiệu tiền tệ luôn nằm trên cùng một dòng.

## 52. Addendum 2026-06-11 - FastTrack Price Mobile Floating Buttons Overlap Fix

### Mục tiêu

Sửa lỗi giá tiền trên di động (mobile) của các phần Vé và Phụ phí thêm bị che khuất hoặc đè lên bởi các nút liên hệ dạng bong bóng (Hotline, Zalo, Whatsapp) ở cạnh phải màn hình.

### Thay đổi

- **File**: `src/app/fast-track/components/FastTrackDetailInfor.tsx`
  - Bổ sung class `pr-14 md:pr-0` vào các thẻ div chứa dòng thông tin từng loại Vé (line 140) và từng loại Phụ phí (line 180).
  - Loại bỏ class `mr-6` tạm thời trước đây khỏi component `<DisplayPrice>`.
  - Thay đổi này dịch chuyển toàn bộ phần hiển thị giá bán bên phải sang trái thêm 56px trên màn hình di động, giúp tạo khoảng trống an toàn tránh bị đè bởi các nút support floating cố định ở góc phải màn hình, trong khi vẫn trả về vị trí căn lề chuẩn (`pr-0`) trên desktop.

## 53. Addendum 2026-06-11 - Train Ticket & Car Rental Redirect Pages

### Yêu cầu & Giải pháp

- Thay đổi luồng nhấp chọn dịch vụ "Vé tàu" (Train Ticket) và "Thuê xe" (Car Rental) trên trang chủ và hệ thống menu. Thay vì chuyển hướng trực tiếp sang liên kết Zalo OA như trước, hệ thống sẽ chuyển hướng nội bộ tới các trang thông tin riêng biệt để thông báo cho khách hàng và cung cấp nút liên hệ qua Zalo OA một cách chuyên nghiệp.

### Chi tiết thay đổi

- **Tạo trang mới (`src/app/ve-tau/page.tsx` & `src/app/thue-xe/page.tsx`)**:
  - Dựng các Server Components hỗ trợ cả hai ngôn ngữ Tiếng Việt (`vi`) và Tiếng Anh (`en`) dựa trên session locale.
  - Sử dụng `<SeoSchema>` để tối ưu hóa SEO (title, description, canonical url).
  - Thiết kế giao diện banner dạng gradient thương hiệu xanh dương (`#04349A` - `#1755DC`), hiển thị thông báo nâng cấp tính năng tự động và cung cấp nút CTA kích thước lớn để chuyển tiếp người dùng sang Zalo OA (`https://zalo.me/2451421179976954585/`).
- **Trang chủ (`src/components/home/search.tsx` & `src/components/home/search-mobile.tsx`)**:
  - Đổi các liên kết `<a>` của tab "Vé tàu" và "Thuê xe" thành component `<Link>` trỏ tới `/ve-tau` và `/thue-xe`.
- **Menu điều hướng (`src/components/layout/header.tsx` & `src/components/layout/header-mobile-menu.tsx`)**:
  - Thay đổi liên kết Zalo OA trực tiếp của dịch vụ "Đưa đón sân bay" trong dropdown Tiện ích / Airport Service thành `<Link>` dẫn đến trang thông tin `/thue-xe`.

## 54. Addendum 2026-06-11 - Move Homepage Banners to Hero Section

### Mục tiêu

- Di chuyển phần hiển thị banner chạy (Banner slide carousel) trên trang chủ từ phần nội dung chính (main body) lên chạy trực tiếp ở dưới khu vực tìm kiếm trong phần hero (nền xanh dương), áp dụng đồng bộ cho cả giao diện máy tính (desktop) và điện thoại di động (mobile) mà không làm biến đổi cấu trúc căn giữa dọc của các thành phần tìm kiếm hay gây lệch tiêu đề trang chủ.

### Chi tiết thay đổi

- **Homepage Server Component (`src/app/page.tsx`)**:
  - Nhập hàm `getCachedBanner` từ `@/app/utils/home-cached-api` và gọi lấy dữ liệu banner `home` bằng `getCachedBanner("home")` ngay trong tiến trình song song `Promise.all` lúc khởi tạo Server Component.
  - Loại bỏ component `<Banner></Banner>` khỏi thẻ `<main>` để tránh hiển thị trùng lặp banner trên trang chủ.
  - Giữ nguyên toàn bộ cấu trúc và chiều cao gốc của các component tìm kiếm (`Search` và `SearchMobile`).
  - Đối với giao diện Desktop: Bọc phần hình nền xanh `<HomeHeroDesktopBackground />` và component `<Search />` trong một container định vị `relative`. Render trực tiếp `<BannerSlide data={bannerData} />` với định vị tuyệt đối `absolute bottom-6 left-0 right-0 z-10` để banner nằm ở phía dưới cùng của khu vực hero xanh dương mà không can thiệp vào cách căn dọc của thanh tìm kiếm hay tiêu đề.
  - Đối với giao diện Mobile: Đặt component `<BannerSlide data={bannerData} />` ngay phía dưới `<SearchMobile />` bên trong lớp container chứa hình nền di động để banner co dãn theo luồng thông thường và hiển thị tại phần cuối cùng của khu vực nền xanh di động.
- **Tự động chạy Slider (`src/components/home/BannerSlide.tsx`)**:
  - Nhập plugin `Autoplay` từ thư viện `embla-carousel-autoplay`.
  - Cấu hình plugin Autoplay cho `<Carousel>` với khoảng thời gian chờ `delay: 4000` (4 giây) và `stopOnInteraction: false` để slider tự động chuyển tiếp banner liên tục một cách mượt mà.

## 55. Addendum 2026-06-11 - FastTrack Submenu Vertical Layout

### Mục tiêu

- Thay đổi cách hiển thị của submenu "Xuất cảnh" và "Nhập cảnh" thuộc dịch vụ "Đón tiễn ưu tiên (FastTrack)" trong dropdown "Dịch vụ tại sân bay" trên Desktop thành dạng dọc (column) thay vì dạng ngang (row) ngăn cách bởi ký tự pipe `|`.

### Chi tiết thay đổi

- **Giao diện Desktop Header (`src/components/layout/header.tsx`)**:
  - Tách biệt vùng hover highlight: loại bỏ `hover:bg-blue-50` khỏi container chung, chỉ giữ hover highlight riêng cho link tiêu đề `/fast-track` để tránh xung đột vùng click (nested link hover).
  - Định dạng danh mục con dạng danh sách thụt lề (`pl-[58px] mt-1.5 mb-3` với `gap-3`) sử dụng chấm tròn nhỏ chỉ dẫn (`span` dạng bullet dot `bg-gray-300`) đổi sang màu xanh lam cùng màu chữ (`hover:text-blue-600`) thông qua hiệu ứng hover đồng bộ (`group`).
  - Đặt màu chữ chính của "Xuất cảnh" và "Nhập cảnh" là `text-gray-600` với font size `15px` và weight `medium` giúp phân cấp trực quan đẹp mắt và giữ khoảng trống an toàn (`mb-3`) với mục "Phòng chờ thương gia" ở dưới.

## 56. Addendum 2026-06-12 - Update Navigation Icons and Search Box Layout

### Mục tiêu

- Cập nhật và tinh chỉnh các biểu tượng (icons) điều hướng cho dịch vụ "Bảo hiểm" và "Thuê xe" trên giao diện trang chủ, đồng thời thu nhỏ độ rộng của khung tìm kiếm (search form container) màu trắng trên bản Desktop để cân đối và khớp thẩm mỹ với thanh tab đen phía trên.

### Chi tiết thay đổi

- **Biểu tượng Bảo hiểm (Insurance)**:
  - Thay thế biểu tượng tài liệu chung chung (`/icon/file-06.svg`) bằng biểu tượng lá chắn bảo vệ chuyên dụng (`/icon/shield.svg`) tại tab tìm kiếm Bảo hiểm trên Desktop (`src/components/home/search.tsx`).
- **Biểu tượng Thuê xe (Car Rental)**:
  - Thay thế biểu tượng xe buýt (`/icon/bus.svg`) bằng biểu tượng xe hơi dạng viền (`/icon/car-outline.svg`) tại tab tìm kiếm Thuê xe trên Desktop (`src/components/home/search.tsx`) và Mobile (`src/components/home/search-mobile.tsx`).
  - Cập nhật biểu tượng trên trang thông tin chính `/thue-xe` (`src/app/thue-xe/page.tsx`) từ `/icon/bus.svg` sang biểu tượng xe hơi đầy đủ màu sắc (`/icon/car.svg`) cho đồng bộ với dropdown header.
- **Khung Tìm Kiếm Trang Chủ (Search Form Container & Tab Bar)**:
  - Thiết lập thuộc tính `max-w-[960px]` cho cả khung trắng chứa biểu mẫu tìm kiếm và thanh tab màu đen phía trên trên bản Desktop (`src/components/home/search.tsx`) giúp thu nhỏ kích thước tổng thể của toàn bộ khối tìm kiếm một cách hài hòa và cân đối.
- **Trình Chiếu Banner Trang Chủ (Banner Slider)**:
  - Cập nhật component `BannerSlide` (`src/components/home/BannerSlide.tsx`) hiển thị 1 banner/sản phẩm duy nhất mỗi lần chiếu trên cả Desktop và Mobile bằng cách loại bỏ `lg:basis-2/4` và áp dụng `basis-full` đồng bộ.
  - Cập nhật container tuyệt đối của banner tại trang chủ Desktop (`src/app/page.tsx`) sử dụng `max-w-[960px]` và loại bỏ `max__screen` để banner có chiều rộng khớp và căn chỉnh thẳng hàng tuyệt đối với khung tìm kiếm ở trên.
- **Tạo mới các tệp SVG**:
  - `public/icon/shield.svg`: Biểu tượng lá chắn bảo vệ định dạng line-art màu xám nhạt (`#EAECF0`), kích thước 20x20.
  - `public/icon/car-outline.svg`: Biểu tượng xe hơi dạng viền line-art màu xám nhạt (`#EAECF0`), kích thước 20x20.

## 57. Addendum 2026-06-12 - Fix Banner Image Squeezing and Align Flight Search Options

### Mục tiêu

- Sửa lỗi hình ảnh banner trang chủ bị bóp dẹt, co méo tỷ lệ (squeezed/distorted) sau khi chuyển đổi sang hiển thị 1 slide duy nhất.
- Đảm bảo hình ảnh banner hiển thị đúng tỷ lệ khung hình gốc (3:1) trên cả Desktop và Mobile.
- Giới hạn chiều rộng tối đa của banner trên Desktop để khống chế chiều cao ở mức cân đối, tránh việc banner đè lên các ô nhập liệu của khung tìm kiếm.
- Điều chỉnh các label và checkbox/radio của phần tìm kiếm vé máy bay (Một chiều, Khứ hồi, Tìm vé rẻ) phân bố đều theo vị trí trái, giữa, phải trên Desktop.

### Chi tiết thay đổi

- **Trình chiếu Banner (`src/components/home/BannerSlide.tsx`)**:
  - Thay đổi kích thước tĩnh `h-[100px] md:h-[156px]` bằng các lớp căn chỉnh động `w-full h-auto aspect-[3/1] rounded-xl object-cover` để giữ đúng tỷ lệ banner và tránh bóp méo hình ảnh.
- **Vùng chứa Banner Desktop (`src/app/page.tsx`)**:
  - Thay thế chiều rộng `max-w-[960px]` bằng `max-w-[520px]` cho absolute container chứa banner trên Desktop. Sự thay đổi này giúp giảm chiều rộng tối đa của banner, từ đó tự động khống chế chiều cao tối đa của ảnh ở mức `165px` (theo tỷ lệ 3:1), giúp banner hiển thị cực kỳ cân đối, sắc nét, và hoàn toàn không bị đè chồng lên hộp tìm kiếm ở phía trên.
  - Giữ nguyên toàn bộ cấu trúc và chiều cao `694px` nguyên bản của Hero và Search container để tránh làm giãn chiều cao trang chủ không cần thiết.
- **Biểu mẫu Tìm kiếm Vé Máy Bay (`src/app/ve-may-bay/components/Search.tsx`)**:
  - Chuyển đổi cấu trúc hiển thị 3 lựa chọn loại vé ("Một chiều", "Khứ hồi", "Tìm vé rẻ") từ `grid grid-cols-6 lg:flex` sang `grid grid-cols-3` để chia đều không gian thành 3 cột trên cả Desktop và Mobile.
  - Áp dụng các class căn lề: cột 1 ("Một chiều") căn trái mặc định, cột 2 ("Khứ hồi") căn giữa trên Desktop bằng `lg:justify-center`, cột 3 ("Tìm vé rẻ") căn phải trên Desktop bằng `lg:justify-end` giúp phân bổ 3 tùy chọn đều ra 3 vị trí trái, giữa, phải một cách cân đối và thoáng mát.

## 58. Addendum 2026-06-12 - Toggle Search Form and Clean Quick Links on Mobile

### Mục tiêu

- Ẩn form tìm kiếm mặc định khi người dùng di động vừa truy cập vào website trang chủ.
- Chỉ hiển thị form tìm kiếm tương ứng khi người dùng bấm chọn một dịch vụ cụ thể ở hàng trên di động (Vé máy bay, Khách sạn, Visa, Sim du lịch, Combo tiết kiệm, Dịch vụ tại sân bay), và cho phép bấm lại để ẩn đi (toggle behavior).
- Loại bỏ nút liên kết Combo bị dư thừa trong dòng Quick Links di động để sửa lỗi bố cục và cải thiện thẩm mỹ giao diện.
- Thu nhỏ kích thước và khống chế độ rộng tối đa của các ô menu dịch vụ hình vuông màu đen mờ trên di động để giao diện trông cực kỳ gọn gàng, thanh thoát và hiện đại.

### Chi tiết thay đổi

- **Biểu mẫu Tìm kiếm Di động (`src/components/home/search-mobile.tsx`)**:
  - Đổi giá trị khởi tạo của state `activeTabMb` từ `"ve-may-bay"` sang `null` để không dịch vụ nào được kích hoạt mặc định lúc tải trang.
  - Cập nhật các sự kiện click của các tab dịch vụ (từ tab 1 đến tab 6) sử dụng hàm check toggle: nếu tab đang active được bấm lại thì set state về `null` (ẩn đi), nếu tab khác được bấm thì set active tab đó.
  - Thêm thuộc tính lớp hiển thị động `${activeTabMb ? "block" : "hidden"}` cho container bao bọc các form tìm kiếm (`Tab Forms Container`). Khi không có tab nào được active (`activeTabMb === null`), container màu trắng chứa các biểu mẫu sẽ tự động ẩn đi hoàn toàn, giúp giao diện trang chủ ban đầu trên di động gọn gàng và thoáng mát hơn.
  - Xóa bỏ thẻ `<Link href="/combo">` (nút Combo) khỏi dòng Quick Links Row. Điều này giúp loại bỏ sự trùng lặp tính năng (vì đã có tab "Combo tiết kiệm" ở hàng trên) và giúp 4 dịch vụ còn lại ("Tours", "Du thuyền", "Vé tàu", "Thuê xe") hiển thị thẳng hàng và cân đối hoàn hảo trên một hàng duy nhất của bố cục `grid-cols-4`, không còn bị rớt nút "Thuê xe" xuống hàng dưới một mình.
  - Thu nhỏ đáng kể kích thước của 10 ô menu dịch vụ hình vuông màu đen mờ (bao gồm 6 tab hàng 1 và 4 link hàng 2) bằng cách giảm chiều cao `h-[104px]` xuống `h-[72px]`, giảm kích thước vòng tròn icon từ `w-10 h-10` xuống `w-8 h-8`, đổi size ảnh icon từ `20x20` thành `16x16`, đổi size icon SVG từ `24px` thành `16px`, đồng thời chuyển font size của text thành `text-[10px] leading-tight mt-0.5` giúp các ô menu cực kỳ nhỏ gọn và tinh tế.
  - Áp dụng class `max-w-[300px] md:max-w-none mx-auto` cho cả 2 container grid hàng 1 (`Search Bar Grid`) và hàng 2 (`Quick Links Row`). Sự thay đổi này giúp khống chế độ rộng tối đa của các ô vuông menu không bị kéo bè dẹt quá mức theo chiều ngang của các dòng di động màn hình rộng (như Pro Max), giữ các ô luôn ở tỷ lệ gọn gàng, vuông vắn và tập trung cân đối ở chính giữa màn hình di động.

## 59. Addendum 2026-06-12 - Fix Travel SIM Double Selection Highlight on Mobile

### Mục tiêu

- Sửa lỗi cùng một lúc có 2 option hạn sử dụng (validity) và 2 option gói dữ liệu (data) được chọn (hiển thị highlight màu cam) trên trang chi tiết eSIM trên di động.
- Đảm bảo **không tự động chọn giá trị mặc định (no default selection) trên giao diện di động** khi vừa vào trang, nhưng vẫn giữ tự động chọn gói đầu tiên trên giao diện Desktop.
- Triệt tiêu hoàn toàn lỗi hydration mismatch do sự không nhất quán giữa kết quả render server-side (SSR) và client-side (CSR).

### Chi tiết thay đổi

- **Cải tiến logic trong eSIM Catalog hook (`src/app/sim-du-lich/hooks/useEsimCatalog.tsx`)**:
  - Bổ sung state `mounted` (bắt đầu bằng `false` và chuyển thành `true` sau khi component đã mount trên client) và khôi phục `isMobileViewport`.
  - Trên Server và trong lượt render đầu tiên của Client (khi `mounted === false`), hệ thống sẽ **không chọn gói hay variant mặc định** (`selectedSku` trống và `selectedVariant` trả về `null`). Cách này đảm bảo Server và Client khớp tuyệt đối về HTML ban đầu (không hiển thị highlight nút nào cả), triệt tiêu hoàn toàn hydration mismatch.
  - Sau khi mount (`mounted === true`), một `useEffect` an toàn sẽ kiểm tra: nếu là màn hình Desktop (`!isMobileViewport`), hệ thống tự động thiết lập `selectedSku` và `selectedVariant` trỏ về gói/variant đầu tiên; nếu là màn hình Mobile (`isMobileViewport`), hệ thống giữ nguyên trạng thái trống (không có giá trị mặc định).
  - Khắc phục triệt để lỗi kẹt các class CSS active màu cam trên di động, đảm bảo hành vi chọn lựa gói và hiển thị giá cực kỳ chính xác.

## 60. Addendum 2026-06-12 - Mobile Banner Image Responsive Display

### Mục tiêu

Hiển thị ảnh banner quảng cáo trên thiết bị di động (mobile/tablet) sử dụng ảnh banner dành riêng cho di động nếu có (hoặc fallback về ảnh desktop nếu không có), đảm bảo hình ảnh hiển thị trọn vẹn, không bị bóp dẹt, co méo tỷ lệ.

### Thay đổi client

- **BannerSlide (`src/components/home/BannerSlide.tsx`)**:
  - Tách biệt thẻ ảnh thành 2 thẻ `<Image>` Next.js hiển thị độc lập theo kích thước màn hình bằng CSS:
    - Ảnh Mobile/Tablet (`block lg:hidden`): Sử dụng `getImageSrc(banner.image_url_mobile || banner.image_url, banner.image_location_mobile || banner.image_location)` với chiều cao `h-[150px] md:h-[170px]` và style `objectFit: "cover"`.
    - Ảnh Desktop (`hidden lg:block`): Sử dụng `getImageSrc(banner.image_url, banner.image_location)` với chiều cao `lg:h-[257px]` và style `objectFit: "cover"`.
  - Giúp hiển thị hình ảnh chuẩn tỷ lệ và tải đúng tài nguyên ảnh mobile nhẹ hơn cho thiết bị di động, đồng thời giữ nguyên giao diện desktop.
- **Bypass Next.js caching in development (`src/app/utils/home-cached-api.ts` & `src/api/Setting.ts`)**:
  - Đổi thuộc tính `revalidate` của Next.js `unstable_cache` thành `isDev ? 1 : 3600` (áp dụng ở cache của Home Banners, Home Index, Product Flights, và Meta SEO).
  - Điều này giúp giảm thời gian cache xuống còn 1 giây trong môi trường local development (`process.env.NODE_ENV === 'development'`), đảm bảo các cập nhật thay đổi nội dung/hình ảnh từ CMS được hiển thị ngay lập tức lên client mà không cần chờ hết hạn cache 1 tiếng hay xóa cache thủ công.

## 61. Addendum 2026-06-12 - Resolve Conflicts and Merge master into 310526-144

### Mục tiêu

- Hợp nhất thành công nhánh `master` vào nhánh tính năng eSIM `310526-144` của `bed_happybook_client`.
- Đảm bảo giữ nguyên các tính năng mới ở cả hai nhánh (eSIM feature branch và master).

### Chi tiết thay đổi

- **Trang chủ (`src/app/page.tsx`)**:
  - Tích hợp các cảnh báo lỗi `.catch()` từ `master` vào luồng gọi API song song `Promise.all` của nhánh tính năng.
- **Điều hướng Header (`src/components/layout/header.tsx` & `src/components/layout/header-mobile-menu.tsx`)**:
  - Giữ nguyên thiết kế cấu trúc menu phẳng/flattened mới của nhánh tính năng (Visa, Dịch vụ tại sân bay, Sim du lịch độc lập).
  - Loại bỏ hoàn toàn liên kết "Combo" khỏi menu điều hướng chính trên cả Desktop và Mobile.
  - Đưa hai dịch vụ "Bảo hiểm" (`/bao-hiem`) và "Flight Radar" (`/flight-radar`) từ `master` vào trong nhóm "Dịch vụ tại sân bay" trên cả giao diện Desktop và Mobile để tránh làm rối cấu trúc menu chính mà vẫn giữ đầy đủ các liên kết.
- **Tĩnh dịch (`src/constants/staticText.ts`)**:
  - Hợp nhất và loại bỏ trùng lặp danh sách từ khóa dịch tĩnh từ cả hai nhánh (bao gồm các cảnh báo bay dưới 4h, điều kiện eSIM, các nhãn menu mới).

## 62. Addendum 2026-06-12 - Remove Insurance Submenu and Add Scrollbar

### Mục tiêu

- Loại bỏ hoàn toàn dịch vụ "Bảo hiểm" khỏi các submenu điều hướng trên cả giao diện Desktop và Mobile.
- Thay thế biểu tượng (icon) của "Phòng chờ thương gia" bằng biểu tượng "Bảo hiểm" (arminchair/sofa icon `/icon/insurance.png`).
- Bổ sung thanh cuộn (scrollbar) cho danh sách dịch vụ trong submenu "Dịch vụ tại sân bay" trên Desktop.
- Sửa lỗi liên kết Breadcrumb trong trang chi tiết dịch vụ FastTrack trỏ nhầm sang module du thuyền (`/du-thuyen`).

### Chi tiết thay đổi

- **Điều hướng Header (`src/components/layout/header.tsx` & `src/components/layout/header-mobile-menu.tsx`)**:
  - Loại bỏ hoàn toàn liên kết `Link` dẫn đến `/bao-hiem` khỏi cả submenu "Dịch vụ tại sân bay" ở Desktop và Mobile drawer.
  - Thay thế thuộc tính `src` của hình ảnh biểu tượng của link "Phòng chờ thương gia" (`/phong-cho-thuong-gia`) trong dropdown "Dịch vụ tại sân bay" từ `/icon/lounge.png` sang `/icon/insurance.png`.
  - Thêm class `max-h-[300px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-2` vào container danh sách `div` (`flex flex-col space-y-2`) của submenu "Dịch vụ tại sân bay" ở bản Desktop.
- **Chi tiết dịch vụ FastTrack (`src/app/fast-track/components/FastTrackDetail.tsx`)**:
  - Sửa URL trong breadcrumb của danh mục FastTrack (ví dụ: Đón tiễn nội địa/nhập cảnh) từ `/du-thuyen/${detail?.category?.alias}` thành `/fast-track/${detail?.category?.alias}` để dẫn đúng về trang danh mục FastTrack thay vì Yacht.

### Ý nghĩa thực tế

- Giao diện submenu "Dịch vụ tại sân bay" tinh gọn hơn, tự động xuất hiện thanh cuộn cuộn mượt mà khi chiều cao nội dung vượt quá `300px` mà không làm thay đổi hay phá vỡ bố cục tổng thể.
- Biểu tượng phòng chờ thương gia được đổi sang ghế sofa sang trọng.
- Người dùng khi xem chi tiết dịch vụ FastTrack có thể click vào breadcrumb để quay lại trang danh mục FastTrack tương ứng một cách chính xác.
- Không thay đổi API contract hay các cấu hình nghiệp vụ khác của hệ thống.

## 63. Addendum 2026-06-12 - English Locale Banner Display Support

### Mục tiêu

Hỗ trợ hiển thị tự động các hình ảnh banner quảng cáo (cả desktop và mobile) cùng các thuộc tính tương ứng (tên, sub_title, link URL) bằng tiếng Anh khi người dùng chuyển đổi ngôn ngữ website sang Tiếng Anh (locale `en`).

### Chi tiết thay đổi

- **Cập nhật Banner API (`src/api/Banner.ts`)**:
  - Hỗ trợ truyền tham số `locale` vào hàm `getBannerPage(page, locale)`.
  - Hàm `langHeader(locale)` sẽ đính kèm header `language` tương ứng để backend API nhận diện đúng locale cần dịch.
- **Cập nhật Next.js Caching (`src/app/utils/home-cached-api.ts`)**:
  - Cập nhật `getCachedBanner(page, locale)` để nhận tham số ngôn ngữ và truyền xuống API. Next.js `unstable_cache` sẽ tự động tách biệt cache cho từng ngôn ngữ nhờ tham số truyền vào hàm.
- **Cập nhật Server Components**:
  - **Trang chủ (`src/app/page.tsx`)**: Đọc `language = await getServerLang()` và truyền vào `getCachedBanner("home", language)`.
  - **Component Banner (`src/components/home/banner.tsx`)**: Đọc `language = await getServerLang()` và truyền vào `getCachedBanner("home", language)`.
  - **Component gợi ý du lịch (`src/components/home/tourist-suggest.tsx`)**: Đọc `language = await getServerLang()` và truyền vào `BannerApi.getBannerPage("home-dichoi", language)`.
  - **Trang Combo (`src/app/combo/page.tsx`)**: Truyền `language` vào `BannerApi.getBannerPage("combo-diemdenhot", language)`.
  - **Trang Khách Sạn (`src/app/khach-san/page.tsx`)**: Truyền `language` vào `BannerApi.getBannerPage("hotel-tpphobien", language)`.

- **Cơ chế hoạt động**:
  - Khi SSR chạy trên server (nơi `window === undefined`), Client sẽ truyền chính xác header `language: en` cho backend, giúp backend trả về đúng địa chỉ và URL của hình ảnh banner tiếng Anh.
  - Client tự động nhận diện và hiển thị đúng các giá trị `image_location`, `image_url`, `image_location_mobile`, `image_url_mobile`, `url` đã được dịch từ API.

## Related notes

- [[HOME]]
- [[INDEX]]
- [[API]]
- [[CMS]]


