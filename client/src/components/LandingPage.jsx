import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Map as MapIcon, BookOpen, Zap, Box, Crosshair, Shield } from 'lucide-react';
import skillTreeBanner from '../assets/arc_raiders_banner_v3.png';

const LandingPage = () => {
    const navigate = useNavigate();
    // Scroll effect removed for new laser animation

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative font-sans">
            {/* Dynamic Laser Animation */}
            <div
                className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
                style={{
                    maskImage: 'linear-gradient(to top, black 0%, black 70%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 0%, black 70%, transparent 100%)'
                }}
            >
                {[
                    // Fast & Thin
                    { color: 'bg-cyan-500', delay: '0s', left: '10%', duration: '2s', width: 'w-0.5 md:w-1', height: 'h-[30vh]', opacity: 'opacity-60' },
                    { color: 'bg-red-500', delay: '0.5s', left: '85%', duration: '1.8s', width: 'w-0.5 md:w-1', height: 'h-[25vh]', opacity: 'opacity-70' },

                    // Medium & Standard
                    { color: 'bg-green-500', delay: '1.5s', left: '30%', duration: '4s', width: 'w-1 md:w-2', height: 'h-[40vh]', opacity: 'opacity-40' },
                    { color: 'bg-yellow-500', delay: '0.8s', left: '60%', duration: '3.5s', width: 'w-1 md:w-2', height: 'h-[45vh]', opacity: 'opacity-50' },

                    // Slow & Thick (Background feel)
                    { color: 'bg-cyan-500', delay: '2.5s', left: '45%', duration: '5s', width: 'w-1.5 md:w-3', height: 'h-[60vh]', opacity: 'opacity-20' },
                    { color: 'bg-red-500', delay: '3.2s', left: '15%', duration: '4.5s', width: 'w-1.5 md:w-3', height: 'h-[50vh]', opacity: 'opacity-30' },

                    // Extra Fast Bursts
                    { color: 'bg-yellow-500', delay: '4s', left: '75%', duration: '1.5s', width: 'w-0.5', height: 'h-[20vh]', opacity: 'opacity-80' },
                    { color: 'bg-green-500', delay: '2.8s', left: '5%', duration: '2.2s', width: 'w-0.5', height: 'h-[35vh]', opacity: 'opacity-60' }
                ].map((laser, index) => (
                    <div
                        key={index}
                        className={`absolute bottom-0 ${laser.width} ${laser.height} ${laser.color} ${laser.opacity}`}
                        style={{
                            left: laser.left,
                            animation: `laser-shoot ${laser.duration} infinite linear`,
                            animationDelay: laser.delay,
                            boxShadow: `0 0 15px ${laser.color === 'bg-cyan-500' ? '#06b6d4' : laser.color === 'bg-green-500' ? '#22c55e' : laser.color === 'bg-yellow-500' ? '#eab308' : '#ef4444'}`,
                            filter: 'blur(1px)',
                            borderRadius: '9999px'
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
                <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="ARC Raiders" className="h-10 object-contain drop-shadow-lg" />
                    <span className="font-bold text-xl tracking-wider drop-shadow-md">ARC Raiders KR</span>
                </div>
                <button
                    onClick={() => navigate('/map')}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-full transition-colors flex items-center gap-2 shadow-lg"
                >
                    <MapIcon size={18} />
                    Launch Map
                </button>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-8">
                <div
                    className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/1-8f93acea.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
                    레이더스여, 집결하라!
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-lg">
                    아크의 위협에 맞서 생존을 위한 여정이 시작된다.
                    <br />
                    <span className="text-sm text-gray-300 mt-2 block font-light">ARC Raiders KR에서 당신의 여정을 준비하세요.</span>
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate('/map')}
                        className="group bg-arc-accent hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-orange-500/20 hover:scale-105"
                    >
                        맵 정보 확인하기
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section >

            {/* Feature Cards Grid */}
            < section className="relative z-10 py-20 px-8 max-w-7xl mx-auto" >
                <h2 className="text-3xl font-bold mb-12 text-center">환영합니다, 레이더!</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Skill Tree Banner */}
                    <div
                        className="col-span-1 md:col-span-2 lg:col-span-3 relative rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-500/50 transition-all group cursor-pointer h-32"
                        onClick={() => navigate('/skills')}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${skillTreeBanner})` }}
                        />

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

                        {/* Content */}
                        <div className="relative h-full flex flex-col justify-center px-8 z-10">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-500/30">NEW FEATURE</div>
                            </div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors flex items-center gap-2">
                                실시간 스킬 트리 제작
                                <Zap size={18} className="text-yellow-500" />
                            </h3>
                            <p className="text-gray-300 text-sm mt-1 max-w-md">나만의 최적화된 스킬 트리를 구성하고 공유하세요.</p>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1 cursor-pointer">
                        <BookOpen className="text-cyan-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">가이드</h3>
                        <p className="text-gray-400 text-sm mb-4">초보자부터 전문가까지, 생존을 위한 필수 지식.</p>
                        <button className="text-cyan-400 text-sm font-bold hover:underline">자세히 보기</button>
                    </div>

                    <div
                        onClick={() => navigate('/map')}
                        className="bg-gray-900 rounded-2xl p-6 border border-white/10 hover:border-yellow-500/50 transition-all hover:-translate-y-1 cursor-pointer group"
                    >
                        <MapIcon className="text-yellow-500 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400">맵</h3>
                        <p className="text-gray-400 text-sm mb-4">자원, 탈출구, 위험 지역을 한눈에 파악하세요.</p>
                        <button className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-lg text-sm font-bold group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                            입장하기
                        </button>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1 cursor-pointer">
                        <Zap className="text-orange-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">스킬 & 진행</h3>
                        <p className="text-gray-400 text-sm mb-4">캐릭터 성장과 스킬 마스터리 가이드.</p>
                        <button className="text-orange-400 text-sm font-bold hover:underline">살펴보기</button>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1 cursor-pointer">
                        <Crosshair className="text-red-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">무기 데이터베이스</h3>
                        <p className="text-gray-400 text-sm">모든 무기의 스탯과 파츠 정보.</p>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1 cursor-pointer">
                        <Box className="text-purple-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">아이템 데이터베이스</h3>
                        <p className="text-gray-400 text-sm">파밍 가능한 모든 아이템 목록.</p>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1 cursor-pointer">
                        <Shield className="text-green-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">로드아웃</h3>
                        <p className="text-gray-400 text-sm">상황별 추천 장비 세팅.</p>
                    </div>
                </div>
            </section >

            {/* News Section */}
            < section className="relative z-10 py-20 px-8 max-w-7xl mx-auto border-t border-white/5" >
                <h2 className="text-2xl font-bold mb-8">아크레이더스 소식</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            id: 41,
                            title: "MCN 대전 X 아크 레이더스",
                            date: "2024. 10. 22",
                            link: "https://arcraiders.nexon.com/ko-KR/news/41",
                            image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1808500/header.jpg"
                        },
                        {
                            id: 39,
                            title: "The Evolution of ARC Raiders EP2: The Life of a Raider",
                            date: "2024. 10. 21",
                            link: "https://arcraiders.nexon.com/ko-KR/news/39",
                            image: "https://img.youtube.com/vi/C8w79-x1gqE/maxresdefault.jpg"
                        },
                        {
                            id: 38,
                            title: "Update 1.4.0",
                            date: "2024. 10. 21",
                            link: "https://arcraiders.nexon.com/ko-KR/news/38",
                            image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1808500/capsule_616x353.jpg"
                        },
                        {
                            id: 37,
                            title: "A Scrappy origin story",
                            date: "2024. 10. 16",
                            link: "https://arcraiders.nexon.com/ko-KR/news/37",
                            image: "https://img.youtube.com/vi/QjJ2wKCMq5w/maxresdefault.jpg"
                        }
                    ].map((item) => (
                        <div
                            key={item.id}
                            className="group cursor-pointer"
                            onClick={() => window.open(item.link, '_blank')}
                        >
                            <div className="aspect-video bg-gray-800 rounded-xl mb-4 overflow-hidden relative">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <ArrowRight className="text-white" />
                                </div>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded">NEWS</span>
                            </div>
                            <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-500 text-sm">{item.date}</p>
                        </div>
                    ))}
                </div>
            </section >

            {/* Footer */}
            < footer className="relative z-10 py-12 px-8 border-t border-white/10 bg-black text-center text-gray-600 text-sm" >
                <p>&copy; 2025 ARC Raiders KR. All rights reserved.</p>
                <p className="mt-2">This is a fan-made site and is not affiliated with Embark Studios.</p>
            </footer >
        </div >
    );
};

export default LandingPage;
