"use client";
import { UserInfoType } from "@/types/UserInfo";
import { createContext, useContext, useState } from "react";

interface UserContextType {
  userInfo: UserInfoType | undefined;
  setUserInfo: (user: UserInfoType | undefined) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserInfoType | undefined;
}) => {
  const [userInfo, setUserInfo] = useState<UserInfoType | undefined>(
    initialUser
  );

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
