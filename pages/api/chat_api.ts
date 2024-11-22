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
            content: `You are an english tutor ${req.body.prompt}. 
            These are your student preferences:
            language level: ${response ? response.languageLevel : "Beginner"}
            objectives: ${response ? response.objectives : "just for fun"}
            commitment: ${response ? response.commitment : "today only"}
            `
        }
    ]
    const messages = [...conversation, ...req.body.conversation, { "role": "user", content: req.body.message }]
    console.log('-----------------------------------------------------')
    console.log(`req.body :>>`, req.body)
    console.log(`messages :>>`, messages)
    console.log('-----------------------------------------------------')

    const ollama = new Ollama({ host: "http://127.0.0.1:11434" })
    const message = await ollama.chat({ model: "llama3", messages })
    console.log(response)
    res.status(200).json({ message })
}