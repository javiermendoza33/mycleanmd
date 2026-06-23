import TopBar from '@/components/TopBar'
import StatCard from '@/components/StatCard'

const TODAY = [
  { time: '9:00 AM',  patient: 'Maria Garcia',   type: 'Video',     status: 'Upcoming' },
  { time: '10:30 AM', patient: 'James Wilson',   type: 'In-Person', status: 'Upcoming' },
  { time: '1:00 PM',  patient: 'Ana Martinez',   type: 'Video',     status: 'Upcoming' },
  { time: '2:30 PM',  patient: 'Robert Kim',     type: 'Video',     status: 'Upcoming' },
  { time: '4:00 PM',  patient: 'Lisa Thompson',  type: 'In-Person', status: 'Upcoming' },
]

const PENDING = [
  { task: 'Review lab results', patient: 'Maria Garcia', priority: 'High' },
  { task: 'Sign prescription',  patient: 'James Wilson', priority: 'Medium' },
  { task: 'Complete SOAP note', patient: 'Ana Martinez', priority: 'Medium' },
]

export default function DoctorDashboard() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Thursday, June 19, 2026" />
      <div className="p-8 space-y-8">

        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Today's Appointments" value="5"  sub="2 video, 3 in-person" accent="var(--green)" />
          <StatCard label="Total Patients"        value="142" sub="8 new this month" accent="var(--teal)" />
          <StatCard label="Pending Tasks"         value="3"  sub="1 high priority" accent="var(--amber)" />
          <StatCard label="Avg. Rating"           value="4.9" sub="Based on 98 reviews" accent="var(--green)" />
          <StatCard label="New Intakes"          value="—"   sub={<a href="/doctor/intakes" style={{color:'var(--teal)'}}>Review now →</a>} accent="var(--teal)" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Today's schedule */}
          <div className="col-span-2 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--divider)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--divider)' }}>
              <p className="text-sm font-semibold text-white">Today&apos;s Schedule</p>
              <a href="/doctor/schedule" className="text-xs font-medium" style={{ color: 'var(--green)' }}>Full schedule →</a>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--divider)' }}>
              {TODAY.map((apt, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <span className="text-sm w-20 shrink-0" style={{ color: 'var(--muted)' }}>{apt.time}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{apt.patient}</p>
                  </div>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      background: apt.type === 'Video' ? 'var(--teal-dim)' : '#1A2E42',
                      color: apt.type === 'Video' ? 'var(--teal)' : 'var(--muted)',
                    }}
                  >
                    {apt.type}
                  </span>
                  <button
                    className="text-xs font-medium px-3 py-1.5 rounded-lg transition"
                    style={{ background: 'var(--teal-dim)', color: 'var(--teal)' }}
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pending tasks */}
          <div className="rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--divider)' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--divider)' }}>
              <p className="text-sm font-semibold text-white">Pending Tasks</p>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--divider)' }}>
              {PENDING.map((task, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-white">{task.task}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full ml-2 shrink-0"
                      style={{
                        background: task.priority === 'High' ? '#3F1A1A' : 'var(--divider)',
                        color: task.priority === 'High' ? '#F87171' : 'var(--muted)',
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{task.patient}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
