import "dotenv/config"

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema"
const sql = postgres(process.env.DATABASE_URL!, { max: 1 })
const db = drizzle(sql,{schema});

const main = async () => {
try {
    console.log("Seeding database");
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);

    await db.insert(schema.courses).values([
        {
            id: 1,
            title: "English",
            imageSrc: "/next.svg"
        },
        {
            id: 2,
            title: "中国",
            imageSrc: "/next.svg"
        },{
            id: 3,
            title: "日本",
            imageSrc: "/next.svg"
        },{
            id: 4,
            title: "韩国",
            imageSrc: "/next.svg"
        }
    ])

    await db.insert(schema.units).values([
        {
            id: 1,
            courseId: 1,
            title: "Unit 1",
            description: "Learn the basics of Spanish",
            order: 1,
        },
        {
            id: 2,
            courseId: 1,
            title: "Unit 2",
            description: "Learn the basics of Spanish",
            order: 2,
        },{
            id: 3,
            courseId: 1,
            title: "Unit 3",
            description: "Learn the basics of Spanish",
            order: 3,
        },
        {
            id: 4,
            courseId: 2,
            title: "Unit 1",
            description: "Learn the basics of Spanish",
            order: 1,
        },
        {
            id: 5,
            courseId: 2,
            title: "Unit 2",
            description: "Learn the basics of Spanish",
            order: 2,
        },{
            id: 6,
            courseId: 2,
            title: "Unit 3",
            description: "Learn the basics of Spanish",
            order: 3,
        },
    ])

    await db.insert(schema.lessons).values([
        {
            id: 1,
            unitId: 1,
            order: 1,
            title:"Nouns"
        },
        {
            id: 2,
            unitId: 1,
            order: 2,
            title:"Verbs"
        }
    ])

    await db.insert(schema.challenges).values([
        {
            id: 1,
            lessonId: 1,
            type: "SELECT",
            order: 1,
            question: 'Which one off these is the "the man"?'
        },
    ]);

    await db.insert(schema.challengeOptions).values([
        {
            id: 1,
            challengeId: 1,
            imageSrc: "/man.svg",
            correct: true,
            text: "el hombre",
            audioSrc: "/es_man.mp3",
        },
        {
            id: 2,
            challengeId: 1,
            imageSrc: "/man.svg",
            correct: true,
            text: "la mujer",
            audioSrc: "/es_woman.mp3",
        },
        {
            id: 3,
            challengeId: 1,
            imageSrc: "/man.svg",
            correct: true,
            text: "el reboot",
            audioSrc: "/es_reboot.mp3",
        },
    ]);

    console.log("Speeding finished");
} catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database")
}
};

main();