import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiDollarSign, FiFileText, FiHome, FiLogOut, FiUser, FiUsers } from "react-icons/fi";

import { useAuth } from "contexts/AuthContext";

import Logo from "../../public/logo2.png";

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useAuth();
  const currentPath = router.pathname;
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-blue-900 text-secondary flex flex-col">
      <div className="flex-1">
        <div className="flex justify-center">
          <Image src={Logo} alt="logo" width={80} />
        </div>
        <nav className="">
          <ul>
            <li>
              <Link
                href="/"
                className={`flex items-center p-4 hover:bg-white hover:text-blue-800 ${
                  currentPath === "/" ? "bg-white text-blue-800" : ""
                }`}
              >
                <FiHome className="mr-3" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/processes"
                className={`flex items-center p-4 hover:bg-white hover:text-blue-800 ${
                  currentPath === "/processes" ||
                  currentPath === "/processes/create" ||
                  currentPath === "/processes/edit/[id]"
                    ? "bg-white text-blue-800"
                    : ""
                }`}
              >
                <FiFileText className="mr-3" />
                <span>Processos</span>
              </Link>
            </li>
            
            <li>
              <Link
                href="/customers"
                className={`flex items-center p-4 hover:bg-white hover:text-blue-800 ${
                  currentPath === "/customers" ||
                  currentPath === "/customers/create" ||
                  currentPath === "/customers/edit/[id]"
                    ? "bg-white text-blue-800"
                    : ""
                }`}
              >
                <FiUsers className="mr-3" />
                <span>Clientes</span>
              </Link>
            </li>
            {user.role === "ADMIN" && (
              <li>
                <Link
                  href="/users"
                  className={`flex items-center p-4 hover:bg-white hover:text-blue-800  ${
                    currentPath === "/users" ||
                    currentPath === "/users/create" ||
                    currentPath === "/users/edit/[id]"
                      ? "bg-white text-blue-800"
                      : ""
                  }`}
                >
                  <FiUser className="mr-3" />
                  <span>Usuários</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-4  text-left"
        >
          <FiLogOut className="mr-3" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
