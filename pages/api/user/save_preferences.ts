import { savePreferences } from "@/db/sqlite"
import { getAuth } from "@clerk/nextjs/server"
import type { NextApiRequest, NextApiResponse } from "next"

type ResponseData = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { userId } = getAuth(req)

    const response = await savePreferences({
        userId: userId ?? "",
        languageLevel: req.body.languageLevel,
        objectives: req.body.objectives,
        commitment: req.body.commitment,
    })

    console.log(response)
    res.status(200).json({ message: "response" })
}