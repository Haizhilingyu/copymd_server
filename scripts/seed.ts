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

    console.log("Speeding finished");
    
} catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database")
}
};

main();