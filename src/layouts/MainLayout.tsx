import HeaderMenu from "@/components/shared/HeaderMenu";

export default function MianLayout({ children }) {
  return (
    <div
      style={{ direction: "rtl", fontFamily: "IranSans" }}
      className="flex h-screen"
    >
      <HeaderMenu />
      <div className={`flex-1 flex flex-col transition-all duration-300  `}>
        <main className="">{children}</main>
      </div>
    </div>
  );
}
