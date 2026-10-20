'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Code2 } from 'lucide-react';
import SkillsCube from './SkillsCube';

const stories=[
 {label:'01 / NEXT.JS · APPLICATIONS',title:'From an idea.',accent:'To an experience.',body:'I’m Huy, a Frontend Developer. I use Next.js to turn an idea into a web experience with clear structure, responsive layouts and interactions that feel considered from the first click.',note:'BillMate and BoardRealm are where that thinking takes shape: real problems, connected screens and details refined through building, testing and iteration.',tags:['Next.js','App Router','TypeScript','Responsive UI']},
 {label:'02 / REACT.JS · INTERACTION',title:'Small components.',accent:'Connected experiences.',body:'A good interface is a conversation: every input changes something, every action deserves a clear response. React is how I connect those moments into an experience that feels coherent.',note:'I work with reusable components and deliberate state flows, using tools such as Zustand to keep complex interactions understandable as a project grows.',tags:['React.js','Components','State Design','Zustand']},
 {label:'03 / UI & MOTION · CRAFT',title:'Make it clear.',accent:'Make it feel alive.',body:'I care about the space between a working interface and one people enjoy using. Typography, spacing and visual hierarchy give a screen its clarity; motion gives each change a sense of direction.',note:'Tailwind CSS, Framer Motion and Recharts help me explore those details — from responsive layouts and expressive transitions to data that is easier to read.',tags:['Tailwind CSS','Framer Motion','Recharts','UI Details']},
 {label:'04 / MARKETS · NQ / ES / YM',title:'Three markets.',accent:'A focused perspective.',body:'Beyond the frontend, my attention turns to NQ, ES and YM. A defined watchlist gives me a consistent space to observe price, compare context and develop a more deliberate reading of the market.',note:'The New York morning — NYAM — is my chosen session. A focused routine leaves room to prepare, stay present and reflect on the decisions that matter.',tags:['NQ','ES','YM','NYAM Session']},
 {label:'05 / QT × ICT · CONTEXT',title:'Read the context.',accent:'Then build the idea.',body:'Quarter Theory × ICT gives structure to how I approach a trading session. I look at the relationship between time, price and market context before shaping an idea worth paying attention to.',note:'A framework gives me questions to ask, rather than certainty to defend. The aim is to stay patient, recognise the conditions I understand and leave room for the market to change.',tags:['Quarter Theory','ICT Concepts','Time & Price','Context']},
 {label:'06 / RISK · DISCIPLINE',title:'Before the entry.',accent:'Understand the risk.',body:'A trading idea starts with a boundary: what would make it wrong? Clear invalidation, considered position sizing and a defined risk are the foundations of a decision I can review honestly.',note:'For me, discipline means giving the process as much attention as the outcome. The same mindset connects both worlds: build with intention, test assumptions and keep improving.',tags:['Risk Management','Position Sizing','Invalidation','Discipline']}
];
export default function AboutSkills(){
 const [active,setActive]=useState(0);const [shown,setShown]=useState(0);const copy=useRef<HTMLDivElement>(null);const entering=useRef<Animation[]>([]);
 useEffect(()=>{
  if(active===shown)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){setShown(active);return}
  entering.current.forEach(a=>a.cancel());
  const exit=copy.current?.animate([{opacity:1,transform:'translateY(0)',filter:'blur(0)'},{opacity:0,transform:'translateY(-12px)',filter:'blur(3px)'}],{duration:170,easing:'ease-in',fill:'forwards'});
  let cancelled=false;
  void exit?.finished.then(()=>{if(!cancelled)setShown(active)}).catch(()=>{});
  return()=>{cancelled=true;exit?.cancel()};
 },[active,shown]);
 useLayoutEffect(()=>{
  const root=copy.current;if(!root||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const animations:Animation[]=[];
  root.querySelectorAll('[data-story-piece]').forEach((piece,i)=>{
   const animation=piece.animate([{opacity:0,transform:'translate3d(0,22px,0)',filter:'blur(5px)'},{opacity:1,transform:'translate3d(0,0,0)',filter:'blur(0)'}],{duration:620,delay:i*65,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
   animations.push(animation);void animation.finished.then(()=>animation.cancel()).catch(()=>{});
  });entering.current=animations;
  return()=>animations.forEach(a=>a.cancel());
 },[shown]);
 const story=stories[shown];
 return <section id="about" className="focus-about"><SkillsCube onActiveChange={setActive}/><div className="skill-story-shell"><div className="skill-story" ref={copy} data-perspective={shown<3?'dev':'trading'}><div className="skill-story-label" data-story-piece>{story.label}</div><h2><span className="skill-title-line" data-story-piece>{story.title}</span><em className="skill-title-line" data-story-piece>{story.accent}</em></h2><p data-story-piece>{story.body}</p><p className="skill-story-note" data-story-piece>{story.note}</p><div className="personal-stack" aria-label="Current skill topics" data-story-piece>{story.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div><a className="profile-github" href="https://github.com/hdieuhuy" target="_blank" rel="noopener noreferrer"><Code2 size={14}/> github.com/hdieuhuy <ArrowUpRight size={13}/></a></div></section>;
}
