// features/auth/components/login-form.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loginStart, loginSuccess, loginFailure } from "@/features/auth/store/auth-slice"
import { post } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useAuth } from "@/features/auth/hooks/use-auth"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const dispatch = useAppDispatch()

  const { isLoading, error } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const { signInWithGoogle } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      dispatch(loginStart())
      setServerError(null)

      // Make API request
      const response = await post("/auth/login", data, { requiresAuth: false }) as any

      dispatch(
        loginSuccess({
          user: response.user,
          token: response.token,
        }),
      )

      router.push("/dashboard")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      dispatch(loginFailure(errorMessage))
      setServerError(errorMessage)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      setServerError(null)
      dispatch(loginStart())

      const result = await signInWithGoogle()

      // In a real implementation, you would handle the result from Google sign-in
      // and potentially make an API call to your backend to verify the user

      // For now, we'll simulate a successful login
      dispatch(
        loginSuccess({
          user: {
            id: result.uid,
            name: result.displayName || "Google User",
            email: result.email || "",
            role: "student", // Default role for Google sign-ins
          },
          token: await result.getIdToken(),
        }),
      )

      router.push("/dashboard")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google sign-in failed"
      dispatch(loginFailure(errorMessage))
      setServerError(errorMessage)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Welcome back
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full mb-6" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
          {isGoogleLoading ? (
            "Signing in..."
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </>
          )}
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {serverError && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{serverError}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
        <Link href="/forgot-password" className="text-sm text-center text-gray-500 hover:underline">
          Forgot your password?
        </Link>
      </CardFooter>
    </Card>
  )
}
