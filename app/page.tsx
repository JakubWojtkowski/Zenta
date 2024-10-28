import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ProjectsPage from "@/app/projects/page";
import Sidebar from "./components/Sidebar";

const page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="m-16">
      {
        session?.user ? (
          <div className="flex flex-row w-full">
            <Sidebar />
            <ProjectsPage />
          </div>
        ) : (<div>
          <h2 className="text-2xl">Please login to see this page</h2>
        </div >)
      }
    </div>
  );
};

export default page;