import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  employeeId: string;
  department: number;
  role: string;
  action: string;
}

export async function createSession(signedUser: User) {
  const token = jwt.sign(
    {
      id: signedUser.id,
      email: signedUser.email,
      role: signedUser.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
  

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    path: "/",
    sameSite:"lax",
    secure:  false,
    maxAge: 60 * 60 * 24,
  });

  const role = signedUser.role;
  
  if (role === "ADMIN") return redirect("/admin");
  if (role === "USER") return redirect("/user");
  if (role === "CUSTODIAN") return redirect("/custodian/profile");
  
}
export async function verifySession() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("session")?.value;

  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}


