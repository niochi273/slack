
export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="h-full flex items-center justify-center bg-[#5C3B58]">
      <div className="w-[370px] md:w-[420px]">
        {children}
      </div>
    </div>
  )
}
