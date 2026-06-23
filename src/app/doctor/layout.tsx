import Sidebar from '@/components/Sidebar'

const NAV = [
  { label: 'Dashboard',     href: '/doctor/dashboard',     icon: '🏠' },
  { label: 'My Schedule',   href: '/doctor/schedule',      icon: '📅' },
  { label: 'Patients',      href: '/doctor/patients',      icon: '👥' },
  { label: 'Patient Intakes', href: '/doctor/intakes',     icon: '📋' },
  { label: 'Consultations', href: '/doctor/consultations', icon: '📹' },
  { label: 'Prescriptions', href: '/doctor/prescriptions', icon: '💊' },
  { label: 'Lab Orders',    href: '/doctor/lab-orders',    icon: '🧪' },
  { label: 'Messages',      href: '/doctor/messages',      icon: '💬' },
  { label: 'Settings',      href: '/doctor/settings',      icon: '⚙️' },
]

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar portalLabel="Doctor Portal" accentColor="var(--green)" navItems={NAV} />
      <main className="flex-1 ml-60 flex flex-col min-h-screen" style={{ background: 'var(--bg-dark)' }}>
        {children}
      </main>
    </div>
  )
}
