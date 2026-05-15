import Header from '../components/Header'
import { kpiData, hourlyCustomers, aiAccuracy, alertsData, tablesData } from '../data/mockData'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'

const statusCount = tablesData.reduce((acc, t) => {
  acc[t.status] = (acc[t.status] || 0) + 1
  return acc
}, {})

export default function Dashboard() {
  return (
    <>
      <Header title="대시보드" subtitle="오늘의 레스토랑 운영 현황을 한눈에" />
      <div className="page-content">

        {/* KPI Cards */}
        <div className="grid-4">
          <div className="card">
            <div className="card-title">오늘 방문 고객</div>
            <div className="card-value">{kpiData.todayCustomers.value}<span style={{fontSize:16,fontWeight:400,marginLeft:4}}>명</span></div>
            <div className={`card-trend ${kpiData.todayCustomers.up ? 'up' : 'down'}`}>
              {kpiData.todayCustomers.up ? '▲' : '▼'} 전주 대비 {kpiData.todayCustomers.trend}
            </div>
          </div>
          <div className="card">
            <div className="card-title">테이블 점유율</div>
            <div className="card-value">{kpiData.tableOccupancy.value}</div>
            <div className="card-sub">{statusCount.occupied || 0}개 사용 중 / 총 {tablesData.length}개</div>
            <div className="card-trend up">▲ {kpiData.tableOccupancy.trend}</div>
          </div>
          <div className="card">
            <div className="card-title">평균 체류 시간</div>
            <div className="card-value">{kpiData.avgSeatTime.value}</div>
            <div className="card-trend up">▼ {kpiData.avgSeatTime.trend} (개선)</div>
          </div>
          <div className="card">
            <div className="card-title">오늘 매출</div>
            <div className="card-value" style={{fontSize:24}}>₩{kpiData.todayRevenue.value}</div>
            <div className="card-sub">목표 대비 78%</div>
            <div className="card-trend up">▲ {kpiData.todayRevenue.trend}</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid-2">
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div>
                <div style={{fontWeight:600,fontSize:15}}>시간대별 고객 현황</div>
                <div style={{fontSize:12,color:'#64748b',marginTop:2}}>실제 vs AI 예측</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hourlyCustomers}>
                <defs>
                  <linearGradient id="gCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{fontSize:11}} />
                <YAxis tick={{fontSize:11}} />
                <Tooltip />
                <Area type="monotone" dataKey="customers" stroke="#6366f1" fill="url(#gCustomers)" name="실제 고객" />
                <Area type="monotone" dataKey="predicted" stroke="#f59e0b" fill="none" strokeDasharray="4 2" name="AI 예측" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>AI 예측 정확도 (주간)</div>
            <div style={{fontSize:12,color:'#64748b',marginBottom:16}}>이번 주 일별 예측 정확도</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={aiAccuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{fontSize:11}} />
                <YAxis domain={[85, 100]} tick={{fontSize:11}} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} dot={{fill:'#22c55e'}} name="정확도" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid-2">
          {/* Recent Alerts */}
          <div className="card" style={{padding:0}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #e2e8f0',fontWeight:600,fontSize:15}}>
              최근 알림
              <span style={{marginLeft:8,background:'#fee2e2',color:'#dc2626',fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:10}}>
                {alertsData.filter(a=>a.unread).length} 미확인
              </span>
            </div>
            {alertsData.slice(0,5).map(alert => (
              <div key={alert.id} className="alert-item">
                <div className={`alert-icon ${alert.type}`}>{alert.icon}</div>
                <div className="alert-body">
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-time">{alert.time}</div>
                </div>
                {alert.unread && <span style={{width:8,height:8,borderRadius:'50%',background:'#6366f1',flexShrink:0,marginTop:6}}/>}
              </div>
            ))}
          </div>

          {/* Table summary */}
          <div className="card">
            <div style={{fontWeight:600,fontSize:15,marginBottom:16}}>테이블 현황 요약</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[
                { label:'사용 중',  count: statusCount.occupied  || 0, color:'#8b5cf6', bg:'#ede9fe' },
                { label:'가용',     count: statusCount.available || 0, color:'#22c55e', bg:'#dcfce7' },
                { label:'예약',     count: statusCount.reserved  || 0, color:'#f59e0b', bg:'#fef3c7' },
                { label:'정리 중',  count: statusCount.cleaning  || 0, color:'#94a3b8', bg:'#f1f5f9' },
              ].map(item => (
                <div key={item.label} style={{background:item.bg,borderRadius:10,padding:'16px',textAlign:'center'}}>
                  <div style={{fontSize:28,fontWeight:700,color:item.color}}>{item.count}</div>
                  <div style={{fontSize:12,fontWeight:600,color:item.color,marginTop:4}}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:16,padding:'12px',background:'#f8fafc',borderRadius:8}}>
              <div style={{fontSize:12,color:'#64748b',fontWeight:600}}>AI 예측</div>
              <div style={{fontSize:13,color:'#334155',marginTop:4}}>
                약 20분 후 <strong>7번, 1번, 12번</strong> 테이블 퇴석 예상 — 대기 고객 우선 배치 준비 권장
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
