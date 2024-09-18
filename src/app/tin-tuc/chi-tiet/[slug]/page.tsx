import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import Post from "@/styles/posts.module.scss";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RelatedPosts from "./components/related-posts";
import TableOfContents from "./components/table-content";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Happy Book",
};
type categoryPosts = {
  category_name: string;
  slug: string;
  posts: post[];
}[];
type post = {
  title: string;
  image: string;
  date: string;
};
const arrPosts: categoryPosts = [
  {
    category_name: "Làm visa",
    slug: "lam-visa",
    posts: [
      {
        title: "Làm Visa Dubai",
        image: "/posts/visa/1.png",
        date: "22/08/2024",
      },
      {
        title: "Làm Visa Pháp",
        image: "/posts/visa/2.png",
        date: "22/08/2024",
      },
      {
        title: "Làm Visa Canada",
        image: "/posts/visa/3.png",
        date: "22/08/2024",
      },
    ],
  },
  {
    category_name: "Vé máy bay",
    slug: "lam-visa",
    posts: [
      {
        title: "Khi Nào Nên Mua Vé Máy Bay Đi Bắc Kinh Trung Quốc",
        image: "/posts/flight/1.png",
        date: "22/08/2024",
      },
      {
        title: "Vé Máy Bay Đi Trung Quốc",
        image: "/posts/flight/2.png",
        date: "22/08/2024",
      },
      {
        title: "Vé Máy Bay Đi Mỹ",
        image: "/posts/flight/3.png",
        date: "22/08/2024",
      },
    ],
  },
  {
    category_name: "Tin định cư",
    slug: "lam-visa",
    posts: [
      {
        title: "Chương Trình Định Cư Canada Theo Diện Tay Nghề Cao",
        image: "/posts/settle/1.png",
        date: "22/08/2024",
      },
      {
        title: "Chi Tiết Định Cư Canada Theo Diện Kết Hôn Mới Nhất",
        image: "/posts/settle/2.png",
        date: "22/08/2024",
      },
      {
        title: "Tổng Hợp Các Diện Bảo Lãnh Sang Canada Hiện Nay",
        image: "/posts/settle/3.png",
        date: "22/08/2024",
      },
    ],
  },
  {
    category_name: "Cẩm nang du lịch",
    slug: "lam-visa",
    posts: [
      {
        title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
        image: "/posts/travel/1.png",
        date: "22/08/2024",
      },
      {
        title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
        image: "/posts/travel/2.png",
        date: "22/08/2024",
      },
      {
        title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
        image: "/posts/travel/3.png",
        date: "22/08/2024",
      },
    ],
  },
];
const popopularPosts: post[] = [
  {
    title: "Vé Máy Bay Đi Trung Quốc",
    image: "/posts/popular/1.png",
    date: "22/08/2024",
  },
  {
    title: "Chương Trình Định Cư Canada Theo Diện Tay Nghề Cao",
    image: "/posts/popular/2.png",
    date: "22/08/2024",
  },
  {
    title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
    image: "/posts/popular/3.png",
    date: "22/08/2024",
  },
  {
    title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
    image: "/posts/popular/4.png",
    date: "22/08/2024",
  },
  {
    title: "Làm Visa Pháp",
    image: "/posts/popular/5.png",
    date: "22/08/2024",
  },
];
export default function Posts() {
  return (
    <main className="bg-white  pt-[68px] lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
      <div className="flex flex-col md:flex-row md:space-x-12 pt-3 mb-8">
        <div className="basis-full md:basis-[66%]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-blue-700">
                  Trang chủ
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/tin-tuc" className="text-blue-700">
                    Tin tức
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/tin-tuc/lam-visa" className="text-blue-700">
                    Làm VISA
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700">
                    Visa Đức
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="w-[78px] h-6 cursor-pointer bg-[#EFF8FF] py-[2px] px-2 rounded-sm hover:bg-blue-200 duration-300 mt-8">
            <p className="text-blue-700 text-sm font-medium">Làm visa</p>
          </div>
          <div className="post__detail mt-4">
            <div className="pb-8 border-b-[1px] border-gray-200">
              <h1 className="text-gray-900 text-32 font-bold">
                Hướng Dẫn Thủ Tục Xin Visa Đi Đức Thăm Thân Chi Tiết Cho Người
                Mới Bắt Đầu
              </h1>
              <div className="mt-6">
                <Image
                  className="ease-in duration-300"
                  src="/posts/detail/1.png"
                  alt="Tin tức"
                  width={810}
                  height={469}
                  style={{ width: "100%", height: "auto" }}
                />
                <p className="text-base text-gray-700 mt-6">
                  Xin visa đi Đức thăm thân là một trong những thủ tục phổ biến
                  cho những người muốn sang thăm gia đình, bạn bè ở Đức. Tuy
                  nhiên, quá trình xin visa có thể gây khó khăn nếu bạn chưa
                  biết cách chuẩn bị hồ sơ và thủ tục cần thiết. Bài viết dưới
                  đây của HappyBook Travel sẽ hướng dẫn bạn cách chuẩn bị thủ
                  tục xin visa đi Đức thăm thân một cách hiệu quả, giúp bạn tăng
                  tỷ lệ đậu và có chuyến thăm suôn sẻ.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <TableOfContents />
            </div>
            {/* Tmp */}
            <div className="mt-6 post__detail_content">
              <h3 className="text-2xl font-bold text-gray-900">
                Visa thăm thân Đức là gì?
              </h3>
              <p className="text-base text-gray-700 mt-6">
                Visa thăm thân Đức là loại thị thực ngắn hạn (thường gọi là visa
                Schengen) được cấp cho những người muốn đến Đức để thăm người
                thân, bạn bè hoặc người quen đang sinh sống và làm việc tại Đức.
                Đây là loại visa cho phép bạn lưu trú tại Đức với mục đích phi
                thương mại, không làm việc hay học tập lâu dài.
              </p>
              <p className="text-base text-gray-700 mt-4">
                Visa thăm thân thuộc diện visa ngắn hạn loại C, có thể được cấp
                với thời gian tối đa 90 ngày trong vòng 180 ngày. Với visa này,
                bạn không chỉ được phép lưu trú tại Đức mà còn có thể tự do di
                chuyển trong toàn bộ khu vực Schengen mà không cần xin thêm thị
                thực khác. Một số quốc gia thuộc khu vực Schengen bao gồm: Pháp,
                Ý, Tây Ban Nha, Bỉ, Hà Lan, Thụy Sĩ, Áo, Đan Mạch và một số quốc
                gia khác.
              </p>
              <h4 className="text-18 mt-6 font-semibold text-gray-900">
                Visa thăm thân Đức có thời hạn bao lâu?
              </h4>
              <p className="text-base text-gray-700 mt-6">
                Thời hạn của visa thăm thân Đức thông thường là 90 ngày. Tuy
                nhiên, bạn có thể xin visa với thời hạn lưu trú ngắn hơn hoặc
                dài hơn tùy thuộc vào kế hoạch du lịch của mình và điều kiện cụ
                thể của người mời và người xin visa. Nếu có lý do chính đáng,
                bạn có thể xin gia hạn visa sau khi nhập cảnh Đức, tuy nhiên,
                việc gia hạn visa thường rất khó khăn và yêu cầu phải có lý do
                đặc biệt.
              </p>
              <div className="mt-6">
                <Image
                  className="ease-in duration-300"
                  src="/posts/detail/2.png"
                  alt="Tin tức"
                  width={810}
                  height={480}
                  style={{ width: "100%", height: "auto" }}
                />
                <p className="mt-4 text-gray-500 text-sm">
                  Thời hạn hiệu lực sẽ được ghi rõ trên visa
                </p>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8">
                Thủ tục xin visa đi Đức thăm thân
              </h3>
              <p className="mt-6 text-base text-gray-700">
                Để xin visa đi Đức thăm thân, bạn cần chuẩn bị một bộ hồ sơ đầy
                đủ và nộp tại cơ quan lãnh sự Đức tại Việt Nam (Đại sứ quán Đức
                tại Hà Nội hoặc Tổng lãnh sự quán Đức tại TP.HCM). Quá trình
                chuẩn bị hồ sơ đòi hỏi sự cẩn thận và chính xác để đảm bảo rằng
                mọi giấy tờ được cung cấp đều hợp lệ và đầy đủ.
              </p>
              <p className="mt-6 text-color-primary text-base">
                &gt;&gt;&gt; Dịch vụ làm visa trọn gói tại HappyBook Travel
              </p>
              <p className="mt-6 text-sm text-gray-700">
                Hồ sơ xin visa thăm thân Đức bao gồm:
              </p>
              <p className="mt-6 text-base text-gray-700 font-semibold">
                Hộ chiếu:
              </p>
              <ul className="list-disc pl-3 mt-6">
                <li className="ml-2">
                  Hộ chiếu của bạn phải còn hạn ít nhất 6 tháng tính từ ngày bạn
                  dự định nhập cảnh vào Đức. Hộ chiếu phải có ít nhất 2 trang
                  trống để dán visa.
                </li>
                <li className="ml-2">
                  Nếu bạn có hộ chiếu cũ, hãy đính kèm bản sao của các trang có
                  dấu nhập cảnh, xuất cảnh và visa trước đó.
                </li>
              </ul>
              <p className="text-base mt-6">
                <span className="font-semibold">
                  Mẫu đơn xin cấp thị thực đi Đức:
                </span>{" "}
                Bạn cần điền đầy đủ và chính xác mẫu đơn xin visa đi Đức, ký
                tên. Mẫu đơn này có thể tải từ trang web chính thức của Đại sứ
                quán Đức. Thông tin trong đơn phải khớp với các giấy tờ khác
                trong hồ sơ.
              </p>
              <p className="text-base mt-6">
                <span className="font-semibold">Ảnh thẻ:</span> Bạn cần 2 ảnh
                thẻ kích thước 3.5×4.5cm, nền trắng, chụp không quá 6 tháng. Ảnh
                phải đáp ứng đúng yêu cầu về ánh sáng, kích thước khuôn mặt, và
                quy cách chụp theo quy định của Đại sứ quán Đức.
              </p>
              <p className="text-base mt-6">
                <span className="font-semibold">
                  Thư mời từ người thân ở Đức:
                </span>{" "}
                Thư mời phải có đầy đủ thông tin của người mời (họ tên, địa chỉ,
                nghề nghiệp, thông tin liên lạc), lý do mời, thời gian dự kiến
                lưu trú và kế hoạch chi tiết về chuyến thăm. Nếu người mời là
                công dân Đức hoặc cư trú hợp pháp tại Đức, họ cần đính kèm giấy
                tờ chứng minh tư cách pháp nhân, ví dụ như giấy chứng nhận cư
                trú, bản sao hộ chiếu hoặc thẻ cư trú của người mời.
              </p>
              <p className="text-base mt-6">
                <span className="font-semibold">Chứng minh tài chính:</span> Bạn
                cần cung cấp sao kê tài khoản ngân hàng trong 3 tháng gần nhất
                hoặc sổ tiết kiệm có giá trị đủ để trang trải chi phí sinh hoạt
                trong thời gian ở Đức. Đối với visa thăm thân, số dư tài khoản
                nên có ít nhất 100 triệu đồng hoặc tương đương.
              </p>
              <p className="text-base mt-6">
                <span className="font-semibold">
                  Chứng minh quan hệ gia đình:
                </span>{" "}
                Để chứng minh mối quan hệ giữa bạn và người mời, bạn cần nộp các
                giấy tờ như sổ hộ khẩu, giấy khai sinh, giấy đăng ký kết hôn
                (nếu là vợ/chồng) hoặc các giấy tờ tương đương.
              </p>
              <p className="text-base mt-6">
                <span className="font-semibold">Chứng minh công việc:</span> Nếu
                bạn đang làm việc, bạn cần cung cấp hợp đồng lao động, giấy xác
                nhận công việc hoặc quyết định nghỉ phép có chữ ký và dấu xác
                nhận của công ty. Nếu bạn là chủ doanh nghiệp, cần cung cấp giấy
                đăng ký kinh doanh và sao kê tài khoản công ty.
              </p>
              <p className="text-base mt-6">
                <span className="font-semibold">Bảo hiểm du lịch:</span> Bảo
                hiểm phải có giá trị chi trả tối thiểu 30.000 EUR và bao phủ
                toàn bộ khu vực Schengen. Bạn cần mua bảo hiểm phù hợp với thời
                gian lưu trú dự kiến tại Đức.
              </p>
              <p className="text-base mt-6">
                <span className="font-semibold">Vé máy bay khứ hồi</span> Để
                chứng minh ý định trở về Việt Nam sau khi kết thúc chuyến thăm,
                bạn nên đặt vé máy bay khứ hồi. Lưu ý rằng chỉ cần cung cấp bản
                sao đặt vé, không cần thanh toán trước.
              </p>
              <p className="text-base mt-6">
                <span className="font-semibold">
                  Lịch trình chi tiết chuyến đi:
                </span>{" "}
                Bạn nên chuẩn bị một lịch trình chi tiết cho chuyến đi, bao gồm
                thời gian, địa điểm bạn sẽ đến thăm và thông tin lưu trú (khách
                sạn, nhà của người thân…).
              </p>
              <div className="mt-6">
                <Image
                  className="ease-in duration-300"
                  src="/posts/detail/3.png"
                  alt="Tin tức"
                  width={810}
                  height={480}
                  style={{ width: "100%", height: "auto" }}
                />
                <p className="mt-4 text-gray-500 text-sm">
                  Xin visa Đức dễ dàng hơn với sự chuẩn bị đầy đủ
                </p>
              </div>
            </div>
            {/*  */}
            <div className="p-6 mt-8 border-l-4 border-[#4E6EB3] bg-[#F5FAFF] text-gray-900 rounded-r-xl">
              <p className="text-2xl font-bold ">Tổng kết</p>
              <p className="text-base mt-6">
                Thủ tục xin visa đi Đức thăm thân không phải là quá khó khăn nếu
                bạn biết cách chuẩn bị và làm theo đúng quy trình. Điều quan
                trọng là bạn cần chuẩn bị hồ sơ đầy đủ, chứng minh rõ ràng tài
                chính, mối quan hệ với người mời và có lịch trình chi tiết. Nếu
                gặp khó khăn trong quá trình xin visa, bạn có thể tìm đến dịch
                vụ hỗ trợ làm visa để được tư vấn kỹ hơn. Chúc bạn có chuyến
                thăm Đức vui vẻ và thành công!
              </p>
            </div>
          </div>
        </div>
        {/* Side bar */}
        <div className="hidden md:block basis-full md:basis-[34%]">
          <div className="p-6 border-t-4 border-blue-700 bg-gray-50 rounded-b-2xl">
            <p className="text-2xl font-bold">Chủ đề khác</p>
            <div>
              <Link
                href="/tin-tuc/lam-visa"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                Làm VISA
              </Link>
              <Link
                href="#"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                Vé máy bay
              </Link>
              <Link
                href="#"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                Tin định cư
              </Link>
              <Link
                href="#"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                Cẩm nang du lịch
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">Bài viết phổ biến</p>
            <div>
              {popopularPosts.map((post: post, key: number) => (
                <div
                  key={key}
                  className={`mt-3 flex space-x-3 items-center pb-3 border-b-[1px] border-gray-200 ${Post.post__item}`}
                >
                  <div className="basis-[35%]">
                    <div className="overflow-hidden rounded-sm">
                      <Image
                        className="ease-in duration-300"
                        src={post.image}
                        alt="Tin tức"
                        width={140}
                        height={100}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </div>
                  <div className="basis-[65%]">
                    <p
                      className={`text-base ease-in duration-300 font-semibold mt-3 line-clamp-2 ${Post.post__item_title}`}
                    >
                      {post.title}
                    </p>
                    <p className="text-sm mt-2">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Releted Posts */}
      <div className="mt-8">
        <h3 className="pl-2 border-l-4 border-[#F27145] text-3xl font-bold">
          Các bài viết liên quan
        </h3>
        <div className="my-8">
          <RelatedPosts />
        </div>
      </div>
    </main>
  );
}
