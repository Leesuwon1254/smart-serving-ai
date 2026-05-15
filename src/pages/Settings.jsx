import { useState } from 'react'
import Header from '../components/Header'

export default function Settings() {
  const [settings, setSettings] = useState({
    aiAlerts: true,
    peakPrediction: true,
    tableNotify: true,
    orderAlert: true,
    autoReport: false,
    darkMode: false,
    soundAlert: true,
    emailReport: false,
    alertThreshold: '30',
    peakBuffer: '15',
    storeName: '스마트 레스토랑',
    timezone: 'Asia/Seoul',
  })

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  const change = (key, val) => setSettings(prev => ({ ...prev, [key]: val }))

  const Toggle = ({ k }) => (
    <label className="toggle">
      <input type="checkbox" checked={settings[k]} onChange={() => toggle(k)} />
      <span className="toggle-slider" />
    </label>
  )

  return (
    <>
      <Header title="설정" subtitle="AI 시스템 및 알림 설정 관리" />
      <div className="page-content">
        <div style={{maxWidth:720}}>

          {/* Store Info */}
          <div className="card settings-section">
            <div style={{fontWeight:600,fontSize:15,marginBottom:16,paddingBottom:8,borderBottom:'1px solid #e2e8f0'}}>매장 정보</div>
            <div className="settings-row">
              <div>
                <label>매장명</label>
                <div className="desc">대시보드에 표시될 매장 이름</div>
              </div>
              <input
                value={settings.storeName}
                onChange={e => change('storeName', e.target.value)}
                style={{padding:'6px 12px',border:'1px solid #e2e8f0',borderRadius:6,fontSize:13,width:200}}
              />
            </div>
            <div className="settings-row">
              <div>
                <label>시간대</label>
                <div className="desc">알림 및 리포트 기준 시간</div>
              </div>
              <select
                value={settings.timezone}
                onChange={e => change('timezone', e.target.value)}
                style={{padding:'6px 12px',border:'1px solid #e2e8f0',borderRadius:6,fontSize:13}}
              >
                <option value="Asia/Seoul">서울 (KST +9)</option>
                <option value="Asia/Tokyo">도쿄 (JST +9)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          {/* AI Settings */}
          <div className="card settings-section">
            <div style={{fontWeight:600,fontSize:15,marginBottom:16,paddingBottom:8,borderBottom:'1px solid #e2e8f0'}}>AI 분석 설정</div>
            {[
              { key:'aiAlerts',       label:'AI 알림 활성화',    desc:'AI 예측 기반 자동 알림 생성' },
              { key:'peakPrediction', label:'피크타임 예측',      desc:'시간대별 고객 유입 사전 예측' },
              { key:'tableNotify',    label:'테이블 퇴석 예측',   desc:'고객 체류 패턴 분석 및 알림' },
              { key:'orderAlert',     label:'추가 주문 예측',     desc:'식사 패턴 기반 추가 주문 가능성 알림' },
              { key:'autoReport',     label:'자동 일일 리포트',   desc:'매일 영업 종료 후 자동 분석 리포트 생성' },
            ].map(item => (
              <div key={item.key} className="settings-row">
                <div>
                  <label>{item.label}</label>
                  <div className="desc">{item.desc}</div>
                </div>
                <Toggle k={item.key} />
              </div>
            ))}
            <div className="settings-row">
              <div>
                <label>알림 임계값 (분)</label>
                <div className="desc">체류 시간이 이 값 초과 시 알림 발생</div>
              </div>
              <input
                type="number"
                value={settings.alertThreshold}
                onChange={e => change('alertThreshold', e.target.value)}
                min="10" max="120"
                style={{padding:'6px 12px',border:'1px solid #e2e8f0',borderRadius:6,fontSize:13,width:80}}
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card settings-section">
            <div style={{fontWeight:600,fontSize:15,marginBottom:16,paddingBottom:8,borderBottom:'1px solid #e2e8f0'}}>알림 설정</div>
            {[
              { key:'soundAlert',  label:'소리 알림',        desc:'긴급 알림 시 소리 재생' },
              { key:'emailReport', label:'이메일 리포트',    desc:'주간 분석 리포트 이메일 발송' },
              { key:'darkMode',    label:'다크 모드 (준비 중)', desc:'어두운 테마로 전환' },
            ].map(item => (
              <div key={item.key} className="settings-row">
                <div>
                  <label>{item.label}</label>
                  <div className="desc">{item.desc}</div>
                </div>
                <Toggle k={item.key} />
              </div>
            ))}
          </div>

          {/* System Info */}
          <div className="card">
            <div style={{fontWeight:600,fontSize:15,marginBottom:16,paddingBottom:8,borderBottom:'1px solid #e2e8f0'}}>시스템 정보</div>
            {[
              { label:'AI 엔진 버전',   value:'v2.1.0' },
              { label:'모델 정확도',    value:'94.2%' },
              { label:'마지막 학습',    value:'2026-05-14 03:00' },
              { label:'프론트엔드',     value:'React 18 + Vite 5' },
              { label:'배포 환경',      value:'Render (Static Site)' },
            ].map(item => (
              <div key={item.label} className="settings-row">
                <label style={{color:'#64748b'}}>{item.label}</label>
                <span style={{fontSize:13,fontWeight:600,color:'#334155'}}>{item.value}</span>
              </div>
            ))}
            <div style={{marginTop:16,display:'flex',gap:10}}>
              <button className="btn btn-primary">변경 사항 저장</button>
              <button className="btn btn-outline">초기화</button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
