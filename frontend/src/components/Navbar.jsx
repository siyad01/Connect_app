/* eslint-disable react/prop-types */
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  FaHome,
  FaUsers,

  FaCommentDots,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import { Fragment, useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserData } from "../context/userContext";
import axios from "axios";

const navigation = [
  { name: "Home", href: "/feed", icon: FaHome },
  { name: "My Network", href: "/my-network", icon: FaUsers },
  { name: "Messaging", href: "/messaging", icon: FaCommentDots },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// eslint-disable-next-line react/prop-types
export default function Navbar({ user }) {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  //const [connectionRequests, setConnectionRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  const [searchResults, setSearchResults] = useState([]);

  const fetchUsers = async (query) => {
 

    if (!query) return; // Do nothing if query is empty

    try {
      const response = await axios.get("/api/user/search", {
        params: { query },
      });

      setSearchResults(response.data);
      if (!response.ok) {
        throw new Error("error fetching users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchVisible(true);
    fetchUsers(query); // Fetch users whenever the search query changes
  };

  const handleSearchBlur = () => {
    setTimeout(() => setSearchVisible(false), 400);
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/${user._id}`);
      const data = await response.json();

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      toast.success(data.message);
      //navigate("/login");
      setIsAuth(false);
      setUser([]);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const [inputShow, SetInputShow] = useState(false);
  const handleInputClick = () => {
    SetInputShow(true);
  };
  const isProfileActive = location.pathname === "/account";
  const isNotificationsActive = location.pathname === "/notifications";

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user]);
  return (
    <Disclosure
      as="nav"
      className="bg-white shadow-sm fixed top-0 left-0 w-full z-50"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-[#FFA904] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center space-x-4">
                  <Link to="/feed">
                    <img
                      alt="Connect"
                      src="/images/logo.svg"
                      className="h-14 w-auto"
                    />
                  </Link>
                </div>

                <div className="hidden sm:ml-6 sm:flex items-center space-x-12">
                  <div className="relative hidden md:block">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-4 py-2 w-64 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-[#FFA904]"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onBlur={handleSearchBlur}
                    />
                    {searchVisible && (
                      <ul className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-2">
                        {searchResults.length > 0 ? (
                          searchResults.map((user) => (
                            <li key={user._id}>
                              <Link
                                to={`/user/${user._id}`}
                                className="block px-4 py-4 text-sm text-gray-700 hover:bg-[#FFA904] hover:text-white rounded-md"
                              >
                                <img
                                  src={user.profilePicture}
                                  alt=""
                                  className="h-8 w-8 rounded-full float-left mr-2 -mt-1.5"
                                />
                                {user.firstName} {user.lastName}
                              </Link>
                            </li>
                          ))
                        ) : (
                          <li>
                            <p className="px-4 py-2 text-sm text-gray-500">
                              No users found
                            </p>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  <div className="hidden sm:flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={
                          location.pathname === item.href ? "page" : undefined
                        }
                        className={classNames(
                          location.pathname === item.href
                            ? "bg-[#FFA904] text-white"
                            : "text-gray-700 hover:bg-[#FFA904] hover:text-white",
                          "flex flex-col items-center rounded-md px-4 py-2 text-sm font-medium"
                        )}
                      >
                        <item.icon className="h-5 w-5 mb-1" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link to="/notifications">
                  <button
                    type="button"
                    className={classNames(
                      isNotificationsActive
                        ? "text-[#FFA904]"
                        : "text-white hover:text-[#FFA904]",
                      "relative rounded-full bg-gray-800 p-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    )}
                  >
                    <span className="sr-only">View notifications</span>
                    <FaBell className="h-6 w-6" />
                    {/* Notification Count */}

                    <span className="absolute top-0 right-0 inline-block w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                      {notifications?.length}
                    </span>
                  </button>
                </Link>

                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button
                      className={`relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FFA904] ${
                        isProfileActive ? "ring-2 ring-[#FFA904]" : ""
                      }`}
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src={user?.profilePicture}
                        className="h-8 w-8 rounded-full"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-[#FFA904] ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/account"
                            className={classNames(
                              active
                                ? "bg-[#FFA904] text-white"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logoutHandler}
                            className={classNames(
                              active
                                ? "bg-[#FFA904] text-white"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm w-full text-left"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href
                      ? "bg-[#FFA904] text-white"
                      : "text-gray-700 hover:bg-[#FFA904] hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={
                    location.pathname === item.href ? "page" : undefined
                  }
                >
                  <item.icon className="h-5 w-5 mr-2 inline" />
                  {item.name}
                </Disclosure.Button>
              ))}
              <Disclosure.Button
                onClick={handleInputClick}
                className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-[#FFA904] hover:text-white"
              >
                <FaSearch className="h-5 w-5 mr-2 inline" />
                Search
              </Disclosure.Button>
            </div>
            {inputShow && (
              <div className="px-2 py-2 bg-gray-100 border-t border-gray-200">
                <form onSubmit={handleSearchChange}>
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-[#FFA904]"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onBlur={handleSearchBlur}
                    autoFocus
                  />
                </form>
                {searchVisible && (
                  <ul className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        <li key={user._id}>
                          <Link
                            to={`/user/${user._id}`}
                            className="block px-4 py-4 text-sm text-gray-700 hover:bg-[#FFA904] hover:text-white rounded-md"
                          >
                            <img
                              src={user.profilePicture}
                              alt=""
                              className="h-8 w-8 rounded-full float-left mr-2 -mt-1.5"
                            />
                            {user.firstName} {user.lastName}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li>
                        <p className="px-4 py-2 text-sm text-gray-500">
                          No users found
                        </p>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
