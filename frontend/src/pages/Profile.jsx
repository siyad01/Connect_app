import { UserData } from "../context/userContext";
import Profile_component from "../components/Profile_component";
import About_component from "../components/About_component";
import Experience_component from "../components/Experience_component";
import Education_component from "../components/Education_component";
import Skills_component from "../components/Skills_component";
import Certification_component from "../components/Certifiates_component";
import PostSection from "../components/Post_component";
import { Loading } from "../components/Loading";
import { PostData } from "../context/postContext";
const ProfileCard = () => {
  //const navigate = useNavigate();

  const { user } = UserData();
  const { loading } = PostData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-[#f9f6f2]">
          <div className="container mx-auto p-4 pt-20 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Main Feed */}
            <div className="w-full lg:w-2/3">
              {/*Profile */}
              <Profile_component user={user} />

              {/* {About} */}
              <About_component user={user} />

              {/* {Posts Section} */}
              <PostSection user={user} />

              {/* {Experience} */}
              <Experience_component user={user} />

              {/* {Education} */}

              <Education_component user={user} />

              {/* {Skills} */}
              <Skills_component user={user} />

              {/* {Licenses and Certifications} */}
              <Certification_component user={user} />
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block lg:w-1/3">
              {/* Public Profile & URL Section */}
              <div className="bg-white p-6 shadow-md  max-w-sm rounded-lg mb-4">
                <p className="text-gray-800 font-semibold">
                  Public profile & URL
                </p>
                <a
                  href="#"
                  className="text-[#FFA904]  hover:text-[#b37903] font-semibold"
                >
                  www.Connect.com/in/{user.firstName}
                  {"-"}
                  {user.lastName}
                </a>
              </div>

              {/* Profile Language Section */}
              <div className="bg-white p-6 rounded-lg max-w-sm shadow-md mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-800 font-semibold">
                    Profile language
                  </p>
                  <p className="text-gray-800 text-sm">English</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className=" text-gray-900 font-semibold py-4 mt-6">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 Connect. All rights reserved.</p>
              <p>Made by Muhammed Siyad</p>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default ProfileCard;
