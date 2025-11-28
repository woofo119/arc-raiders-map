import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Map as MapIcon, BookOpen, Zap, Box, Crosshair, Shield } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll animation calculation
    const getLineHeight = (index) => {
        const baseHeight = 100; // Initial height
        const speed = 1 + index * 0.2; // Different speeds for each line
        return Math.min(baseHeight + scrollY * speed, window.innerHeight);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative font-sans">
            {/* Scroll Animation Lines */}
            <div className="fixed top-0 left-10 z-0 flex gap-2 h-full pointer-events-none opacity-50">
                {['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-cyan-500'].map((color, index) => (
                    <div
                        key={index}
                        className={`w-2 rounded-b-full ${color} transition-all duration-100 ease-linear`}
                        style={{ height: `${getLineHeight(index)}px` }}
                    />
                ))}
            </div>

            {/* Header / Nav */}
            <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="ARC Raiders" className="h-8 object-contain" />
                    <span className="font-bold text-xl tracking-wider">ARC Raiders Hub</span>
                </div>
                <button
                    onClick={() => navigate('/map')}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-full transition-colors flex items-center gap-2"
                >
                    <MapIcon size={18} />
                    Launch Map
                </button>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 px-8 max-w-7xl mx-auto text-center">
                <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    ARC Raiders 마스터하기
                </h1>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    전략, 루트, 그리고 생존을 위한 모든 것이 이곳에 있습니다.
                    <br />
                    ARC Raiders의 세계를 지배하기 위한 가장 완벽한 가이드.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate('/map')}
                        className="group bg-white text-black font-bold py-4 px-8 rounded-xl text-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                        맵 정보 확인하기
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* Feature Cards Grid */}
            <section className="relative z-10 py-20 px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center">환영합니다, 레이더!</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Skill Tree Card (Wide) */}
                    <div
                        className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-white/10 hover:border-yellow-500/50 transition-colors group cursor-pointer"
                        onClick={() => navigate('/skills')}
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-left">
                                <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold inline-block mb-4">COMING SOON</div>
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">실시간 스킬 트리 제작</h3>
                                <p className="text-gray-400">나만의 최적화된 스킬 트리를 구성하고 공유하세요.</p>
                            </div>
                            {/* Placeholder for skill tree visual */}
                            <div className="flex-1 w-full h-32 bg-black/30 rounded-xl flex items-center justify-center border border-white/5">
                                <Zap className="text-gray-600" size={48} />
                            </div>
                        </div>
                    </div>

                    {/* Guide Card */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1 cursor-pointer">
                        <BookOpen className="text-cyan-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">가이드</h3>
                        <p className="text-gray-400 text-sm mb-4">초보자부터 전문가까지, 생존을 위한 필수 지식.</p>
                        <button className="text-cyan-400 text-sm font-bold hover:underline">자세히 보기</button>
                    </div>

                    {/* Map Card */}
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

                    {/* Skills & Progression */}
                    <div className="bg-gray-900 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1 cursor-pointer">
                        <Zap className="text-orange-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">스킬 & 진행</h3>
                        <p className="text-gray-400 text-sm mb-4">캐릭터 성장과 스킬 마스터리 가이드.</p>
                        <button className="text-orange-400 text-sm font-bold hover:underline">살펴보기</button>
                    </div>

                    {/* Database Cards */}
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
            </section>

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
                            image: "https://rs.nxfs.nexon.com/game/arcraiders/common/img_news_41.jpg" // Placeholder or try to guess? I'll use a generic placeholder or the one from the design if I can't get real ones. The user didn't provide images. I will keep the CSS gradient placeholder for now but make it clickable.
                        },
                        {
                            id: 39,
                            title: "The Evolution of ARC Raiders EP2: The Life of a Raider",
                            date: "2024. 10. 21",
                            link: "https://arcraiders.nexon.com/ko-KR/news/39"
                        },
                        {
                            id: 38,
                            title: "Update 1.4.0",
                            date: "2024. 10. 21",
                            link: "https://arcraiders.nexon.com/ko-KR/news/38"
                        },
                        {
                            id: 37,
                            title: "A Scrappy origin story",
                            date: "2024. 10. 16",
                            link: "https://arcraiders.nexon.com/ko-KR/news/37"
                        }
                    ].map((item) => (
                        <div
                            key={item.id}
                            className="group cursor-pointer"
                            onClick={() => window.open(item.link, '_blank')}
                        >
                            <div className="aspect-video bg-gray-800 rounded-xl mb-4 overflow-hidden relative">
                                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 group-hover:scale-105 transition-transform duration-500" />
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
                <p>&copy; 2024 ARC Raiders Hub. All rights reserved.</p>
                <p className="mt-2">This is a fan-made site and is not affiliated with Embark Studios.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
