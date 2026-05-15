import { useState } from 'react'
import Header from '../components/Header'
import { alertsData } from '../data/mockData'

const typeLabel = { critical: '긴급', warning: '경고', info: '정보', success: '완료' }
const typeClass = { critical: 'badge-danger', warning: 'badge-warning', info: 'badge-info', success: 'badge-success' }

export default function Alerts() {
  const [filter, setFilter] = useState('all')
  const [alerts, setAlerts] = useState(alertsData)

  const filtered = filter === 'all' ? alerts : filter === 'unread' ? alerts.filter(a => a.unread) : alerts.filter(a => a.type === filter)

  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, unread: false })))

  return (
    <>
      <Header title="실시간 알림" subtitle="AI 분석 알림 및 운영 알림 피드" />
      <div className="page-content">

        {/* Stats */}
        <div className="grid-4" style={{marginBottom:20}}>
          {[
            { label:'전체 알림', count: alerts.length, color:'#6366f1' },
            { label:'미확인',    count: alerts.filter(a=>a.unread).length, color:'#ef4444' },
            { label:'긴급/경고', count: alerts.filter(a=>a.type==='critical'||a.type==='warning').length, color:'#f59e0b' },
            { label:'AI 예측',   count: alerts.filter(a=>a.desc.includes('AI')||a.title.includes('AI')).length, color:'#8b5cf6' },
          ].map(item => (
            <div key={item.label} className="card" style={{textAlign:'center'}}>
              <div style={{fontSize:28,fontWeight:700,color:item.color}}>{item.count}</div>
              <div style={{fontSize:12,color:'#64748b',fontWeight:600,marginTop:4}}>{item.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{padding:0}}>
          {/* Filter bar */}
          <div style={{padding:'14px 20px',borderBottom:'1px solid #e2e8f0',display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            {[
              { key:'all',      label:'전체' },
              { key:'unread',   label:'미확인' },
              { key:'critical', label:'긴급' },
              { key:'warning',  label:'경고' },
              { key:'info',     label:'정보' },
              { key:'success',  label:'완료' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600,
                  border:'none', cursor:'pointer', transition:'all .2s',
                  background: filter === f.key ? '#6366f1' : '#f1f5f9',
                  color: filter === f.key ? 'white' : '#64748b',
                }}
              >
                {f.label}
              </button>
            ))}
            <button
              onClick={markAllRead}
              style={{marginLeft:'auto',padding:'5px 14px',borderRadius:20,fontSize:12,fontWeight:600,
                border:'1px solid #6366f1',cursor:'pointer',background:'white',color:'#6366f1'}}
            >
              모두 읽음 처리
            </button>
          </div>

          {/* Alert list */}
          {filtered.length === 0 ? (
            <div style={{padding:40,textAlign:'center',color:'#94a3b8',fontSize:14}}>알림이 없습니다.</div>
          ) : filtered.map(alert => (
            <div key={alert.id} className="alert-item" style={{background: alert.unread ? '#fafaf9' : 'white'}}>
              <div className={`alert-icon ${alert.type}`}>{alert.icon}</div>
              <div className="alert-body">
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div className="alert-title">{alert.title}</div>
                  <span className={`badge ${typeClass[alert.type]}`}>{typeLabel[alert.type]}</span>
                  {alert.unread && <span style={{width:7,height:7,borderRadius:'50%',background:'#6366f1',display:'inline-block'}}/>}
                </div>
                <div className="alert-desc">{alert.desc}</div>
                <div className="alert-time">{alert.time}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}
