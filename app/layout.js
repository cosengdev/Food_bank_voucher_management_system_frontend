import './globals.css'

export const metadata = {
  title: 'City of God Foodbank – VMS',
  description: 'Voucher Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}