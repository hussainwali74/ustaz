import { getPreferences, userPreferencesInterface } from "@/db/sqlite"
import { getAuth } from "@clerk/nextjs/server"
import type { NextApiRequest, NextApiResponse } from "next"
import { Ollama } from "ollama"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { userId } = getAuth(req)

    const response: userPreferencesInterface = await getPreferences(userId ?? "")
    const conversation = [
        {
            role: "system",
            content: `You are an english tutor. You correct student's mistakes by giving valuable and insightful feedback.
            You are nice and you consider student's objectives. User will only provide english text for you to review. 
            Your response will be only the feedback on the student's mistake and nothing else. 
            `
        },
        {
            role: "user",
            content: `Review this english text: ${req.body.message}`
        }
    ]

    const ollama = new Ollama({ host: "http://127.0.0.1:11434" })
    const message = await ollama.chat({ model: "llama3", messages: conversation })
    console.log(response)
    res.status(200).json({ message })
}