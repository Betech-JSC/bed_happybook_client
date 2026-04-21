"use client";

import { useState, useEffect, useCallback } from "react";
import { X, User, Phone } from "lucide-react";
import s from "@/styles/esim.module.scss";

interface Props {
  initialName: string;
  initialPhone: string;
  onSave: (name: string, phone: string) => void;
  onClose: () => void;
}

export default function ContactSlideOver({
  initialName,
  initialPhone,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = useCallback(() => {
    let valid = true;

    if (!name.trim()) {
      setNameError("Vui lòng nhập họ tên");
      valid = false;
    } else {
      setNameError("");
    }

    if (!phone.trim()) {
      setPhoneError("Vui lòng nhập số điện thoại");
      valid = false;
    } else if (!/^[0-9+\-\s()]{8,15}$/.test(phone.trim())) {
      setPhoneError("Số điện thoại không hợp lệ");
      valid = false;
    } else {
      setPhoneError("");
    }

    if (valid) {
      onSave(name.trim(), phone.trim());
    }
  }, [name, phone, onSave]);

  return (
    <>
      <div className={s.slideOverlay} onClick={onClose} />
      <div className={s.slidePanel}>
        <div className={s.slideHeader}>
          <h2>Thêm thông tin liên lạc</h2>
          <button type="button" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        <div className={s.slideBody}>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#64748b",
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            Thông tin liên lạc sẽ được sử dụng trong trường hợp cần hỗ trợ kỹ
            thuật hoặc xử lý sự cố với eSIM của bạn.
          </p>

          <div className={s.formGroup}>
            <label>
              <User
                size={14}
                style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }}
              />
              Họ và tên <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
              }}
              placeholder="Ví dụ: Nguyen Van A"
              className={nameError ? s.inputError : ""}
            />
            {nameError && <div className={s.errorText}>{nameError}</div>}
          </div>

          <div className={s.formGroup}>
            <label>
              <Phone
                size={14}
                style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }}
              />
              Số điện thoại <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (phoneError) setPhoneError("");
              }}
              placeholder="Ví dụ: 0909 123 456"
              className={phoneError ? s.inputError : ""}
            />
            {phoneError && <div className={s.errorText}>{phoneError}</div>}
          </div>
        </div>

        <div className={s.slideFooter}>
          <button type="button" className={s.btnPrimary} onClick={handleSave}>
            Lưu thông tin
          </button>
          <button
            type="button"
            className={s.btnSecondary}
            onClick={onClose}
            style={{ marginTop: 8 }}
          >
            Huỷ bỏ
          </button>
        </div>
      </div>
    </>
  );
}
