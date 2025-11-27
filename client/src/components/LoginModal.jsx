import { useState } from 'react';
import useStore from '../store/useStore';
import { X, User, Lock, ArrowRight } from 'lucide-react';

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Join the Squad'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isLogin ? 'ARC Raiders 커뮤니티 맵에 로그인하세요.' : '새로운 계정을 생성하고 작전을 시작하세요.'}
                    </p>
                </div>

{
    error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center justify-center animate-in slide-in-from-top-2">
                        <label className="text-xs font-medium text-gray-500 ml-1">PASSWORD</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-arc-accent focus:ring-1 focus:ring-arc-accent focus:outline-none transition-all"
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-arc-accent hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-arc-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                {isLogin ? '로그인' : '계정 생성'} <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form >

        <div className="mt-6 text-center">
            <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-500 hover:text-arc-accent transition-colors underline underline-offset-4"
            >
                {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
        </div>
            </div >
        </div >
    );
};

export default LoginModal;
