import Image from "next/image";
import styles from "@/styles/styles.module.scss";

export default function AboutUs() {
  return (
    <main className="bg-white mt-[118px]">
      <div className="px-[80px] pt-3">
        <div>
          <Image
            priority
            src="/about-us/banner.svg"
            alt="Happy Book Logo"
            width={100}
            height={100}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="mt-8">
          <p className="text-black text-center font-bold text-2xl">
            HappyBook tự hào là đối tác tin cậy
          </p>
          <p className="font-medium text-black-700 text-center w-[836px] mx-auto mt-3">
            HappyBook luôn đặt chữ TÍN lên hàng đầu. Với sự phát triển không
            ngừng, chúng tôi đã xây dựng một đội ngũ chuyên viên năng động, giàu
            kinh nghiệm và luôn tận tâm phục vụ quý khách. Sự hài lòng của khách
            hàng là kim chỉ nam cho mọi hoạt động của chúng tôi.
          </p>
        </div>
        <div className="mt-12">
          <Image
            priority
            src="/about-us/members.svg"
            alt="Happy Book Logo"
            width={100}
            height={100}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="mt-12 grid grid-cols-2 items-center gap-16">
          <div>
            <h4 className="text-black font-bold text-2xl">
              10 năm hình thành và phát triển
            </h4>
            <p className="font-medium">
              HappyBook đã khẳng định vị thế của mình là đại lý cấp 1 chuyên
              cung cấp vé máy bay trong nước và quốc tế. Chúng tôi hiện là đối
              tác uy tín của nhiều hãng hàng không lớn tại Việt Nam và trên thế
              giới, mang đến cho khách hàng những lựa chọn đa dạng và phù hợp
              nhất.
            </p>
          </div>
          <div>
            <Image
              priority
              src="/about-us/1.svg"
              alt="Happy Book Logo"
              width={100}
              height={100}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
