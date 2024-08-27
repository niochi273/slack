import Link from "next/link"

export default function Home() {
  return <div>
    <div>Home</div>
    <Link href="/auth/signin">Sign In</Link>
    <Link href="/auth/signup">Sign Up</Link>
  </div>
}
