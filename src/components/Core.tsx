'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
export default function Core({ mode }: { mode: 'dev' | 'trader' }) {
 const host = useRef<HTMLDivElement>(null); const active = useRef(mode);
 useEffect(()=>{active.current=mode},[mode]);
 useEffect(()=>{
  const el=host.current!; let renderer: THREE.WebGLRenderer;
  try { renderer=new THREE.WebGLRenderer({alpha:true,antialias:true}); } catch { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(); const camera=new THREE.PerspectiveCamera(38,1,0.1,100);camera.position.set(0,0,7.8);
  const group=new THREE.Group();scene.add(group);
  const geometry=new THREE.TorusKnotGeometry(1.12,.34,180,32,2,3);
  const material=new THREE.MeshStandardMaterial({color:0x182c50,metalness:1,roughness:.24});
  const knot=new THREE.Mesh(geometry,material);group.add(knot);
  const wireGeo=new THREE.TorusKnotGeometry(1.125,.345,110,12,2,3);
  const wireMat=new THREE.MeshBasicMaterial({color:0x64b5ff,wireframe:true,transparent:true,opacity:.075});const wire=new THREE.Mesh(wireGeo,wireMat);group.add(wire);
  const ringGeo=new THREE.TorusGeometry(2.03,.008,8,160); const ringMat=new THREE.MeshBasicMaterial({color:0x4595dd,transparent:true,opacity:.5});
  const ring=new THREE.Mesh(ringGeo,ringMat);ring.rotation.x=1.12;ring.rotation.y=.25;group.add(ring);
  scene.add(new THREE.HemisphereLight(0xd7eaff,0x070f25,3));
  const key=new THREE.DirectionalLight(0xffffff,8);key.position.set(-3,4,3);scene.add(key);
  const orange=new THREE.PointLight(0x239cff,65,15);orange.position.set(2,-1,2);scene.add(orange);
  const edge=new THREE.DirectionalLight(0x72d7ff,5);edge.position.set(-3,-2,-2);scene.add(edge);
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()};const observer=new ResizeObserver(resize);observer.observe(el);resize();
  let px=0,py=0,frame=0;const move=(e:PointerEvent)=>{const rect=el.getBoundingClientRect();px=(e.clientX-rect.left)/rect.width-.5;py=(e.clientY-rect.top)/rect.height-.5};el.addEventListener('pointermove',move);const leave=()=>{px=py=0};el.addEventListener('pointerleave',leave);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const draw=()=>{frame=requestAnimationFrame(draw);const time=performance.now()*.0002;group.rotation.y+=(px*.6-group.rotation.y)*.025;group.rotation.x+=(py*.35-group.rotation.x)*.025;if(!reduced){knot.rotation.y=time;wire.rotation.y=time;knot.rotation.z=Math.sin(time)*.12;wire.rotation.z=knot.rotation.z;}const target=active.current==='dev'?1:.78;knot.scale.lerp(new THREE.Vector3(1,target,1),.04);wire.scale.copy(knot.scale);renderer.render(scene,camera)};draw();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);geometry.dispose();material.dispose();wireGeo.dispose();wireMat.dispose();ringGeo.dispose();ringMat.dispose();renderer.dispose();renderer.domElement.remove()};
 },[]);
 return <div className="core-canvas" ref={host} role="img" aria-label="Interactive graphite torus knot with cool blue lighting"/>;
}
