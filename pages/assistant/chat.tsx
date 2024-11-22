import { Inter, Source_Serif_4 } from "next/font/google";
import { ChatSideNavProfile } from "@/components/ChatSideNavProfile";
import { ChatBubble } from "@/components/ChatBubble";
import { useRef, useState } from "react";
import axios from "axios";
import Modal from "@/components/Modal";
import Markdown from "react-markdown";

const source_serif = Source_Serif_4({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function Page() {
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [isAudioPlaying, setIsAudioPlaying] = useState(false)
    const [message, setInputMessage] = useState("")
    const [feedback, setFeedback] = useState("")
    const [conversation, setConversation] = useState([{
        role: "assistant",
        isAudioPlaying: false,
        content: "Hi, how can I help you today?"
    }])

    const [characterIndex, setCharacterIndex] = useState(0)
    const characters = [
        {
            profile: "/profile1.jpg",
            name: "Henrietta Boyd",
            description: "With over 5 years of teaching experience, I have a passion for helping students improve their language skills. My approach focuses on building confidence and fluency through engaging lessons.",
            summary: "Experienced teacher with a focus on building student confidence.",
            prompt: "Imagine you are explaining the concept of conditional tense to your friend who is struggling to understand it."
        },
        {
            profile: "/profile2.jpg",
            name: "Dark Spider Man",
            description: `I'm Spidey Sensei, the web-slinging educator with a penchant for crafting clever lessons that ensnare young minds. My teaching style is a tangled web of interactivity and fun, ensuring learning is as thrilling as a rooftop chase through Manhattan's concrete jungle.

            My mantra? Make education so cool, kids won't even notice they're learning - until the bell rings, that is! Then, just like I swing into action to save the day, my students will be ready to take on the world with their newfound knowledge and skills. thwip thwop`,
            summary: `As Spidey Sensei "thwips" students into learning mode by incorporating English literature.`,
            prompt: `As Spidey Sensei, I need your help to create a lesson plan that will "thwip" my students into learning mode! Use your language abilities to generate a creative and engaging educational activity that incorporates one of the following subjects: English literature, history, or science.
            
            Write a brief description of the activity ( approx. 100-150 words) including:
            
            1. Subject: [Choose one from above]
            2. Activity title: [Something like "Web-slinging into Grammar" or "The Spider's Web of Historical Context"]
            3. Objective: What do students learn from this activity?
            4. Materials needed: List the necessary materials, tools, or resources required for the activity (e.g., books, internet access, etc.)
            5. Steps to follow: Outline the sequence of steps for completing the activity ( approx. 5-7 steps)
            
            Make sure your response is written in a tone that captures the spirit of Spidey Sensei's mantra - making education "so cool" that students won't even notice they're learning!
            
            **Additional notes:** Please keep your language natural and conversational, as if you were writing directly to me (Spidey Sensei). Use proper grammar and punctuation. If I need any adjustments or further clarification on the activity, I'll be swinging back into action!`
        },
        {
            profile: "/profile3.jpg",
            name: "Cool Bridge",
            description: "With extensive experience in ESOL (English for Speakers of Other Languages), I specialize in creating personalized lesson plans that cater to each student's unique needs and learning style.",
            summary: "Expert in teaching English to non-native speakers.",
            prompt: "Imagine you are describing your daily routine to a friend who is moving to the same city. Write a paragraph summarizing what they can expect."
        },
        {
            profile: "/profile4.jpg",
            name: "Baby Boss",
            description: "As a young and energetic English teacher, I bring enthusiasm and patience to my lessons. My approach is tailored to meet the needs of students from different age groups and proficiency levels.",
            summary: "Young and patient teacher for all ages.",
            prompt: "Imagine you are introducing yourself in an elevator pitch. Write a 30-second speech that showcases your personality and interests."
        }
    ]

    const audioRef = useRef<HTMLAudioElement>(null)
    const handleFormSubmission = async (e: any) => {
        setLoading(true)

        e.preventDefault()
        // send message to backend 
        const actualConversation = [...conversation, { role: 'user', isAudioPlaying, content: message }]
        setConversation(actualConversation)
        setInputMessage('')
        try {

            const response = await axios.post('/api/chat_api', { message, prompt: characters[characterIndex].prompt ?? "You are a nice teacher", conversation })
            setConversation([...actualConversation, { ...response.data.message.message, isAudioPlaying: false }])

        } catch (error) {

            console.log('-----------------------------------------------------')
            console.log(`error form submit post 59 :>>`, error)
            console.log('-----------------------------------------------------')

        }
        setLoading(false)
        // clear the input
    }
    const selectProfile = (index: number) => {
        setCharacterIndex(index)
        setConversation([{
            role: "assistant",
            content: "Hi, how can I help you today?"
        }])
    }
    async function feedbackHandler(content: string) {
        setLoading(true)
        try {
            const response = await axios.post('/api/feedback_api', { message: content })
            setFeedback(response.data.message.message.content)
            setModalOpen(true)
        } catch (error) {
            console.log(`error in getting feedback :>>`, error)
            console.log('-----------------------------------------------------')
        }
        setLoading(false)
    }

    const readText = async (idx: number) => {
        const content = conversation[idx].content
        if (isAudioPlaying) {
            audioRef.current?.pause()
            setIsAudioPlaying(false)
            let convos = [...conversation]
            convos[idx].isAudioPlaying = false
            setConversation(convos)
        } else {

            if (audioRef.current !== null) {
                setLoading(true)
                audioRef.current.src = process.env.NEXT_PUBLIC_API_URL + '/voice/coqui?text=' + content
                audioRef.current.play()
                let convos = [...conversation]
                convos[idx].isAudioPlaying = true
                setConversation(convos)
                setIsAudioPlaying(true)
                setLoading(false)
            }
        }
    }

    return (
        <main className={`flex w-full h-screen bg-[#f7f5ff] flex-col p-0  ${inter.className}`}>
            <div className="shadow flex items-center py-4 justify-center bg-[#f7f5ff]">
                <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                </div>
                <div className="ml-2 font-bold text-2xl">Dopla</div>
            </div>

            <>
                {/* component */}
                <div className="flex h-screen antialiased text-gray-800">
                    <div className="flex flex-row h-full w-full overflow-x-hidden">
                        <div className="flex flex-col py-8 pl-6 pr-2 w-1/5 mt-[.04rem] flex-shrink-0">

                            {/* <div className="flex flex-col items-center bg-indigo-100 border border-gray-200  w-full py-6 px-4 rounded-lg">

                                <div className="text-sm font-semibold m-2">Configure your experience</div>
                                <div className="text-xs text-gray-500"> Switch between oral and chat </div>

                                <label className="inline-flex mt-4 items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ms-3 text-[.7rem] font-medium text-gray-900 dark:text-gray-300">Active</span>
                                </label>

                            </div> */}
                            <div className="flex flex-col mt-8">
                                <div className="flex flex-row items-center justify-between text-xs">
                                    <span className="font-bold">Your Tutors</span>
                                    <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                                        4
                                    </span>
                                </div>
                                <div className="flex flex-col space-y-1 mt-4 -mx-2 overflow-y-auto">
                                    {characters.map((item, index) => (
                                        <ChatSideNavProfile onClick={() => selectProfile(index)} key={index} active={characterIndex == index} character={item}></ChatSideNavProfile>
                                    ))}
                                    {/* <ChatSideNavProfile profile="/profile2.jpg" active={true}></ChatSideNavProfile>
                                <ChatSideNavProfile profile="/profile3.jpg"></ChatSideNavProfile>
                                <ChatSideNavProfile profile="/profile4.jpg"></ChatSideNavProfile> */}



                                </div>

                            </div>
                        </div>
                        <div className="border shadow-md w-full">
                            <div className="space-y-1.5 p-6 flex flex-row items-center border-b mb-8">
                                <div className="flex items-center space-x-4">
                                    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                        <img
                                            className="aspect-square h-full w-full"
                                            alt="Image"
                                            src={characters[characterIndex].profile}
                                        />
                                    </span>
                                    <div>
                                        <p className="text-md font-medium leading-none">{characters[characterIndex].name}</p>
                                        <p className="text-[.8rem] text-gray-500 mt-2">{characters[characterIndex].description}</p>
                                    </div>
                                </div>

                            </div>

                            <div className="max-w-5xl mx-auto flex flex-col h-[75vh] justify-between">

                                <div className="h-5/6 overflow-auto p-6 pt-0 chatbox-container" >
                                    <div className="flex flex-col mb-16">
                                        <div className="flex items-center space-x-4 flex-col">
                                            <span className="relative flex h-[6rem] w-[6rem] shrink-0 overflow-hidden rounded-full">
                                                <img
                                                    className="aspect-square h-full w-full"
                                                    alt="Image"
                                                    src={characters[characterIndex].profile}
                                                />
                                            </span>
                                            <div className="flex items-center flex-col mt-6">
                                                <p className="text-md font-medium leading-none">{characters[characterIndex].name}</p>
                                                <p className="text-[.8rem] text-gray-500 mt-2">{characters[characterIndex].description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {conversation.map((message, index) => (
                                            <ChatBubble isAudioPlaying={message.isAudioPlaying} voice={() => readText(index)} feedbackHandler={() => { feedbackHandler(message.content) }} key={index} direction={message.role == "assistant" ? "left" : "right"}>
                                                {message.content}
                                            </ChatBubble>
                                        ))}
                                        <div style={{ float: "left", clear: "both" }}>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center p-6 pt-0 ">
                                    <form onSubmit={handleFormSubmission} className="flex w-full items-center space-x-2">
                                        <input
                                            className="flex h-12 w-full rounded-md border border-gray-300 border-input bg-background px-3 py-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                                            id="message"
                                            placeholder="Type your message..."
                                            autoComplete="off"
                                            value={message}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                        />
                                        {loading ?
                                            (<span className="loader"></span>)
                                            : (
                                                <>
                                        <button
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-blue-500-foreground hover:bg-blue-500/90 h-12 w-12"
                                            type="submit"
                                        >
                                                        <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-6 w-6 text-white"
                                            >
                                                <path d="m22 2-7 20-4-9-9-4Z" />
                                                <path d="M22 2 11 13" />
                                            </svg>
                                            <span className="sr-only">Send</span>
                                        </button>
                                                </>
                                            )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            <audio src="" ref={audioRef} className="hidden"></audio>
            <Modal setOpen={setModalOpen} modalOpen={modalOpen}>
                <Markdown>{feedback}</Markdown>
            </Modal>

        </main>

    );
}
