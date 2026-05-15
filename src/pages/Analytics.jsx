import Header from '../components/Header'
import { hourlyCustomers, weeklySales, menuSales, aiAccuracy } from '../data/mockData'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend
} from 'recharts'

const formatWon = (v) => `₩${(v/10000).toFixed(0)}만`

export default function Analytics() {
  const totalRevenue = weeklySales.reduce((s, d) => s + d.sales, 0)
  const totalCustomers = hourlyCustomers.reduce((s, d) => s + d.customers, 0)
  const avgAccuracy = (aiAccuracy.reduce((s, d) => s + d.accuracy, 0) / aiAccuracy.length).toFixed(1)

  return (
    <>
      <Header title="분석 리포트" subtitle="매출, 고객, AI 예측 정확도 분석" />
      <div className="page-content">

        {/* KPI */}
        <div className="grid-3" style={{marginBottom:20}}>
          <div className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:12,color:'#64748b',fontWeight:600,marginBottom:8}}>주간 총 매출</div>
            <div style={{fontSize:26,fontWeight:700,color:'#6366f1'}}>₩{(totalRevenue/10000).toFixed(0)}만</div>
            <div style={{fontSize:12,color:'#22c55e',marginTop:6}}>▲ 전주 대비 +11.2%</div>
          </div>
          <div className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:12,color:'#64748b',fontWeight:600,marginBottom:8}}>금일 총 고객</div>
            <div style={{fontSize:26,fontWeight:700,color:'#8b5cf6'}}>{totalCustomers}명</div>
            <div style={{fontSize:12,color:'#22c55e',marginTop:6}}>▲ 전주 대비 +12%</div>
          </div>
          <div className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:12,color:'#64748b',fontWeight:600,marginBottom:8}}>AI 예측 정확도 (주간 평균)</div>
            <div style={{fontSize:26,fontWeight:700,color:'#22c55e'}}>{avgAccuracy}%</div>
            <div style={{fontSize:12,color:'#22c55e',marginTop:6}}>▲ 전주 대비 +1.3%</div>
          </div>
        </div>

        {/* Weekly Sales Chart */}
        <div className="card" style={{marginBottom:20}}>
          <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>주간 매출 비교</div>
          <div style={{fontSize:12,color:'#64748b',marginBottom:16}}>이번 주 vs 지난 주</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklySales} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{fontSize:12}} />
              <YAxis tickFormatter={formatWon} tick={{fontSize:11}} />
              <Tooltip formatter={(v) => `₩${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="sales" name="이번 주" fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="lastWeek" name="지난 주" fill="#c7d2fe" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly + Accuracy */}
        <div className="grid-2" style={{marginBottom:20}}>
          <div className="card">
            <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>시간대별 고객 흐름</div>
            <div style={{fontSize:12,color:'#64748b',marginBottom:16}}>실제 고객 vs AI 예측</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hourlyCustomers}>
                <defs>
                  <linearGradient id="gc2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{fontSize:10}} />
                <YAxis tick={{fontSize:11}} />
                <Tooltip />
                <Area type="monotone" dataKey="customers" stroke="#8b5cf6" fill="url(#gc2)" name="실제" />
                <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeDasharray="4 2" name="예측" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>AI 예측 정확도 추이</div>
            <div style={{fontSize:12,color:'#64748b',marginBottom:16}}>이번 주 일별 정확도 (%)</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={aiAccuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{fontSize:12}} />
                <YAxis domain={[88, 96]} tick={{fontSize:11}} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2.5} dot={{fill:'#22c55e',r:4}} name="정확도" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Menu Sales */}
        <div className="card" style={{padding:0}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid #e2e8f0',fontWeight:600,fontSize:15}}>메뉴별 판매 현황 (누적)</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>메뉴</th>
                  <th>판매 수량</th>
                  <th>매출액</th>
                  <th>비율</th>
                </tr>
              </thead>
              <tbody>
                {menuSales.map((m, i) => {
                  const total = menuSales.reduce((s, x) => s + x.revenue, 0)
                  const pct = ((m.revenue / total) * 100).toFixed(1)
                  return (
                    <tr key={i}>
                      <td><strong>{m.name}</strong></td>
                      <td>{m.count}개</td>
                      <td>₩{m.revenue.toLocaleString()}</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div style={{flex:1,background:'#f1f5f9',borderRadius:4,height:8,overflow:'hidden'}}>
                            <div style={{width:`${pct}%`,background:'#6366f1',height:'100%',borderRadius:4}}/>
                          </div>
                          <span style={{fontSize:12,color:'#64748b',minWidth:36}}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}
