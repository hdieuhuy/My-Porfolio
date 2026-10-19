'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
export const scenes = ['Home', 'Work', 'About', 'Trading', 'Contact'];
export function useFocusNavigation(blocked: boolean) {
 const [scene,setScene]=useState(0);const [direction,setDirection]=useState(1);
 const [phase,setPhase]=useState<'idle'|'out'|'in'>('idle');
 const [transitionId,setTransitionId]=useState(0);
 const [engine,setEngine]=useState<'native'|'fallback'>('fallback');
 const pending=useRef<number|null>(null);const dispatch=useRef<(next:number)=>void>(()=>{});
 const nativeTransition=useRef<{skipTransition:()=>void}|null>(null);
 useEffect(()=>{const supported=typeof document.startViewTransition==='function';setEngine(supported?'native':'fallback');document.documentElement.classList.toggle('native-motion',supported);return()=>{nativeTransition.current?.skipTransition();document.documentElement.classList.remove('native-motion')}},[]);
 const current=useRef(0);const lockedUntil=useRef(0);const busy=useRef(false);const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 useEffect(()=>()=>{timers.current.forEach(clearTimeout)},[]);
 const go=useCallback((next:number,instant=false)=>{
  next=Math.max(0,Math.min(scenes.length-1,next));
  if(busy.current){pending.current=next;return}
  if(next===current.current)return;
  const dir=next>current.current?1:-1;
  const commit=()=>{current.current=next;setScene(next);history.replaceState(null,'',next?'#'+scenes[next].toLowerCase():location.pathname)};
  document.documentElement.style.setProperty('--travel-direction',String(dir));
  setDirection(dir);
  if(instant||matchMedia('(prefers-reduced-motion: reduce)').matches){commit();lockedUntil.current=performance.now()+250;return}
  busy.current=true;lockedUntil.current=performance.now()+1150;
  const finish=()=>{setPhase('idle');busy.current=false;nativeTransition.current=null;const target=pending.current;pending.current=null;if(target!==null&&target!==current.current)dispatch.current(target)};
  timers.current.forEach(clearTimeout);
  setTransitionId(id=>id+1);
  if(typeof document.startViewTransition==='function'){
   // Snapshots preserve both layouts without duplicating live forms or WebGL trees.
   flushSync(()=>setPhase('out'));
   const transition=document.startViewTransition(()=>{flushSync(()=>{commit();setPhase('in')})});
   nativeTransition.current=transition;
   void transition.finished.catch(()=>{}).then(finish);
  }else{
   setPhase('out');
   timers.current=[setTimeout(()=>{commit();setPhase('in')},340),setTimeout(finish,1320)];
  }
 },[]);
 useEffect(()=>{dispatch.current=go},[go]);
 useEffect(()=>{
  const initial=scenes.findIndex(s=>'#'+s.toLowerCase()===location.hash);if(initial>0)go(initial,true);
  const hash=()=>{const i=scenes.findIndex(s=>'#'+s.toLowerCase()===location.hash);go(Math.max(0,i))};addEventListener('hashchange',hash);
  return()=>removeEventListener('hashchange',hash);
 },[go]);
 useEffect(()=>{
  document.documentElement.classList.add('focus-experience');let total=0,last=0,startX=0,startY=0;
  const interactive=(target:EventTarget|null)=>target instanceof Element&&!!target.closest('input,textarea,select,[contenteditable="true"],[role="dialog"]');
  const wheel=(event:WheelEvent)=>{
   if(blocked||interactive(event.target)||event.ctrlKey)return;
   event.preventDefault();const now=performance.now();if(now<lockedUntil.current){last=now;total=0;return}
   if(now-last>180||Math.sign(total)!==Math.sign(event.deltaY))total=0;last=now;
   total+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
   if(Math.abs(total)>65){go(current.current+Math.sign(total));total=0;}
  };
  const key=(event:KeyboardEvent)=>{if(blocked||interactive(event.target)||event.altKey||event.ctrlKey||event.metaKey)return;
   const step=['ArrowDown','PageDown'].includes(event.key)?1:['ArrowUp','PageUp'].includes(event.key)?-1:0;
   if(step){event.preventDefault();if(performance.now()>=lockedUntil.current)go(current.current+step)}
   if(event.key==='Home'||event.key==='End'){event.preventDefault();go(event.key==='Home'?0:scenes.length-1)}
  };
  const start=(event:TouchEvent)=>{startX=event.touches[0].clientX;startY=event.touches[0].clientY};
  const end=(event:TouchEvent)=>{if(blocked||interactive(event.target)||performance.now()<lockedUntil.current)return;const dx=event.changedTouches[0].clientX-startX,dy=event.changedTouches[0].clientY-startY;if(Math.abs(dy)>65&&Math.abs(dy)>Math.abs(dx)*1.2)go(current.current+(dy<0?1:-1))};
  addEventListener('wheel',wheel,{passive:false});addEventListener('keydown',key);addEventListener('touchstart',start,{passive:true});addEventListener('touchend',end,{passive:true});
  return()=>{document.documentElement.classList.remove('focus-experience');removeEventListener('wheel',wheel);removeEventListener('keydown',key);removeEventListener('touchstart',start);removeEventListener('touchend',end)};
 },[blocked,go]);
 return {scene,direction,go,phase,transitionId,engine};
}
