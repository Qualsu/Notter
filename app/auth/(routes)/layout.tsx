export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return (
        <div className="text-center">
            {children}
        </div>
    )

}