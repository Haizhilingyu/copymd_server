import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/stick-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";

const LearnPage =async () => {
    const userProgressData = getUserProgress();
    const [userProgress] = await Promise.all([
        userProgressData
    ])
if(!userProgress|| !userProgress.activeCourse){
    redirect("/courses");
}

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
        activeCourse={{title: "English",imageSrc: "/vercel.svg"}}
        hearts={5}
        points={100}
        hasActiveSubscription={false}
        >

        </UserProgress>
      </StickyWrapper>
      <FeedWrapper>
        <Header title="English"/>

        <div></div>
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
