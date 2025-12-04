
"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookHeart, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth, useFirestore, useMemoFirebase } from "@/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { collection, doc, getDocs, setDoc, query, limit } from "firebase/firestore"

export default function AdminSignupPage() {
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPending, startTransition] = useTransition()
  
  const auth = useAuth()
  const firestore = useFirestore()
  const router = useRouter()
  const { toast } = useToast()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth || !firestore) {
        toast({
            variant: "destructive",
            title: "Signup Failed",
            description: "Firebase is not initialized.",
        })
        return;
    }
    
    startTransition(async () => {
      try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // 2. Update user profile
        await updateProfile(user, { displayName })

        // 3. Check if this is the first user
        const usersRef = collection(firestore, "users")
        const q = query(usersRef, limit(1));
        const existingUsersSnapshot = await getDocs(q)
        
        const isFirstUser = existingUsersSnapshot.empty;
        const userRole = isFirstUser ? "Super Admin" : "User"

        // 4. Create user document in Firestore
        const userDocRef = doc(firestore, "users", user.uid)
        await setDoc(userDocRef, {
            displayName: displayName,
            email: user.email,
            role: userRole,
            photoURL: user.photoURL
        })

        toast({
          title: "Signup Successful",
          description: `Welcome, ${displayName}! Redirecting you to the admin dashboard.`,
        })

        router.push("/admin")
      } catch (error: any) {
        console.error("Signup failed:", error)
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: error.message || "An unexpected error occurred. Please try again.",
        })
      }
    })
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Create Admin Account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your details to create a new account. The first user will be the Super Admin.
            </p>
          </div>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
               <div className="grid gap-2">
                <Label htmlFor="displayName">Full Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : 'Sign Up'}
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden bg-primary lg:flex lg:items-center lg:justify-center lg:flex-col lg:text-center p-12">
         <BookHeart className="h-24 w-24 text-primary-foreground mb-4" />
          <h2 className="text-4xl font-headline font-bold text-primary-foreground">SMK LPPMRI 2 Kedungreja</h2>
          <p className="text-lg text-primary-foreground/80 mt-2">Admin Control Panel</p>
      </div>
    </div>
  )
}
