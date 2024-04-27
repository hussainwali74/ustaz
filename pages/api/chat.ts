import { getPreferences, savePreferences } from "@/db/sqlite"
import { getAuth } from "@clerk/nextjs/server"
import type { NextApiRequest, NextApiResponse } from "next"



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { userId } = getAuth(req)

    const response = await getPreferences(userId ?? "")

    console.log(response)
    res.status(200).json({ response })
}