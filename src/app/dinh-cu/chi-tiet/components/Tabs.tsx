"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const tabsContent = [
  { title: "Tab 1", content: "Nội dung tab 1" },
  { title: "Tab 2", content: "Nội dung tab 2" },
  { title: "Tab 3", content: "Nội dung tab 3" },
  { title: "Tab 4", content: "Nội dung tab 4" },
  { title: "Tab 5", content: "Nội dung tab 5" },
];
export default function Tabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTabWidth, setCurrentTabWidth] = useState(0);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [openDropdown, setOpenDropdown] = useState(1);
  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? 0 : id);
  };

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      setCurrentTabWidth(tabRefs.current[activeTab].offsetWidth);
    }
  }, [activeTab]);

  return (
    <div className="w-full mt-6">
      <div className="mt-4 transition-all duration-300">
        <div className="bg-white rounded-2xl p-6">
          <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Tổng quan
          </h3>
          <p className="mt-4 text-22 font-bold">
            DIỆN EB2 ADVANCED DEGREE / DIỆN EB3 PROFESSIONALS LÀ GÌ?
          </p>
          <p className="mt-4">
            B2 Advanced Degree (Bằng Cấp Cao) và EB3 Professionals (Chuyên Gia)
            là hai chương trình định cư Mỹ theo diện việc làm:
          </p>
          <ul className="mt-4 list-disc pl-5">
            <li>
              EB2 Advanced Degree: là chương trình định cư Mỹ cho phép những cá
              nhân có bằng Cử nhân (với tối thiểu 5 năm kinh nghiệm làm việc
              liên quan đến chuyên ngành), Thạc sĩ, Tiến sĩ làm việc và sinh
              sống lâu dài tại Mỹ.
            </li>
            <li>
              EB3 Professionals: là thị thực định cư và làm việc tại Mỹ dành cho
              người có học vị từ Cử nhân trở lên (không yêu cầu kinh nghiệm làm
              việc).
            </li>
          </ul>
          <p className="mt-4">
            Khi làm hồ sơ theo hai diện này, đương đơn có cơ hội đến Mỹ làm việc
            và trở thành thường trú nhân Hoa Kỳ.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 mt-4">
          <h3 className="pl-2 border-l-4 mb-4 border-[#F27145] text-22 font-bold">
            Đối tượng thỏa điều kiện
          </h3>
          <div>
            <p className="text-18 font-semibold">
              ĐỐI TƯỢNG THỎA ĐIỀU KIỆN EB-2 ADVANCED DEGREE
            </p>
            <ul className="mt-4 list-disc pl-5">
              <li>Điều kiện học vấn: Cử nhân, Thạc sĩ, hoặc Tiến sĩ</li>
              <li>
                Văn bằng nước ngoài được Cơ quan Giám định Bằng cấp Hoa Kỳ chứng
                thực
              </li>
              <li>
                Cử nhân phải có tối thiểu 5 năm kinh nghiệm làm việc trong lĩnh
                vực liên quan đến chuyên ngành
              </li>
              <li>
                Có nhà tuyển dụng tại Mỹ sẵn sàng bảo lãnh công việc đúng chuyên
                môn.
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-18 font-semibold">
              ĐỐI TƯỢNG THỎA ĐIỀU KIỆN EB-3 PROFESSIONALS
            </p>
            <ul className="mt-4 list-disc pl-5">
              <li>Điều kiện học vấn: Cử nhân, Thạc sĩ, hoặc Tiến sĩ</li>
              <li>
                Văn bằng nước ngoài được Cơ quan Giám định Bằng cấp Hoa Kỳ chứng
                thực
              </li>
              <li>
                Có nhà tuyển dụng tại Mỹ sẵn sàng bảo lãnh công việc đúng chuyên
                môn.
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 mt-4">
          <h3 className="pl-2 border-l-4 mb-4 border-[#F27145] text-22 font-bold">
            Những lợI ích khi lấy thẻ xanh diện EB2 Advanced Degree / Eb3
            Professionals
          </h3>
          <div>
            <ul className="mt-4 list-disc pl-5">
              <li>
                Đương đơn lấy Thẻ xanh Mỹ vĩnh viễn và được làm việc tại Mỹ theo
                đúng chuyên môn.
              </li>
              <li>Thẻ xanh vĩnh viễn thời hạn 10 năm.</li>
              <li>
                Có thể bảo lãnh thành viên gia đình trực hệ (vợ/chồng và con cái
                độc thân dưới 21 tuổi) cùng nhận Thẻ xanh với chi phí không đổi.
              </li>
              <li>
                Được hưởng mọi quyền lợi từ chính phủ như công dân Mỹ (trừ quyền
                bầu cử).
              </li>
              <li>
                Được hưởng các phúc lợi An Sinh Xã Hội khi về hưu (yêu cầu 10
                năm làm việc).
              </li>
              <li>Đủ điều kiện đăng ký nhập quốc tịch Mỹ sau 5 năm cư trú.</li>
              <li>
                Con cái của người có Thẻ xanh được hưởng một số quyền lợi sau:
                <ul className="list-disc pl-5">
                  <li>
                    Học tập miễn phí tại trường công Mỹ đến hết bậc trung học
                    phổ thông.
                  </li>
                  <li>Học phí đại học thấp hơn.</li>
                  <li>
                    Được tiếp tục sinh sống và làm việc tại Mỹ sau khi tốt
                    nghiệp mà không cần lo lắng về việc gia hạn visa (thị thực).
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
