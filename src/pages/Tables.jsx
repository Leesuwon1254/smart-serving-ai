import { useState } from 'react'
import Header from '../components/Header'
import { tablesData } from '../data/mockData'

const statusLabel = { occupied: '사용 중', available: '가용', reserved: '예약', cleaning: '정리 중' }
const statusClass = { occupied: 'badge-info', available: 'badge-success', reserved: 'badge-warning', cleaning: 'badge-gray' }

export default function Tables() {
  const [selected, setSelected] = useState(null)

  const counts = tablesData.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1
    return acc
  }, {})

  return (
    <>
      <Header title="테이블 현황" subtitle="전체 테이블 실시간 점유 현황 및 AI 예측" />
      <div className="page-content">

        {/* Summary */}
        <div className="grid-4" style={{marginBottom:20}}>
          {[
            { label:'전체', count: tablesData.length, color:'#6366f1' },
            { label:'사용 중', count: counts.occupied || 0, color:'#8b5cf6' },
            { label:'가용', count: counts.available || 0, color:'#22c55e' },
            { label:'예약/정리', count: (counts.reserved||0)+(counts.cleaning||0), color:'#f59e0b' },
          ].map(item => (
            <div key={item.label} className="card" style={{textAlign:'center'}}>
              <div style={{fontSize:28,fontWeight:700,color:item.color}}>{item.count}</div>
              <div style={{fontSize:12,color:'#64748b',fontWeight:600,marginTop:4}}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Table Grid */}
        <div className="card" style={{marginBottom:20}}>
          <div style={{fontWeight:600,fontSize:15,marginBottom:16}}>플로어 맵</div>
          <div className="tables-grid">
            {tablesData.map(table => (
              <div
                key={table.id}
                className={`table-card ${table.status}`}
                onClick={() => setSelected(table.id === selected ? null : table.id)}
                style={{outline: selected === table.id ? '3px solid #6366f1' : 'none'}}
              >
                {table.status === 'occupied' && <div className="ai-label">AI</div>}
                <div className="table-num">{table.id}</div>
                <div className="table-status">{statusLabel[table.status]}</div>
                {table.guests > 0 && <div className="table-time">{table.guests}명 · {table.time}</div>}
                {table.status !== 'occupied' && <div className="table-time">{table.time}</div>}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{display:'flex',gap:16,marginTop:8,flexWrap:'wrap'}}>
            {[
              {color:'#8b5cf6',bg:'#ede9fe',label:'사용 중'},
              {color:'#22c55e',bg:'#dcfce7',label:'가용'},
              {color:'#f59e0b',bg:'#fef3c7',label:'예약'},
              {color:'#94a3b8',bg:'#f1f5f9',label:'정리 중'},
            ].map(l => (
              <div key={l.label} style={{display:'flex',alignItems:'center',gap:6,fontSize:12}}>
                <div style={{width:12,height:12,borderRadius:3,background:l.bg,border:`2px solid ${l.color}`}}/>
                <span style={{color:'#64748b'}}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (() => {
          const t = tablesData.find(t => t.id === selected)
          return (
            <div className="card" style={{marginBottom:20,borderLeft:'4px solid #6366f1'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <div style={{fontWeight:700,fontSize:16}}>{selected}번 테이블 상세</div>
                  <span className={`badge ${statusClass[t.status]}`} style={{marginTop:6}}>
                    {statusLabel[t.status]}
                  </span>
                </div>
                <button onClick={() => setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#94a3b8'}}>✕</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginTop:16}}>
                <div><div style={{fontSize:11,color:'#94a3b8',fontWeight:600}}>착석 인원</div><div style={{fontSize:18,fontWeight:700,marginTop:4}}>{t.guests > 0 ? `${t.guests}명` : '-'}</div></div>
                <div><div style={{fontSize:11,color:'#94a3b8',fontWeight:600}}>체류 시간</div><div style={{fontSize:18,fontWeight:700,marginTop:4}}>{t.time}</div></div>
                <div><div style={{fontSize:11,color:'#94a3b8',fontWeight:600}}>주문 금액</div><div style={{fontSize:18,fontWeight:700,marginTop:4}}>{t.order > 0 ? `₩${t.order.toLocaleString()}` : '-'}</div></div>
                <div>
                  <div style={{fontSize:11,color:'#94a3b8',fontWeight:600}}>AI 예측</div>
                  <div style={{fontSize:13,fontWeight:600,marginTop:4,color:'#6366f1'}}>{t.aiPredict}</div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Table List */}
        <div className="card" style={{padding:0}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid #e2e8f0',fontWeight:600,fontSize:15}}>전체 테이블 목록</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>테이블</th>
                  <th>상태</th>
                  <th>인원</th>
                  <th>체류/예약</th>
                  <th>주문 금액</th>
                  <th>AI 예측</th>
                </tr>
              </thead>
              <tbody>
                {tablesData.map(t => (
                  <tr key={t.id} style={{cursor:'pointer'}} onClick={() => setSelected(t.id === selected ? null : t.id)}>
                    <td><strong>{t.id}번</strong></td>
                    <td><span className={`badge ${statusClass[t.status]}`}>{statusLabel[t.status]}</span></td>
                    <td>{t.guests > 0 ? `${t.guests}명` : '-'}</td>
                    <td>{t.time}</td>
                    <td>{t.order > 0 ? `₩${t.order.toLocaleString()}` : '-'}</td>
                    <td style={{color:'#6366f1',fontSize:12,fontWeight:500}}>{t.aiPredict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}
