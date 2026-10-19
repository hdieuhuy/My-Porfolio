'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
const certificates=[
 {title:'Officially Funded Trader',detail:'High Stakes, 2.5K',date:'February 7, 2026',iso:'2026-02-07',image:'/images/achievements/officially-funded-trader-2026-02-07.png'},
 {title:'Quality Trade Score 90+',detail:'NAS100',date:'July 9, 2026',iso:'2026-07-09',image:'/images/achievements/quality-trade-2026-07-09.png'},
 {title:'Fantastic RRR',detail:'Risk-to-reward recognition',date:'July 9, 2026',iso:'2026-07-09',image:'/images/achievements/fantastic-rrr-2026-07-09.png'}
];
export default function TradingAchievements({onDialogChange}:{onDialogChange:(open:boolean)=>void}){
 const close=()=>{dialog.current?.close();setSelected(null);onDialogChange(false)};
 const [selected,setSelected]=useState<number|null>(null);const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{onDialogChange(selected!==null);if(selected!==null)dialog.current?.showModal();else dialog.current?.close();return()=>onDialogChange(false)},[selected,onDialogChange]);
 return <><div className="trading-achievements"><div className="achievement-heading"><span>TRADING MILESTONES</span><span>THE5ERS / HUY HUYNH</span></div><div className="certificate-grid">{certificates.map((c,i)=><button className="certificate-card" onClick={()=>setSelected(i)} key={c.title} aria-label={'View certificate: '+c.title}><div className="certificate-thumbnail"><Image src={c.image} alt={c.title+' certificate issued to Huy Huynh'} fill sizes="(max-width: 760px) 28vw, 16vw"/><span><ArrowUpRight size={14}/></span></div><div className="certificate-copy"><time dateTime={c.iso}>{c.date}</time><h3>{c.title}</h3><span>{c.detail}</span></div></button>)}</div><p className="achievement-caption">Milestones along the way. The work continues. · View originals</p></div><dialog ref={dialog} className="certificate-dialog" aria-label={selected===null?'Trading certificate':certificates[selected].title} onCancel={close} onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)close()}}>{selected!==null&&<><button className="certificate-close" aria-label="Close certificate" onClick={close}><X size={20}/></button><Image src={certificates[selected].image} alt={`${certificates[selected].title} — ${certificates[selected].detail}. Huy Huynh, ${certificates[selected].date}.`} width={2200} height={2200} sizes="(max-width: 760px) 90vw, 75vh"/><div className="certificate-dialog-caption">{certificates[selected].title} · {certificates[selected].date}</div></>}</dialog></>;
}
