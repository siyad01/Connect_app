import PostCreationBox from "../components/PostCreationBox";
import SinglePost from "../components/SinglePost";
import UserCard from "../components/UserCard";
import NewsComponent from "../components/NewsComponent";
import { UserData } from "../context/userContext";
import { PostData } from "../context/postContext";
import { Loading } from "../components/Loading";

const Feed = () => {
  const { posts, loading } = PostData();

  const { user } = UserData();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-[#f9f6f2]">
          {/* Add a top margin equal to or greater than the height of the Navbar */}
          <div className="pt-16">
            {" "}
            {/* Adjust the `pt-16` value based on your Navbar height */}
            <div className="container mx-auto p-4 flex space-x-4">
              {/* Left Sidebar */}
              <div className="hidden lg:block lg:w-1/4">
                <UserCard user={user}/>
              </div>

              {/* Main Feed */}
              <div className="w-full lg:w-1/2 space-y-4">
                <PostCreationBox user={user} />

                {posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <SinglePost key={post._id} post={post} user={user} />
                  ))
                ) : (
                  <p>No posts yet</p>
                )}
                {/* Repeat SinglePost for more posts */}
              </div>

              {/* Right Sidebar */}
              <div className="hidden lg:block lg:w-1/4">
                <NewsComponent />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feed;
