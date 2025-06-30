import { PrismaClient } from "@prisma/client/extension";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed"})

    const {email,password } = req.body

    const user = await prisma.user.findUnique({where:{email}})

    if (!user) return res.status(400).json({ error: "User Not Found"})
    
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) return res.status(400).json({error:{ message: "Invalid credentials"}})
    
    res.status(200).json({message:"Login successful", user})
} 