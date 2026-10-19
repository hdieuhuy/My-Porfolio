'use client';
import { Children, cloneElement, isValidElement, useLayoutEffect, useRef, type CSSProperties, type ReactNode, type ReactElement } from 'react';

export function MotionText({children}:{children:ReactNode}){
 let word=0;
 function plain(nodes:ReactNode):string{return Children.toArray(nodes).map(node=>typeof node==='string'||typeof node==='number'?String(node):isValidElement<{children?:ReactNode}>(node)?node.type==='br'?' ':plain(node.props.children):'').join('')}
 function split(nodes:ReactNode):ReactNode{return Children.map(nodes,node=>{
  if(typeof node==='string'||typeof node==='number')return String(node).split(/(\s+)/).map((part,i)=>/^\s+$/.test(part)?<span className="motion-space" key={i}>{'\u00a0'}</span>:<span className="motion-word-mask" key={i}><span className="motion-word" style={{'--word-index':word++} as CSSProperties}>{part}</span></span>);
  if(isValidElement<{children?:ReactNode}>(node)&&node.props.children)return cloneElement(node as ReactElement<{children?:ReactNode}>,{},split(node.props.children));
  return node;
 })}
 return <><span className="motion-sr-only">{plain(children)}</span><span className="motion-words" aria-hidden="true">{split(children)}</span></>;
}

export default function SceneContent({children}:{children:ReactNode}){
 const host=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const root=host.current!;const reduced=matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches)return;
  const animations:Animation[]=[];const ease='cubic-bezier(.16,1,.3,1)';
  function animate(el:Element,frames:Keyframe[],duration:number,delay:number){const animation=el.animate(frames,{duration,delay,easing:ease,fill:'both'});animations.push(animation);void animation.finished.then(()=>animation.cancel()).catch(()=>{})}
  const direction=Number(document.documentElement.style.getPropertyValue('--travel-direction'))||1;
  root.querySelectorAll('.motion-word').forEach((el,i)=>animate(el,[{transform:`translate3d(0,${direction*115}%,0) rotate(${direction*5}deg)`,opacity:0,filter:'blur(4px)'},{transform:'translate3d(0,0,0) rotate(0)',opacity:1,filter:'blur(0)'}],1000,110+i*48));
  root.querySelectorAll('.eyebrow').forEach(el=>animate(el,[{opacity:0,transform:'translateY(12px)',letterSpacing:'4px'},{opacity:1,transform:'translateY(0)'}],800,120));
  root.querySelectorAll('.hero-copy>p,.focus-about>div>p,.section-heading>p,.contact>div>p').forEach((el,i)=>animate(el,[{opacity:0,transform:`translateY(${direction*23}px)`,filter:'blur(4px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],900,320+i*90));
  root.querySelectorAll('.hero-actions,.mode-switch,.values,.work-toolbar,.project-pager').forEach((el,i)=>animate(el,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],850,440+i*65));
  root.querySelectorAll('.hero-art,.about-emblem').forEach(el=>animate(el,[{opacity:0,transform:`perspective(1200px) translate3d(50px,${direction*35}px,-90px) rotateY(-12deg) scale(.88)`,filter:'blur(5px)'},{opacity:1,transform:'perspective(1200px) translate3d(0,0,0) rotateY(0) scale(1)',filter:'blur(0)'}],1250,140));
  root.querySelectorAll('.project').forEach((el,i)=>{
   animate(el,[{opacity:0,transform:`perspective(1200px) translateY(${direction*60}px) rotateX(10deg) scale(.96)`},{opacity:1,transform:'perspective(1200px) translateY(0) rotateX(0) scale(1)'}],1050,210+i*160);
   el.querySelectorAll('.project-info>*,.preview-pill-row').forEach((piece,j)=>animate(piece,[{opacity:0,transform:'translateY(13px)'},{opacity:1,transform:'translateY(0)'}],750,430+i*140+j*65));
  });
  root.querySelectorAll('.chart-panel,.certificate-card,.principle,.contact form label,.contact form>.button').forEach((el,i)=>animate(el,[{opacity:0,transform:`translateY(${direction*25}px)`,filter:'blur(2px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],900,230+i*95));
  const stop=()=>animations.forEach(a=>a.cancel());reduced.addEventListener('change',stop);
  return()=>{stop();reduced.removeEventListener('change',stop)};
 },[]);
 return <div className="focus-scene content-choreography" ref={host}>{children}</div>;
}
