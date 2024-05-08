import { cache } from "react";
import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs";
import { courses, units, userProgress, lessons, challengeProgress } from './schema';
import { eq } from "drizzle-orm";

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});

export const getUnits = cache(async () => {
  const useProgress = await getUserProgress();
  if(!useProgress?.activeCourseId){
    return [];
  }
  const data = await db.query.units.findMany({
    where: eq(units.courseId,useProgress.activeCourseId),
    with: {
      lessons:{
        with:{
          challenges:{
            with:{
              challengeProgress: true
            }
          }
        }
      }
    }
  });

  const normalilzedData = data.map((unit)=>{
    const lessonsWithCompletedStatus = unit.lessons.map((lesson)=>{
      const allCompletedChallenges = lesson.challenges.every((challenge)=>{
        return challenge.challengeProgress
        && challenge.challengeProgress.length>0
        && challenge.challengeProgress.every((progress)=>progress.completed)

      });
      return {...lesson,completed: allCompletedChallenges};
    })
    return {...unit,lessons: lessonsWithCompletedStatus}
  })

  return normalilzedData;
});

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data;
});


export const getCourseById = cache(async (courseId:number)=>{
    const data = await db.query.courses.findFirst({
        where: eq(courses.id,courseId),
        // TODO: Populate units and lessons
    })

    return data;
})
