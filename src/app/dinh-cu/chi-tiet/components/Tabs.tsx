"use client";
import { useState, useRef, useEffect } from "react";
import "swiper/css";

export default function Tabs({ data }: any) {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTabWidth, setCurrentTabWidth] = useState(0);
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
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Tổng quan
          </h2>
          <div
            className="mt-4 text-base"
            dangerouslySetInnerHTML={{
              __html:
                data?.content_tim_hieu_visa ?? "Nội dung đang cập nhật...",
            }}
          ></div>
        </div>
        <div className="bg-white rounded-2xl p-6 mt-4">
          <h2 className="pl-2 border-l-4 mb-4 border-[#F27145] text-22 font-bold">
            Đối tượng thỏa điều kiện
          </h2>
          <div
            className="mt-4 text-base"
            dangerouslySetInnerHTML={{
              __html: data?.content_gia_dich_vu ?? "Nội dung đang cập nhật...",
            }}
          ></div>
        </div>
        {/* <div className="bg-white rounded-2xl p-6 mt-4">
          <h2 className="pl-2 border-l-4 mb-4 border-[#F27145] text-22 font-bold">
            Những lợI ích khi lấy thẻ xanh diện EB2 Advanced Degree / Eb3
            Professionals
          </h2>
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
        </div> */}
      </div>
    </div>
  );
}
