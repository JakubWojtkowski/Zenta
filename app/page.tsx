import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ProjectsPage from "@/app/projects/page";
import Sidebar from "./components/Sidebar";

const page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      {
        session?.user ? (
          <div className="flex flex-row w-full">
            <div className="lg:flex-[0.15] flex-[0.4]">
              <Sidebar />
            </div>
            <div className="lg:flex-[0.85] flex-[0.6] sm:p-16 ">
              <ProjectsPage />
            </div>
          </div>
        ) : (<div>
          <h2 className="text-2xl">Please login to see this page</h2>
        </div >)
      }
    </div>
  );
};

export default page;