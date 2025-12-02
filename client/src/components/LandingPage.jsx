import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Map as MapIcon, BookOpen, Zap, Box, Crosshair, Shield, Users, LogIn, LogOut, User } from 'lucide-react';
import useStore from '../store/useStore';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, logout, openLoginModal, openMyPageModal } = useStore();

    const handleLogout = () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            logout();
        }
    };

    // Updated card style: No background image, dark theme, clean look
    const cardBackgroundStyle = "bg-[#121212] border border-gray-800 hover:border-arc-accent/50 transition-all duration-300 group cursor-pointer relative overflow-hidden rounded-2xl hover:bg-[#1a1a1a] hover:shadow-xl hover:shadow-arc-accent/10 hover:-translate-y-1";

    // Overlay is no longer needed for masking, but we can keep a subtle gradient or remove it.
    // Let's remove the heavy overlay and just use a subtle gradient for depth if needed.
    const cardOverlayStyle = "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none";

    const cardContentStyle = "relative z-10 h-full flex flex-col justify-between p-8";

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
                    { color: 'bg-cyan-500', delay: '0s', left: '10%', duration: '2s', width: 'w-0.5 md:w-1', height: 'h-[30vh]', opacity: 'opacity-60' },
                    { color: 'bg-red-500', delay: '0.5s', left: '85%', duration: '1.8s', width: 'w-0.5 md:w-1', height: 'h-[25vh]', opacity: 'opacity-70' },
                    { color: 'bg-green-500', delay: '1.5s', left: '30%', duration: '4s', width: 'w-1 md:w-2', height: 'h-[40vh]', opacity: 'opacity-40' },
                    { color: 'bg-yellow-500', delay: '0.8s', left: '60%', duration: '3.5s', width: 'w-1 md:w-2', height: 'h-[45vh]', opacity: 'opacity-50' },
                    { color: 'bg-cyan-500', delay: '2.5s', left: '45%', duration: '5s', width: 'w-1.5 md:w-3', height: 'h-[60vh]', opacity: 'opacity-20' },
                    { color: 'bg-red-500', delay: '3.2s', left: '15%', duration: '4.5s', width: 'w-1.5 md:w-3', height: 'h-[50vh]', opacity: 'opacity-30' },
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
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
                <div className="flex items-center justify-between px-8 py-4 bg-[#121212]/90 backdrop-blur-md border border-gray-800 rounded-full shadow-2xl pointer-events-auto min-w-[600px] max-w-4xl w-full mx-4">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo_white.png" alt="ARC Raiders" className="h-8 object-contain drop-shadow-lg" />
                        <span className="font-bold text-lg tracking-wider drop-shadow-md">ARCR MAP</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
                        <button
                            onClick={() => navigate('/community')}
                            className="hover:text-arc-accent transition-colors"
                        >
                            커뮤니티
                        </button>
                        <span className="text-gray-700">|</span>

                        {user ? (
                            <>
                                <button
                                    onClick={openMyPageModal}
                                    className="hover:text-arc-accent transition-colors flex items-center gap-1"
                                >
                                    <span className="text-white font-bold">{user.nickname || user.username}</span>
                                    <span>님</span>
                                </button>
                                <span className="text-gray-700">|</span>
                                <button
                                    onClick={openMyPageModal}
                                    className="hover:text-white transition-colors"
                                >
                                    내 정보
                                </button>
                                <span className="text-gray-700">|</span>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-white transition-colors"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={openLoginModal}
                                className="hover:text-white transition-colors"
                            >
                                로그인
                            </button>
                        )}
                    </div>
                </div>
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
                    <span className="text-sm text-gray-300 mt-2 block font-light">ARCR MAP에서 당신의 여정을 준비하세요.</span>
                </p>
            </section >

            {/* Feature Cards Grid */}
            <section className="relative z-10 py-20 px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center text-white drop-shadow-lg">환영합니다, 레이더!</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Map - Priority 1 */}
                    <div
                        onClick={() => navigate('/map')}
                        className={`col-span-1 md:col-span-2 lg:col-span-2 ${cardBackgroundStyle}`}
                    >
                        <div className={cardOverlayStyle} />
                        <div className={cardContentStyle}>
                            <div className="flex flex-col h-full justify-center items-start">
                                <MapIcon className="text-yellow-500 mb-4 relative z-10" size={32} />
                                <h3 className="text-3xl font-bold mb-2 group-hover:text-yellow-400 relative z-10">맵 (Map)</h3>
                                <p className="text-gray-300 text-lg mb-6 relative z-10 max-w-xl">자원, 탈출구, 위험 지역을 한눈에 파악하세요. 생존을 위한 필수 지도입니다.</p>
                                <button className="bg-yellow-500 text-black px-6 py-3 rounded-xl text-base font-bold hover:bg-yellow-400 transition-colors relative z-10 flex items-center gap-2">
                                    <span>입장하기</span>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Board - Priority 2 */}
                    <div
                        className={cardBackgroundStyle}
                        onClick={() => navigate('/community')}
                    >
                        <div className={cardOverlayStyle} />
                        <div className={cardContentStyle}>
                            <Users className="text-orange-400 mb-4 relative z-10" size={32} />
                            <h3 className="text-xl font-bold mb-2 relative z-10">게시판</h3>
                            <p className="text-gray-300 text-sm mb-4 relative z-10">유저들과 정보를 공유하고 소통하세요.</p>
                            <button className="text-orange-400 text-sm font-bold hover:underline relative z-10">입장하기</button>
                        </div>
                    </div>

                    {/* Skill Tree - Priority 3 */}
                    <div
                        className={cardBackgroundStyle}
                        onClick={() => navigate('/skills')}
                    >
                        <div className={cardOverlayStyle} />
                        <div className={cardContentStyle}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-bold border border-blue-500/30">NEW</div>
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors flex items-center gap-2 mb-2">
                                스킬 트리
                                <Zap size={20} className="text-yellow-500" />
                            </h3>
                            <p className="text-gray-400 text-sm">나만의 최적화된 스킬 트리를 구성하세요.</p>
                        </div>
                    </div>

                    {/* Guide - Coming Soon */}
                    <div className={`${cardBackgroundStyle} opacity-60 cursor-not-allowed hover:border-gray-800 hover:bg-[#121212] hover:shadow-none hover:translate-y-0`}>
                        <div className={cardContentStyle}>
                            <div className="flex justify-between items-start mb-4">
                                <BookOpen className="text-gray-600 relative z-10" size={32} />
                                <span className="bg-gray-800 text-gray-500 px-2 py-1 rounded text-[10px] font-bold border border-gray-700">준비중</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-500 relative z-10">가이드</h3>
                            <p className="text-gray-600 text-sm relative z-10">초보자부터 전문가까지, 생존을 위한 필수 지식.</p>
                        </div>
                    </div>

                    {/* Weapons DB - Coming Soon */}
                    <div className={`${cardBackgroundStyle} opacity-60 cursor-not-allowed hover:border-gray-800 hover:bg-[#121212] hover:shadow-none hover:translate-y-0`}>
                        <div className={cardContentStyle}>
                            <div className="flex justify-between items-start mb-4">
                                <Crosshair className="text-gray-600 relative z-10" size={32} />
                                <span className="bg-gray-800 text-gray-500 px-2 py-1 rounded text-[10px] font-bold border border-gray-700">준비중</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-500 relative z-10">무기 DB</h3>
                            <p className="text-gray-600 text-sm relative z-10">모든 무기의 스탯과 파츠 정보.</p>
                        </div>
                    </div>

                    {/* Items DB - Coming Soon */}
                    <div className={`${cardBackgroundStyle} opacity-60 cursor-not-allowed hover:border-gray-800 hover:bg-[#121212] hover:shadow-none hover:translate-y-0`}>
                        <div className={cardContentStyle}>
                            <div className="flex justify-between items-start mb-4">
                                <Box className="text-gray-600 relative z-10" size={32} />
                                <span className="bg-gray-800 text-gray-500 px-2 py-1 rounded text-[10px] font-bold border border-gray-700">준비중</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-500 relative z-10">아이템 DB</h3>
                            <p className="text-gray-600 text-sm relative z-10">파밍 가능한 모든 아이템 목록.</p>
                        </div>
                    </div>

                    {/* Loadout - Coming Soon */}
                    <div className={`${cardBackgroundStyle} opacity-60 cursor-not-allowed hover:border-gray-800 hover:bg-[#121212] hover:shadow-none hover:translate-y-0`}>
                        <div className={cardContentStyle}>
                            <div className="flex justify-between items-start mb-4">
                                <Shield className="text-gray-600 relative z-10" size={32} />
                                <span className="bg-gray-800 text-gray-500 px-2 py-1 rounded text-[10px] font-bold border border-gray-700">준비중</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-500 relative z-10">로드아웃</h3>
                            <p className="text-gray-600 text-sm relative z-10">상황별 추천 장비 세팅.</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* News Section */}
            <section className="relative z-10 py-20 px-8 max-w-7xl mx-auto border-t border-white/5">
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
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 px-8 border-t border-white/10 bg-black text-center text-gray-600 text-sm">
                <p>&copy; 2025 ARCR MAP. All rights reserved.</p>
                <p className="mt-2">This is a fan-made site and is not affiliated with Embark Studios.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
