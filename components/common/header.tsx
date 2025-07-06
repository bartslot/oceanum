import Image from "next/image";

const Header = ({ children }) => {
  return (
    <nav className="w-full fixed top-0 py-8 select-none z-50 bg-gradient-to-b from-gray-900 to-transparent">
      <div className="flex justify-between section-container">
        <a href="#home" className="link">
          {/* <Image
            src="/logo/historyPortal.svg"
            alt="Logo HistoryPortal"
            width={98*2}
            height={65*2}
          /> */}
        </a>
        <div className="outer-menu relative">
          <input
            title="menu"
            aria-labelledby="menu"
            className="checkbox-toggle link absolute top-0 right-0 w-6 h-6 opacity-0"
            type="checkbox"
          />
          <div className="hamburger absolute top-0 right-0 w-6 h-6 flex items-center justify-center">
            <div className="relative flex-none w-full bg-white duration-300 flex items-center justify-center"></div>
          </div>
          {children}
        </div>
      </div>
    </nav>
  );
};

export default Header;
